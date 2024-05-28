function GameBoard() {
  const rows = 3;
  const columns = 3;
  const gameBoard = [];

  //Initialise the board
  for (let i = 0; i < rows; i++) {
    gameBoard.push([]);
    for (let j = 0; j < columns; j++) {
      gameBoard[i].push("");
    }
  }

  const printBoard = () => {
    console.log(gameBoard);
  };

  const getBoard = () => gameBoard;

  const addMarker = (row, column, marker) => {

    if(row < 0 || row >= rows || column < 0 || column >= columns) {
      return false;
    }

    if (checkSpaceFree(row, column)) {
      gameBoard[row][column] = marker;
      return true;
    }
    return false;
  };

  const checkSpaceFree = (row, column) => {
    return gameBoard[row][column] === "";
  };

  const checkGameWin = function(row, column) {
    let win = false;

    if(checkRow(row) || checkColumn(column) || checkDiagonal(row, column)) {
      win = true;
    }
    return win;
  }


  //helper functions for checkGameWin 
  const checkRow=(row) => {
    if(gameBoard[row][0] === "") {
      return false
    } 

    if(gameBoard[row][0] === gameBoard[row][1] && gameBoard[row][1] === gameBoard[row][2]) {
      return true;
    }

    return false;
  }

  const checkColumn = (column) => {
    if(gameBoard[0][column] === "") {
      return false
    } 

    if(gameBoard[0][column] === gameBoard[1][column] && gameBoard[1][column] === gameBoard[2][column]) {
      return true;
    }
    return false;
  }
  

  const checkDiagonal = () => {
    
    if(gameBoard[1][1] ==="") {
      return false;
    } 
    if(gameBoard[0][0] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[2][2]) {
      return true;
    }

    if(gameBoard[2][0] === gameBoard[1][1] && gameBoard[1][1] === gameBoard[0][2]) {
      return true
    }
    return false;
  }


  //expose the module
  return {
    printBoard,
    addMarker,
    checkGameWin,
    getBoard
  };
}

function GameController() {

  let gameBoard = GameBoard();
  const players = [{
    name: "playerOne",
    marker: "X"
  }, {
    name: "playerTwo",
    marker: "O"
  }]
  let gameOver = false;
  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }


  const getActivePlayer = () => activePlayer;

  const playRound = (row, col) => {

    if(gameOver) {
      console.log("Game is over!")
      return;
    }

    const result = gameBoard.addMarker(row, col, getActivePlayer().marker);

    if(!result) {
      console.log("Invalid placement!")
      console.log("take turn again");
      printNewRound();
      return;
    }

    if(gameBoard.checkGameWin(row, col)) {
      console.log("The winner was: " + getActivePlayer().name + "!");
      gameOver = true;
      return;
    }
    switchPlayerTurn();
    printNewRound();
  }

  const printNewRound = () => {
    console.log(gameBoard.printBoard());
    console.log(getActivePlayer().name + "'s turn!")
  }


  const newGame = () => {

    if(!gameOver) {
      console.log("finish current game first!")
      return;
    }
    gameBoard = GameBoard();
    gameOver = false;
  }

  //initial round marker
  printNewRound();


  return {playRound, getActivePlayer, newGame, getBoard: gameBoard.getBoard}
}



function ScreenController() {


  const game = GameController();

  //cache dom
  const playerTurnDiv = document.querySelector("#turn");
  const boardDiv = document.querySelector("#board");

  

  const update = () => {

    const board = game.getBoard();

    for(let i = 0; i < board.length; i++) {
      for(let j = 0; j < board[i].length; j++) {
        const button = document.createElement("button");
        button.dataset.row = i;
        button.dataset.col = j;
        button.textContent = "Y";
        boardDiv.appendChild(button);
      }
    }

    const handleClick = (e) => {
      console.log(e.target.dataset.row)
    }

    boardDiv.addEventListener('click', handleClick);
  }

  update();
}
ScreenController();