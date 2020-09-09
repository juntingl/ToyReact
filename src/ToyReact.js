class ElementWrapper {
  constructor (type) {
    this.root = document.createElement(type);
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(component) {
    this.root.appendChild(component.root)
  }
}

class TextWrapper {
  constructor (content) {
    this.root = document.createTextNode(content);
  }
}

export class Component {
  constructor () {
    this.props = Object.create(null);
    this.children = [];
    this._root = null;
  }

  setAttribute(name, value) {
    this.props[name] = value;
  }

  appendChild(component) {
    this.children.push(component)
  }

  get root() {
    if (!this._root) {
      this._root = this.render().root;
    }
    return this._root;
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
  return parentElement.appendChild(component.root);
}