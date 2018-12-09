import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i,j) {
    return (
      <Square
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i,j)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0,0)}
          {this.renderSquare(0,1)}
          {this.renderSquare(0,2)}
        </div>
        <div className="board-row">
          {this.renderSquare(1,0)}
          {this.renderSquare(1,1)}
          {this.renderSquare(1,2)}
        </div>
        <div className="board-row">
          {this.renderSquare(2,0)}
          {this.renderSquare(2,1)}
          {this.renderSquare(2,2)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(3).fill(Array(3).fill(null)),
          i: 0,
          j: 0
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i,j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice().map( function(row){ return row.slice(); });
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    squares[i][j] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          i: i,
          j: j
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step,move) => {
      const i = step.i;
      const j = step.j;
      const desc = move ?
        'Go to move #' + move + '(' + i + ',' + j + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button 
          onClick={() => this.jumpTo(move)}
          className={current === step ? "current_move" : null}
          >
          {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i,j) => this.handleClick(i,j)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  // horizontals
  if (squares[0][0] && squares[0][1] === squares[0][0] && squares[0][2] === squares[0][0]) {
    return squares[0][0];
  }
  if (squares[1][0] && squares[1][1] === squares[1][0] && squares[1][2] === squares[1][0]) {
    return squares[1,0];
  }
  if (squares[2][0] && squares[2][1] === squares[2][0] && squares[2][2] === squares[2][0]) {
    return squares[2][0];
  }

  // verticals
  if (squares[0][0] && squares[1][0] === squares[0][0] && squares[2][0] === squares[0][0]) {
    return squares[0][0];
  }if (squares[0][1] && squares[1][1] === squares[0,1] && squares[2][1] === squares[0][1]) {
    return squares[0][1];
  }if (squares[0][2] && squares[1][2] === squares[0,2] && squares[2][2] === squares[0][2]) {
    return squares[0][2];
  }


  // diagonals
  if (squares[0][0] && squares[1][1] === squares[0][0] && squares[2][2] === squares[0][0]) {
    return squares[0][0];
  }
  if (squares[0][2] && squares[1][1] === squares[0][2] && squares[2][0] === squares[0][2]) {
    return squares[0][2];
  }

  return null;
}