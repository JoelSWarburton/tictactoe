function GameBoard() {
  const rows = 3;
  const columns = 3;
  let gameBoard = [];

  //Initialise the board
  const newGame = () => {
    gameBoard = []
    for (let i = 0; i < rows; i++) {
      gameBoard.push([]);
      for (let j = 0; j < columns; j++) {
        gameBoard[i].push("");
      }
    }
  };


  newGame(); //initialise on first run


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
    getBoard,
    newGame
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
    console.log("The result " + result)

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
    gameBoard.newGame();
    gameOver = false;
    switchPlayerTurn();
  }

  //initial round marker
  printNewRound();


  const hasGameFinished = () => gameOver; 

  return {playRound, getActivePlayer, newGame, getBoard: gameBoard.getBoard, hasGameFinished}
}



function ScreenController() {


  const game = GameController();

  //cache dom
  const playerTurnDiv = document.querySelector("#turn");
  const boardDiv = document.querySelector("#board");
  const newGameDiv = document.querySelector("#new-game");
  
  

  const update = () => {

    const board = game.getBoard();
    boardDiv.textContent = "";
    console.log("Getting board...")
    console.log(board);
    for(let i = 0; i < board.length; i++) {
      for(let j = 0; j < board[i].length; j++) {
        const button = document.createElement("button");

        button.dataset.row = i;
        button.dataset.col = j;
        button.textContent = board[i][j]
        
        
        boardDiv.appendChild(button);
      }
    }

    playerTurnDiv.textContent = game.getActivePlayer().name + "'s Turn";

    if(game.hasGameFinished()) {
      playerTurnDiv.textContent = game.getActivePlayer().name + " is the winner!";
      addNewGame();
    }

    
    boardDiv.addEventListener('click', handleClick);
  }

  const addNewGame = () => {
    //only allow one copy of the button to exist
    if(newGameDiv.hasChildNodes()) {
      return;
    }

    const newGameButton = document.createElement("button");
    newGameButton.textContent = "New game"
    newGameButton.classList.add("newGame");
   

    newGameDiv.appendChild(newGameButton);

    newGameButton.addEventListener("click", () => {
      game.newGame();
      update();
      newGameDiv.textContent = "";
    });
  }


  const handleClick = (e) => {
    game.playRound(e.target.dataset.row, e.target.dataset.col)
    update()
  }


  update(); //inital render of the board;
}
ScreenController();