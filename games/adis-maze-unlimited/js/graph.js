function getGraphVertices(grid)
{
  var vertices = [];

  for(var i = 0; i < grid.length; i++)
  {
    if(grid[i] != 0)
      continue;

    var world2D = get2DFrom1D(i);
    var pos2D = worldToGrid(world2D.x, world2D.y);

    if(getNeighbourScoreEx(grid, pos2D.x, pos2D.y) > 2)
      vertices.push({
        x: pos2D.x,
        y: pos2D.y
      });
  }

  return vertices;
}

function getMoveDirections(grid, x, y)
{
  var neighbours = getNeighboursEx(grid, x, y);

  var directions = [];

  if(neighbours.up    == 0) directions.push({ x:  0,  y: -1 });
  if(neighbours.down  == 0) directions.push({ x:  0,  y:  1 });
  if(neighbours.left  == 0) directions.push({ x: -1,  y:  0 });
  if(neighbours.right == 0) directions.push({ x:  1,  y:  0 });

  return directions;
}

function getDistantNeighbours(grid, vertices, px, py)
{
  var moveDirections = getMoveDirections(grid, px, py);

  var neighbours = [];

  for(var dir = 0; dir < moveDirections.length; dir++)
  {
    //Get the current move direction
    var direction = moveDirections[dir];

    var curX = px;
    var curY = py;

    for(var x = 0; x < (GameSettings.cols - 2) * Math.abs(direction.x); x++)
    {
      //Increment or decrement
      curX = (direction.x < 0) ? (curX - 1) : (curX + 1);

      //Break if out of range of the grid
      if(curX < 1 || curX > (GameSettings.cols - 1))
        break;

      //console.log(vertices);

      //console.log(vertices.filter(function(e) { return e.x == curX && e.y == curY }).length);
      if(vertices.filter(function(e) { return e.x == curX && e.y == curY }).length > 0)
      {
        neighbours.push({
          direction: direction,
          distance: x,
          x: curX,
          y: curY,
          vertIdx: vertices.findIndex(function(e) { return e.x == curX && e.y == curY })
        });

        break;
      }
    }

    curX = px;
    curY = py;


    for(var y = 0; y < (GameSettings.rows - 2) * Math.abs(direction.y); y++)
    {
      //Increment or decrement
      curY = (direction.y < 0) ? (curY - 1) : (curY + 1);

      //Break if out of range of the grid
      if(curY < 1 || curY > (GameSettings.rows - 1))
        break;


      if(vertices.filter(function(e) { return e.x == curX && e.y == curY }).length > 0)
      {
        neighbours.push({
          direction: direction,
          distance: y,
          x: curX,
          y: curY,
          gridIdx: get1DFrom2D(curX, curY),
          vertIdx: vertices.findIndex(function(e) { return e.x == curX && e.y == curY })
        });

        break;
      }
    }
  }

  return neighbours;
}

function buildGraph(grid)
{
  var vertices = getGraphVertices(grid);

  var graph = [];

  for(var i = 0; i < vertices.length; i++)
  {
    graph[i] = [];
    graph[i] = graph[i].concat(getDistantNeighbours(grid, vertices, vertices[i].x, vertices[i].y));
  }

  // console.log(vertices);
  // console.log(graph);

  return { graph: graph, vertices: vertices };
}
