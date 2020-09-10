import { createElement, Component, render } from './ToyReact';

// class MyComponent extends Component {
//   constructor () {
//     super();
//     this.state = {
//       a: 1,
//       b: 2
//     }
//     // this.changeState();
//   }

//   // changeState() {
//   //   setTimeout(() => {
//   //     console.log('change');
//   //     this.state = {...this.state, a: 10}
//   //   }, 2000);
//   // }

//   render() {
//     return (
//       <div class="wrapper">
//         <h1>my component</h1>
//         <span>{this.state.a.toString()}</span>
//         <br/>
//         <button onClick={() => { this.setState({a: this.state.a + 1 }) } }>add</button>
//         <br/>
//         <span>{this.state.b.toString()}</span>
//         <br/>
//         {this.children}
//       </div>
//     )
//   }
// }

// render(<MyComponent class="a">
//   <div>1111</div>
//   <div>2222</div>
//   <div>3333</div>
//   <div>4444</div>
// </MyComponent>, document.body)



class Square extends Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}{this.renderSquare(1)}{this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}{this.renderSquare(4)}{this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}{this.renderSquare(7)}{this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

render(
  <Game />,
  document.getElementById('root')
);
