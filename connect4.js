/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const players = [];

class Player {
  constructor(number, color) {
    if (players.length === 2) {
      alert("2 players max!");
      throw new Error("2 players max!");
    }
    this.number = number
    this.color = color
    players.push(this);
  }
}

class Game {
  constructor(WIDTH, HEIGHT) {
    if (players.length !== 2) {
      alert("Need 2 players to play!");
      throw new Error("Need 2 players to play!");
    }
    this.WIDTH = WIDTH;
    this.HEIGHT = HEIGHT;
    this.board = [];
    this.currPlayer = players[0];
    this.makeBoard();
    this.makeHtmlBoard();
  }
  board = [] // array of rows, each row is array of cells  (board[y][x])

  // makeBoard: create in-JS board structure:
  // board = array of rows, each row is array of cells  (board[y][x])
  makeBoard() {
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  // makeHtmlBoard: make HTML table and row of column tops.
  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  // findSpotForCol: given column x, return top empty y (null if filled)
  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  // placeInTable: update DOM to place piece into HTML table of board
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = `${this.currPlayer.color}`;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  // endGame: announce game end
  endGame(msg) {
    alert(msg);
  }

  // handleClick: handle click of column top to play piece
  handleClick = (evt) => {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.number;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      const top = document.getElementById('column-top');
      top.removeEventListener('click', this.handleClick);
      return this.endGame(`Player ${this.currPlayer.number} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === players[0] ? players[1] : players[0];
  }


  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer.number
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}


const board = document.getElementById("board");
const startGameForm = document.getElementById('startGameForm');
const playerForm = document.getElementById('playerForm')

startGameForm.addEventListener("submit", function (e) {
  e.preventDefault();
  board.innerHTML = "";
  new Game(6, 7);
})

playerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  new Player(playerForm.elements[0].value, playerForm.elements[1].value)
  playerForm.reset();
})