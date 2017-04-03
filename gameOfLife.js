var board = [[0,0,0,0,0],
              [0,0,0,0,0],
              [0,1,1,1,0],
              [0,0,0,0,0],
              [0,0,0,0,0]];

function neighbors(board, row, col) {
  var aliveNeighbors = 0;
  var offsets = [
    [-1,-1], [-1,0], [-1,1],
    [0,-1], [0,1],
    [1,-1], [1,0], [1,1]
  ];
  for(let o of offsets){
    // console.log(o)
    if(0 <= (row + o[0]) && (row + o[0]) < board.length && 0 <= (col+o[1]) && (col+o[1]) < board[0].length ){
      if(board[row + o[0]][col + o[1]] == 1){aliveNeighbors += 1;}
    }
  }
  return aliveNeighbors;
}

function tick(){
  var nextBoard = JSON.parse(JSON.stringify(board));
  for(var row = 0; row < board.length; row++){
    for(var col = 0; col < board[row].length; col++){
      var liveNeighbors = neighbors(board, row, col);
      if(liveNeighbors == 3){
        nextBoard[row][col] = 1;
      }else if(board[row][col] == 1 && liveNeighbors == 2){
        nextBoard[row][col] = 1;
      }else{
        nextBoard[row][col] = 0;
      }
    }
  }
  // update global board
  board = nextBoard;
  return board;
}


console.log(board);
console.log(tick());
console.log(tick());

// Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
