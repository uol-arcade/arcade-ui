var enemyGroup;

var enemyNames = ["DITSY", "STINKY", "SQUIFFY", "CHOMP", "RED"];



function randomFreeIndex()

{

  while(true)

  {

    var randIndex = Math.floor(Math.random() * grid.length);



    if(grid[randIndex] == 0)

      return randIndex;

  }

}



function addEnemies()

{

  enemyGroup = game.add.group();



  for(var i = 0; i < enemyNames.length; i++)

  {

    var randomSlot = randomFreeIndex();



    var pos2D = get2DFrom1D(randomSlot);



    var gridPos = worldToGrid(pos2D.x, pos2D.y);



    var skip = false;



    for(var j = 0; j < numberOfPlayers; j++)

    {

      var distX = Math.abs(gridPos.x - playerPos[j].x);

      var distY = Math.abs(gridPos.y - playerPos[j].y);



      if(distX < 3 || distY < 3)

      {

        skip = true;

        break;

      }

    }



    if(skip)

    {

      i--;

      continue;

    }



    if(i == 1)

    {

      if(!onBorderXY(gridPos.x, gridPos.y))

      {

        i--;

        continue;

      }



      if(gridPos.x == 1 && gridPos.y == 1) { i--; continue; }

      if(gridPos.x == GameSettings.cols - 2 && gridPos.y == 1) { i--; continue; }

      if(gridPos.x == GameSettings.cols - 2 && gridPos.y == GameSettings.rows - 2) { i--; continue; }

      if(gridPos.x == 1 && gridPos.y == GameSettings.rows - 2) { i--; continue; }

    }



    var gridPos = worldToGrid(pos2D.x, pos2D.y);



    var enemy = game.add.sprite(pos2D.x, pos2D.y, "enemy" + (i+1));

    enemy.anchor.x = 0.5;

    enemy.anchor.y = 0.5;



    enemy.animations.add("walk");

    enemy.animations.play("walk", 12, true);



    enemyGroup.add(enemy);

    enemies.push({

      isInterpolating: false,

      sprite: enemy,

      aiType: i,

      speed: 1.1,

      x: gridPos.x,

      y: gridPos.y,

      timer: null,

      patrol: true,

      lastX: gridPos.x,

      lastY: gridPos.y,

      lastJunction: 0,

      destDirection: [],

      destPosition: [],

      name: enemyNames[i],

      dirX: 1,

      dirY: 0

    });



    if(i == 4)

      enemy.timer = setInterval(function()

      {

        switchBehaviours(enemies[enemies.length - 1]);

      }, 1000 * (10 + Math.floor(Math.random() * 3)));



    if(i != 1)

      selectRandomDirection(grid, enemies[enemies.length - 1]);



    else

    {

      var enemy = enemies[enemies.length - 1];



      if(enemy.x == GameSettings.cols - 2) changeEnemyDirection(enemy, 0, 1);

      else if(enemy.y == 1) changeEnemyDirection(enemy, 1, 0);

      else if(enemy.y == GameSettings.rows - 2) changeEnemyDirection(enemy, -1, 0);

      else if(enemy.x == 1) changeEnemyDirection(enemy, 0, -1);

    }

  }

}



function switchBehaviours(enemy)

{

  if(typeof(enemy) == "undefined")

    return;



  //Negate

  enemy.patrol = !enemy.patrol;

}



function moveEnemy(grid, enemy)

{

  var pos1D = get1DFrom2D(enemy.x + enemy.dirX, enemy.y + enemy.dirY);



  if(grid[pos1D] != 0 && !enemy.isInterpolating)

  {

    enemy.isInterpolating = true;



    var target = gridToWorld(enemy.x, enemy.y);



    var tween = game.add.tween(enemy.sprite).to({

      x: [ target.x ],

      y: [ target.y ]

    }, 200, "Linear", true);



    tween.onComplete.add(function()

    {

        enemy.isInterpolating = false;

    }, this);



    return;

  }



  enemy.sprite.position.x += enemy.dirX * enemy.speed;

  enemy.sprite.position.y += enemy.dirY * enemy.speed;



  var pos = worldToGrid(enemy.sprite.position.x, enemy.sprite.position.y);



  enemy.x = pos.x;

  enemy.y = pos.y;



  var hasHit = hasHitJunction(grid, enemy);



  if(hasHit)

  {

    if(enemy.aiType == 0)

      selectRandomDirection(grid, enemy);



    //else if(enemy.aiType == 3)

    //  moveToCentre(grid, enemy);

  }



  if(enemy.aiType == 2)

    chasePlayer(grid, enemy, hasHit);



  else if(enemy.aiType == 1)

    patrolBorder(grid, enemy);



  else if(enemy.aiType == 3)

    moveToCentre(grid, enemy);



  else if(enemy.aiType == 4)

    moveMixed(grid, enemy);

}



function moveMixed(grid, enemy)

{

  moveMixedBehaviour(grid, enemy);

}



function moveMixedBehaviour(grid, enemy)

{

  if(enemy.patrol)

    moveToCentre(grid, enemy, false);



  else

    patrolBorder(grid, enemy, false, true);



}



function moveToCentre(grid, enemy, chase=true)

{

  var seenPlayer = canSeePlayer(grid, enemy);

  var hitJunction = getHitJunction(grid, enemy);



  var world = gridToWorld(enemy.x, enemy.y);



  var distX = Math.abs(enemy.sprite.position.x - world.x) < 2;

  var distY = Math.abs(enemy.sprite.position.y - world.y) < 2;



  if(!(distX && distY))

    return;



  if(enemy.lastX == enemy.x && enemy.lastY == enemy.y)

    return;



  enemy.lastX = enemy.x;

  enemy.lastY = enemy.y;



  if((seenPlayer != null || enemy.destDirection.length > 0) && chase)

    chasePlayer(grid, enemy, hitJunction != -1);



  else

  {

    enemy.destDirection = enemy.destPosition = [];



    if(hitJunction == -1)

      return;



    moveToCentreBehaviour(grid, enemy);

  }

}



function moveToCentreBehaviour(grid, enemy)

{

  var neighbours = getDistantNeighbours(grid, vertices, enemy.x, enemy.y);



  var cx = GameSettings.cols / 2;

  var cy = GameSettings.rows / 2;



  var directions = [];



  var maxDist = GameSettings.cols - 1;



  for(var i = 0; i < neighbours.length; i++)

  {

    var dir = neighbours[i].direction;



    if(dir.x == -enemy.dirX && dir.y == -enemy.dirY)

      continue;



    var offsetX = neighbours[i].x;

    var offsetY = neighbours[i].y;



    var distX = Math.abs(cx - offsetX);

    var distY = Math.abs(cy - offsetY);



    var dist = distX + distY;



    for(var j = 0; j < (maxDist - dist); j++)

      directions.push(neighbours[i].direction);

  }



  // if(enemy.aiType == 4)

  //   console.log(enemy.x, enemy.y),

  //   console.log(directions);



  if(directions.length <= 0)

    selectRandomDirection(grid, enemy);



  else

  {

    var randDirection = directions[Math.floor(Math.random() * directions.length)];

    changeEnemyDirection(enemy, randDirection.x, randDirection.y);

  }

}



function canSeePlayer(grid, enemy)

{

    var directions = getMoveDirections(grid, enemy.x, enemy.y);

    var distance = 10;



    for(var dir = 0; dir < directions.length; dir++)

    {

      var curX = enemy.x, curY = enemy.y;



      var direction = directions[dir];



      for(var x = 0; x < distance * Math.abs(direction.x); x++)

      {

        //Increment or decrement

        curX = (direction.x < 0) ? (curX - 1) : (curX + 1);



        //Hit a wall.. nope

        if(grid[get1DFrom2D(curX, curY)] == 1)

          break;



        for(var i = 0; i < numberOfPlayers; i++)

        {

          if(characters[i] == null)

            continue;



          if(curX == playerPos[i].x && curY == playerPos[i].y)

            return {

              dir: direction,

              dist: x,

              x: playerPos[i].x,

              y: playerPos[i].y

            };

        }

      }



      curX = enemy.x;

      curY = enemy.y;



      for(var y = 0; y < distance * Math.abs(direction.y); y++)

      {

        //Increment or decrement

        curY = (direction.y < 0) ? (curY - 1) : (curY + 1);



        //Hit a wall.. nope

        if(grid[get1DFrom2D(curX, curY)] == 1)

          break;



        for(var i = 0; i < numberOfPlayers; i++)

        {

          if(characters[i] == null)

            continue;



          if(curX == playerPos[i].x && curY == playerPos[i].y)

            return {

              dir: direction,

              dist: x,

              x: playerPos[i].x,

              y: playerPos[i].y

            };

        }

      }

    }



    return null;

}



function chasePlayer(grid, enemy, hitJunction)

{

  var seePlayer = canSeePlayer(grid, enemy);

  var foundPlayer = (seePlayer != null);



  //if(foundPlayer)

  //  console.log(+new Date() + ": " + seePlayer.x + " .. " + seePlayer.y);

  //if(enemy.x != enemy.lastX || enemy.y != enemy.lastY || hitJunction)



  var world = gridToWorld(enemy.x, enemy.y);

  var distX = Math.abs(enemy.sprite.position.x - world.x) < 2;

  var distY = Math.abs(enemy.sprite.position.y - world.y) < 2;



  if(distX && distY)

  {

    if(foundPlayer)

    {

      //The player is seen! Set up direction and target position

      enemy.destDirection = [ seePlayer.dir.x, seePlayer.dir.y ];

      enemy.destPosition  = [ seePlayer.x, seePlayer.y ];



      if(enemy.dirX != enemy.destDirection[0] || enemy.dirY != enemy.destDirection[1])

        changeEnemyDirection(enemy, seePlayer.dir.x, seePlayer.dir.y);

    }

    else

    {

      if(enemy.x == enemy.destPosition[0] && enemy.y == enemy.destPosition[1])

      {

          enemy.destDirection = enemy.destPosition = [];

          selectRandomDirection(grid, enemy);

      }

    }



    if(hitJunction)

    {

      if(!foundPlayer && enemy.destPosition.length == 0)

        selectRandomDirection(grid, enemy);

    }

  }

}



function onBorderXY(x, y)

{

    return onBorder(null, {x : x, y : y });

}



function onBorder(grid, enemy)

{

  var x = enemy.x;

  var y = enemy.y;



  return x == 1 || x == (GameSettings.cols - 2) || y == 1 || y == (GameSettings.rows - 2);

}



function patrolBorder(grid, enemy, chase = true, invertDirection = false)

{

  var seenPlayer = canSeePlayer(grid, enemy);

  var hitJunction = getHitJunction(grid, enemy);



  var world = gridToWorld(enemy.x, enemy.y);



  var distX = Math.abs(enemy.sprite.position.x - world.x) < 2;

  var distY = Math.abs(enemy.sprite.position.y - world.y) < 2;



  if(!(distX && distY))

    return;



  if(enemy.lastX == enemy.x && enemy.lastY == enemy.y)

    return;



  enemy.lastX = enemy.x;

  enemy.lastY = enemy.y;



  if((seenPlayer != null || enemy.destDirection.length > 0) && chase)

    chasePlayer(grid, enemy, hitJunction != -1);



  else

  {

    enemy.destDirection = enemy.destPosition = [];



    if(!onBorder(grid, enemy))

      selectRandomDirection(grid, enemy);



    else

    {

      var neighbours = getNeighboursEx(grid, enemy.x, enemy.y);



      if(!invertDirection)

      {

        if(enemy.x == GameSettings.cols - 2) changeEnemyDirection(enemy, 0, 1);

        else if(enemy.y == 1) changeEnemyDirection(enemy, 1, 0);

        else if(enemy.y == GameSettings.rows - 2) changeEnemyDirection(enemy, -1, 0);

        else if(enemy.x == 1) changeEnemyDirection(enemy, 0, -1);

        else

          selectRandomDirection(grid, enemy);



        if(enemy.x == 1 && enemy.y == 1) changeEnemyDirection(enemy, 1, 0);

        else if(enemy.x == GameSettings.cols - 2 && enemy.y == 1) changeEnemyDirection(enemy, 0, 1);

        else if(enemy.x == GameSettings.cols - 2 && enemy.y == GameSettings.cols - 2) changeEnemyDirection(enemy, -1, 0);

        else if(enemy.x == 1 && enemy.y == GameSettings.cols - 2) changeEnemyDirection(enemy, 0, -1);

      }

      else

      {

        if(enemy.x == GameSettings.cols - 2) changeEnemyDirection(enemy, 0, -1);

        else if(enemy.y == 1) changeEnemyDirection(enemy, -1, 0);

        else if(enemy.y == GameSettings.rows - 2) changeEnemyDirection(enemy, 1, 0);

        else if(enemy.x == 1) changeEnemyDirection(enemy, 0, 1);

        else

          selectRandomDirection(grid, enemy);



        if(enemy.x == 1 && enemy.y == 1) changeEnemyDirection(enemy, 0, 1);

        else if(enemy.x == GameSettings.cols - 2 && enemy.y == 1) changeEnemyDirection(enemy, -1, 0);

        else if(enemy.x == GameSettings.cols - 2 && enemy.y == GameSettings.cols - 2) changeEnemyDirection(enemy, 0, -1);

        else if(enemy.x == 1 && enemy.y == GameSettings.cols - 2) changeEnemyDirection(enemy, 1, 0);

      }

    }

  }

}



function selectRandomDirection(grid, enemy)

{

  var neighbours = getNeighboursEx(grid, enemy.x, enemy.y);



  var possibleDirections = [];

  var actualDirections = [];



  if(neighbours.up    == 0) possibleDirections.push([0, -1]);

  if(neighbours.down  == 0) possibleDirections.push([0, 1]);

  if(neighbours.left  == 0) possibleDirections.push([-1, 0]);

  if(neighbours.right == 0) possibleDirections.push([1, 0]);





  for(var i = 0; i < possibleDirections.length; i++)

  {

    var dir = possibleDirections[i];



    if(dir[0] == -enemy.dirX && dir[1] == -enemy.dirY)

      continue;



    actualDirections.push(dir);

  }



  if(possibleDirections.length <= 1)

    actualDirections = possibleDirections;



  var randomDirection = actualDirections[Math.floor(Math.random() * actualDirections.length)];



  changeEnemyDirection(enemy, randomDirection[0], randomDirection[1]);

}



function changeEnemyDirection(enemy, x, y)

{

  enemy.dirX = x;

  enemy.dirY = y;



  if(x > 0)

    enemy.sprite.scale.x = -1;



  else if(x < 0)

    enemy.sprite.scale.x = 1;



  var target = gridToWorld(enemy.x, enemy.y);



  if(grid[get1DFrom2D(enemy.x + x, enemy.y + y)] != 0)

    return;



  enemy.sprite.position.x = target.x;

  enemy.sprite.position.y = target.y;

}



function hasHitJunction(grid, enemy)

{

  var hitJunction = getHitJunction(grid, enemy);



  if(hitJunction != -1)

  {

    var worldPos = get2DFrom1D(hitJunction);



    if(Math.abs(worldPos.x - enemy.sprite.position.x) > 2)

      return false;



    if(Math.abs(worldPos.y - enemy.sprite.position.y) > 2)

      return false;



    if(hitJunction == enemy.lastJunction)

      return false;



    else

    {

      enemy.lastJunction = hitJunction;

      return true;

    }

  }

  else

    return false;



}



function getHitJunctionXY(grid, x, y)

{

  return getHitJunction(grid, {x : x, y : y});

}



function getHitJunction(grid, enemy)

{

  var score = getNeighbourScoreEx(grid, enemy.x, enemy.y);



  if(score >= 3)

    return get1DFrom2D(enemy.x, enemy.y);



  else

    return -1;

}



function updateEnemy(grid, enemy)

{

  moveEnemy(grid, enemy);



  if(enemy.aiType == 1)

  {

    var time = +(new Date());

    var seconds = (time / 15000) % 1;



    if(seconds < 0.1 && Math.random() < 0.1)

    {

      var smoke = game.add.sprite(enemy.sprite.position.x, enemy.sprite.position.y, "smoke");

      var smokeAnim = smoke.animations.add("smoke");



      var scale = 1;



      smoke.anchor.setTo(0.5, 0.5);

      smoke.scale.setTo(scale, scale);

      smoke.angle = Math.random() * 360;



      smoke.animations.play("smoke", 12, false);

      smoke.lifespan = 3000;

    }

  }



  checkCollision(enemy);

}



var playerDeaths = 0;

var playerCopy = null;



function checkCollision(enemy)

{

  for(var i = 0; i < numberOfPlayers; i++)

  {

    if(characters[i] == null)

      continue;



    var distX = Math.abs(enemy.sprite.position.x - characters[i].position.x);

    var distY = Math.abs(enemy.sprite.position.y - characters[i].position.y);



    if(distX < 10 && distY < 10)

    {

      //console.log(playerDeaths + ".. " + numberOfPlayers);



      if(++playerDeaths < numberOfPlayers)

      {

        var explosion = game.add.sprite(characters[i].position.x, characters[i].position.y, "explosion");

        var explode = explosion.animations.add("explode");

        explosion.anchor.x = 0.5;

        explosion.anchor.y = 0.5;



        explosion.scale.x = explosion.scale.y = Math.random() + 2;

        explosion.animations.play("explode", 8, false);

        explosion.lifespan = 1000;



        playerCopy = characters[i];

        characters[i].destroy();

        characters[i] = null;

      }

      else

      {

        if(--lives <= 0)

          endGame(enemy);

        else

          endGameRestart(enemy);



        playerDeaths = 0;

        playerCopy = null;

      }

    }

  }

}

