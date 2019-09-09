function isBlocked(grid, offset, value)
{
  var pos = get1DFrom2D(offset.x, offset.y);

  if(grid[pos] == value)
    return true;
  else
    return false;
}

function calculateFrontier(grid, x, y, value = 1)
{
  var frontier = [];

  var minX = x > 1;
  var maxX = x < (GameSettings.cols - 1);

  var minY = y > 1;
  var maxY = y < (GameSettings.rows - 1);

  if(minX && minY && maxY && isBlocked(grid, { x: x - 2, y: y }, value))
    frontier.push({ x: x - 2, y: y });

  if(maxX && minY && maxY && isBlocked(grid, { x: x + 2, y: y }, value))
    frontier.push({ x: x + 2, y: y });

  if(minY && minX && maxX && isBlocked(grid, { x: x, y: y - 2 }, value))
    frontier.push({ x: x, y: y - 2 });

  if(maxY && minX && maxX && isBlocked(grid, { x: x, y: y + 2 }, value))
    frontier.push({ x: x, y: y + 2 });

  return frontier;
}

function generateMaze(grid)
{
  //Set up all walls
  for(var i = 0; i < grid.length; i++)
    grid[i] = 1;

  //Frontier
  var frontier = [];

  //Set the top left cell to part of the maze
  grid[get1DFrom2D(3,3)] = 0;

  //Add to frontier
  frontier = [{ x: 3, y: 3 }];
  frontier = frontier.concat(calculateFrontier(grid, 3, 3, 1));

  var k = 0;

  while(frontier.length > 0 && k++ < 5000)
  {
    //Random index into frontier
    var randomIndex = Math.floor(Math.random() * frontier.length);

    //Get 2D pos
    var pos2D = frontier[randomIndex];

    //Calculate passageway neighbours
    var neighbours = calculateFrontier(grid, pos2D.x, pos2D.y, 0);

    if(neighbours.length > 0)
    {
      //Get random neighbour index
      var neighbourRandomIndex = Math.floor(Math.random() * neighbours.length);

      //Get a random neighbour
      var randNeighbour = neighbours[neighbourRandomIndex];

      var diffX = Math.sign(pos2D.x - randNeighbour.x);
      var diffY = Math.sign(pos2D.y - randNeighbour.y);

      grid[get1DFrom2D(pos2D.x + diffX, pos2D.y + diffY)] = 0;
      grid[get1DFrom2D(pos2D.x, pos2D.y)] = 0;

      frontier = frontier.concat(calculateFrontier(grid, pos2D.x, pos2D.y, 1));
      frontier.splice(randomIndex, 1);
    }
  }

  //Return the grid
  return grid;
}
