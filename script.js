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

  const addMarker = (row, column, marker) => {
    if (checkSpaceFree(row, column)) {
      gameBoard[row][column] = marker;
      return true;
    }
    return false;
  };

  const checkSpaceFree = (row, column) => {
    return gameBoard[row][column] === "";
  };

  return {
    printBoard,
    addMarker,
  };
}
