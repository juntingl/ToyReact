const RENDER_TO_DOM = Symbol('render to DOM');


/**
 * 供外部继承的自定义组件
 */
export class Component {
  constructor () {
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
    this._range = null;
  }

  setAttribute(name, value) {
    this.props[name] = value;
  }

  appendChild(component) {
    this.children.push(component)
  }

  // 需要指定重新渲染的位置 Range API
  [RENDER_TO_DOM](range) {
    this._range = range;
    this.render()[RENDER_TO_DOM](range);
  }

  reRender() {
    let oldRange = this._range;

    // 创建一个新 range，放到老 range start 的位置
    let range = document.createRange();
    range.setStart(oldRange.startContainer, oldRange.startOffset);
    range.setEnd(oldRange.startContainer, oldRange.startOffset);
    this[RENDER_TO_DOM](range);

    // 将老的 range 移到新插入 range 位置的后面，然后移除老 range
    oldRange.setStart(range.endContainer, range.endOffset);
    oldRange.deleteContents();
  }

  setState(newState) {
    if (this.state === null || typeof this.state !== 'object') {
      this.state = newState;
      this.reRender();
      return;
    }
    let merge = (oldState, newState) => {
      for(let p in newState) {
        if (oldState[p] === null || typeof oldState[p] !== 'object') {
          oldState[p] = newState[p]
        } else {
          merge(oldState[p], newState[p]);
        }
      }
    }
    merge(this.state, newState);
    this.reRender();
  }

  get vdom () {
    return this.render().vdom;
  }

  get vchildren () {

  }
}

class ElementWrapper extends Component {
  constructor (type) {
    super(type);
    this.type = type;
  }

  // setAttribute(name, value) {
  //   if (name.match(/^on([\s\S]+)$/)) {
  //     this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value);
  //   } else {
  //     if (name === 'className') {
  //       this.root.setAttribute('class', value);
  //     } else {
  //       this.root.setAttribute(name, value);
  //     }
  //   }
  // }

  // appendChild(component) {
  //   let range = document.createRange();
  //   range.setStart(this.root, this.root.childNodes.length); // 为 0 ，parentElement 的第一个节点到最后一个节点
  //   range.setEnd(this.root, this.root.childNodes.length);
  //   range.deleteContents();// 清空
  //   component[RENDER_TO_DOM](range);
  // }

  [RENDER_TO_DOM](range) {
    range.deleteContents();

    let root = document.createElement(this.type);

    for (let name in this.props) {
      let value = this.props[name];
      if (name.match(/^on([\s\S]+)$/)) {
        root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value);
      } else {
        if (name === 'className') {
          root.setAttribute('class', value);
        } else {
          root.setAttribute(name, value);
        }
      }
    }

    for (let child of this.children) {
      let child_range = document.createRange();
      child_range.setStart(root, root.childNodes.length); // 为 0 ，parentElement 的第一个节点到最后一个节点
      child_range.setEnd(root, root.childNodes.length);
      child_range.deleteContents();// 清空
      child[RENDER_TO_DOM](child_range);
    }

    range.insertNode(root);
  }

  get vdom() {
    return this;
    // {
    //   type: this.type,
    //   props: this.props,
    //   children: this.children.map(child => child.vdom) // 组件 => VDOM
    // }
  }
}

class TextWrapper extends Component {
  constructor (content) {
    super(content);
    this.type = "#text";
    this.content = content;
    this.root = document.createTextNode(content);
  }

  [RENDER_TO_DOM](range) {
    range.deleteContents();
    range.insertNode(this.root);
  }

  get vdom () {
    return this
    // {
    //   type: '#text',
    //   content: this.content
    // }
  }
}

export function createElement(type, attributes, ...children) {
  let el;
  if (typeof type === 'string') {
    el = new ElementWrapper(type);
  } else {
    el = new type;
  }

  for(let i in attributes) {
    // 处理不是原生 DOM 对象时多包装一个 wrapper
    el.setAttribute(i, attributes[i])
  }

  const insertChildren = (children) => {
    for(let child of children) {
      if (typeof child === 'string') {
        child = new TextWrapper(child);
      }

      if (child === null) {
        continue;
      }

      if ((typeof child === 'object') && (child instanceof Array)) {
        insertChildren(child)
      } else {
        el.appendChild(child)
      }
    }
  }
  insertChildren(children);

  return el;
}

export function render (component, parentElement) {
  // 创建需要变更的区域
  let range = document.createRange();
  range.setStart(parentElement, 0); // 为 0 ，parentElement 的第一个节点到最后一个节点
  range.setEnd(parentElement, parentElement.childNodes.length);
  range.deleteContents();// 清空

  component[RENDER_TO_DOM](range);
}