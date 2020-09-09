import { createElement, Component, render } from './ToyReact';

class MyComponent extends Component{
  render() {
    return (
      <div>
        <h1>my component</h1>
        {this.children}
      </div>
    )
  }
}

render(<MyComponent class="a">
  <div>1111</div>
  <div>2222</div>
  <div>3333</div>
  <div>4444</div>
</MyComponent>, document.body)