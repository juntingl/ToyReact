import { createElement, Component, render } from './ToyReact';

class MyComponent extends Component {
  constructor () {
    super();
    this.state = {
      a: 1,
      b: 2
    }
    // this.changeState();
  }

  // changeState() {
  //   setTimeout(() => {
  //     console.log('change');
  //     this.state = {...this.state, a: 10}
  //   }, 2000);
  // }

  render() {
    return (
      <div class="wrapper">
        <h1>my component</h1>
        <span>{this.state.a.toString()}</span>
        <br/>
        <button onClick={() => { this.setState({a: this.state.a + 1 }) } }>add</button>
        <br/>
        <span>{this.state.b.toString()}</span>
        <br/>
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