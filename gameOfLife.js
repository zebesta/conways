var board = [[0,0,0,0,0],
              [0,0,0,0,0],
              [0,1,1,1,0],
              [0,0,0,0,0],
              [0,0,0,0,0]];

var width = window.innerWidth;
var colors = {
  dead: "#DDDDDD",
  alive: "#0000FF",
  blank: "#FFFFFF"
}

var height = window.innerHeight;
var canvas = document.getElementById('myCanvas');
var context=canvas.getContext("2d");
var runningButtonIcon = document.getElementById('runningBtnIcon');
var running = false;
canvas.width=width;
canvas.height=height;
console.log(width, height);
var numCellRows = board.length;
var numCellCols = board[0].length;
var cellWidth = Math.floor(width/numCellCols);
var cellHeight = Math.floor(height/numCellRows);

function initializeBoard(rows, columns){
  numCellRows = rows;
  numCellCols = columns;
  board = [];
  for(var i = 0; i < rows; i++){
    board.push([]);
    for(var j = 0; j < columns; j++){
      board[i].push(0);
    }
  }
  // acorn();

  cellWidth = Math.floor(width/numCellCols);
  cellHeight = Math.floor(height/numCellRows);
}

function resetBoard(){
  for(var row = 0; row < board.length; row++){
    for(var col = 0; col < board[row].length; col++){
      if(board[row][col]){
        updateCell(row, col, alive=true, clear=false)
      }else{
        updateCell(row, col, alive=false, clear=true)
      }
    }
  }
}

function acorn() {
  initializeBoard(Math.floor(height/4),Math.floor(width/4));
  // acorn configuration, definitely prone to errors based on vancas size...
  board[39][10]=1;
  board[40][12]=1;
  board[41][9]=1;
  board[41][10]=1;
  board[41][13]=1;
  board[41][14]=1;
  board[41][15]=1;
  resetBoard();
}

function line() {
  initializeBoard(Math.floor(height/4),Math.floor(width/4));
  // line configuration, prone to errors based on canvas size...
  board[10][13]=1;
  board[10][14]=1;
  board[10][15]=1;
  resetBoard();
}

function drawInitialBoard(){
  context.fillStyle=colors.alive;
  for(var row = 0; row < board.length; row++){
    for(var col = 0; col < board[row].length; col++){
      if(board[row][col]){
        context.fillRect(cellWidth*row, cellHeight*col, cellWidth, cellHeight);
      }
    }
  }
}

function updateCell(row, col, alive, clear){
  if(clear){
    context.fillStyle=colors.blank;
  }else if(alive){
    context.fillStyle=colors.alive;
  }else{
    context.fillStyle=colors.dead;
  }
  context.fillRect(cellWidth*row, cellHeight*col, cellWidth, cellHeight)
}

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
  // deep copy board
  var nextBoard = JSON.parse(JSON.stringify(board));
  for(var row = 0; row < board.length; row++){
    for(var col = 0; col < board[row].length; col++){
      var liveNeighbors = neighbors(board, row, col);
      if(liveNeighbors == 3){
        nextBoard[row][col] = 1;
        if(board[row][col]!==nextBoard[row][col]){
          updateCell(row, col, alive=true, clear=false);
        }
      }else if(board[row][col] == 1 && liveNeighbors == 2){
        nextBoard[row][col] = 1;
      }else{
        nextBoard[row][col] = 0;
        if(board[row][col]!== nextBoard[row][col]){
          updateCell(row, col, alive=false, clear=false);
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
    if(running){
      tick();
    }
    infinite();
  }, 100);
}

function runningButtonClick(){
  console.log("Toggle running!");
  running = !running;
  if(running){
    runningButtonIcon.className="glyphicon glyphicon-pause"
  }else{
    runningButtonIcon.className="glyphicon glyphicon-play"
  }

}

//initialize board and set width and height
acorn();
drawInitialBoard();
infinite();

// Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overpopulation.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
