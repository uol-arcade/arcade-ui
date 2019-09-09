function gridToWorld(x, y)
{
  var tileWidth  = (GameSettings.width  / GameSettings.cols);
  var tileHeight = (GameSettings.height / GameSettings.rows);

  //Calculate x and y
  var calcX = (x + 1) * tileWidth - (tileWidth / 2);
  var calcY = (y + 1) * tileHeight - (tileHeight / 2);

  //Return them as a vec2 struct
  return {
    x: calcX,
    y: calcY
  };
}

function get1DFrom2D(x, y)
{
  return x + GameSettings.cols * y;
}

function get2DFrom1D(i)
{
    var calcW = GameSettings.width  / GameSettings.cols;
    var calcH = GameSettings.height / GameSettings.rows;

    var x = Math.floor(i % GameSettings.cols) * calcW;
    var y = Math.floor(i / GameSettings.cols) * calcH;

    x += calcW / 2;
    y += calcH / 2;

    return { x : x, y : y };
}

function worldToGrid(x, y)
{
  var offsetX = (GameSettings.width  / GameSettings.cols) / 2;
  var offsetY = (GameSettings.height / GameSettings.rows) / 2;

  var pX = x / GameSettings.width;
  var pY = y / GameSettings.height;

  var calcX = Math.floor(GameSettings.cols * pX);
  var calcY = Math.floor(GameSettings.rows * pY);

  return {
    x: calcX,
    y: calcY
  };
}

function getNeighboursEx(grid, x, y)
{
  return {
    up:    grid[get1DFrom2D(x, y - 1)],
    down:  grid[get1DFrom2D(x, y + 1)],
    left:  grid[get1DFrom2D(x - 1, y)],
    right: grid[get1DFrom2D(x + 1, y)]
  };
}

function getNeighbourScoreEx(grid, x, y)
{
  var neighbours = getNeighboursEx(grid, x, y);

  var score = 0;

  if((neighbours.up == 0 || neighbours.down == 0) &&
     (neighbours.left == 0 || neighbours.right == 0))
    return 3;

  if(neighbours.up == 1)
    score++;

  if(neighbours.left == 1)
    score++;

  if(neighbours.down == 1)
    score++;

  if(neighbours.right == 1)
    score++;

  return score;
}
