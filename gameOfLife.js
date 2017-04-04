var board = [[0,0,0,0,0],
              [0,0,0,0,0],
              [0,1,1,1,0],
              [0,0,0,0,0],
              [0,0,0,0,0]];

var width = window.innerWidth;
var height = window.innerHeight;
var canvas = document.getElementById('myCanvas');
var context=canvas.getContext("2d");
canvas.width=width;
canvas.height=height;
console.log(width, height);
var NUM_CELL_ROWS = board.length;
var NUM_CELL_COLS = board[0].length;
var cellWidth = Math.floor(width/NUM_CELL_COLS);
var cellHeight = Math.floor(height/NUM_CELL_ROWS);

function checkerBoard(rows, cols, cellWidth, cellHeight){
  context.fillStyle="#000000";
  for(var i = 0; i < rows; i++){
    for(var j = 0; j < cols; j++){
      if((i%2 == 0 && j%2 == 1) || (i%2 == 1 && j%2 == 0)){
        context.fillRect(cellWidth*j, cellHeight*i, cellWidth, cellHeight)
      }
    }
  }
}

function initializeBoard(){
  context.fillStyle="#0000FF";
  for(var row = 0; row < board.length; row++){
    for(var col = 0; col < board[row].length; col++){
      if(board[row][col]){
        context.fillRect(cellWidth*row, cellHeight*col, cellWidth, cellHeight);
      }
    }
  }
}

function updateCell(row, col, alive){
  if(alive){
    context.fillStyle="#FFFFFF";
  }else{
    context.fillStyle="#0000FF";
  }
  context.fillRect(cellWidth*row, cellHeight*col, cellWidth, cellHeight)
}


// checkerBoard(NUM_CELL_ROWS, NUM_CELL_COLS, cellWidth, cellHeight);

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
        if(board[row][col]!==nextBoard[row][col]){
          updateCell(row, col, alive=true);
        }
      }else if(board[row][col] == 1 && liveNeighbors == 2){
        nextBoard[row][col] = 1;
      }else{
        nextBoard[row][col] = 0;
        if(board[row][col]!==nextBoard[row][col]){
          updateCell(row, col, alive=false);
        }
      }
    }
  }
  // update global board
  board = nextBoard;
  return board;
}



function infinite(){
  setTimeout(function(){
      tick();
      infinite();
    }, 1000);
}

initializeBoard();
infinite();

// Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
