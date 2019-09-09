var characters = [];
var characterSprites =
[
  {
      name: "ADI",
      walk: "img/character.png",
      scream: "img/character-scream.png",
      sprite: "player1",
      screamSprite: "player-scream1"
  },

  {
    name: "MADDY",
    walk: "img/maddi.png",
    scream: "img/maddi-scream.png",
    sprite: "player2",
    screamSprite: "player-scream2"
  },

  {
    name: "BARRY",
    walk: "img/barry.png",
    scream: "img/barry-scream.png",
    sprite: "player3",
    screamSprite: "player-scream3"
  },

  {
    name: "SALLY",
    walk: "img/sally.png",
    scream: "img/sally-scream.png",
    sprite: "player4",
    screamSprite: "player-scream4"
  }
];

var chosenCharacters = [];

var numberOfPlayers = 2;
var character;

var walls = [];
var grid = [];
var coinMap = [];
var cursors = [];
var scoreText;
var score = 0;

var currentMove = [ 0, 0 ];

var enemies = [];

var pickedUpCoins = 0;
var originalCoinAmount = 0;
var progressBar;
var nextDirection = [];

var lives = 3;

var game = new Phaser.Game(GameSettings.width, GameSettings.height, Phaser.CANVAS, GameSettings.canvasName,
{
  preload: preload,
  create: start,
  update: update,
  render: render
}, null, false, true);

var playerPos = [];

var switchSpriteTimer = null;
var characterSpeed = 1.1;

var playerDirection = [];
/*{
  x : 0,
  y : 0
}*/


/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function getNeighbours(x, y)
{
  return {
    up:    grid[get1DFrom2D(x, y - 1)],
    down:  grid[get1DFrom2D(x, y + 1)],
    left:  grid[get1DFrom2D(x - 1, y)],
    right: grid[get1DFrom2D(x + 1, y)]
  };
}

function preload()
{
  game.started = false;

  game.load.image("black", "img/black.png");
  game.load.image("logo", "img/logo.png");

  game.load.image("tile", "img/tile.png");
  game.load.image("coin", "img/coin.png");
  game.load.image("small-coin", "img/small-coin.png");

  game.load.image("progress-bg", "img/progress-bar-bg.png");
  game.load.image("progress-fg", "img/progress-bar-fg.png");

  //shuffle(characterSprites);

  for(var i = 0; i < characterSprites.length; i++)
  {
    var element = characterSprites[i];
    var playerNumber = i + 1;

    game.load.spritesheet("player" + playerNumber, element.walk, 24, 24);
    game.load.spritesheet("player-scream" + playerNumber, element.scream, 24, 24);
  }

  game.load.spritesheet("explosion", "img/explosion2.png", 32, 32);
  game.load.spritesheet("smoke", "img/smoke.png", 32, 32);

  game.load.spritesheet("enemy1", "img/enemy-1.png", 24, 24);
  game.load.spritesheet("enemy2", "img/enemy-2.png", 24, 24);
  game.load.spritesheet("enemy3", "img/enemy-3.png", 24, 24);
  game.load.spritesheet("enemy4", "img/enemy-4.png", 24, 24);
  game.load.spritesheet("enemy5", "img/enemy-5.png", 24, 24);

  game.load.audio("small-coin", "sound/small-coin.wav");
  game.load.audio("coin", "sound/coin.wav");
  game.load.audio("coin2", "sound/coin2.wav");

  game.load.audio("coin-pitch-1", "sound/coin-pitch-1.wav");
  game.load.audio("coin-pitch-2", "sound/coin-pitch-2.wav");
  game.load.audio("coin-pitch-3", "sound/coin-pitch-3.wav");
  game.load.audio("coin-pitch-4", "sound/coin-pitch-4.wav");


  game.load.audio("explosion", "sound/explosion.wav");
  game.load.audio("powerup", "sound/powerup.wav");
  game.load.audio("blip", "sound/blip.wav");
  game.load.audio("music", "sound/music.mp3");
  game.load.audio("game-over", "sound/game-over.wav");
  game.load.audio("win", "sound/win.wav");
}

function makeTiles()
{
  grid = new Array(GameSettings.cols * GameSettings.rows).fill(0);

  grid = generateMaze(grid);

  for(var i = 0; i < GameSettings.rows; i++)
    grid[get1DFrom2D(i, 0)] =
    grid[get1DFrom2D(i, GameSettings.rows - 1)] = 1;

  for(var i = 1; i < GameSettings.rows - 1; i++)
    grid[get1DFrom2D(i, 1)] =
    grid[get1DFrom2D(i, GameSettings.rows - 2)] = 0;

  for(var i = 0; i < GameSettings.cols; i++)
    grid[get1DFrom2D(0, i)] =
    grid[get1DFrom2D(GameSettings.rows - 1, i)] = 1;

  for(var i = 1; i < GameSettings.cols - 1; i++)
    grid[get1DFrom2D(1, i)] =
    grid[get1DFrom2D(GameSettings.cols - 2, i)] = 0;

  for(var i = 0; i < grid.length; i++)
  {
    if(grid[i] == 0)
      continue;

    var calcW = GameSettings.width  / GameSettings.cols;
    var calcH = GameSettings.height / GameSettings.rows;

    var calcX = Math.floor(i % GameSettings.cols) * calcW;
    var calcY = Math.floor(i / GameSettings.cols) * calcH;

    var wall = game.add.sprite(calcX, calcY, "tile");
    wall.width = calcW;
    wall.height = calcH;

    walls.push(wall);
  }
}

function addCoins()
{

  for(var i = 0; i < grid.length; i++)
  {
    var skip = false;

    for(var p = 0; p < numberOfPlayers; p++)
    {
      var player1DPos = get1DFrom2D(playerPos[p].x, playerPos[p].y);

      if(i == player1DPos)
        skip = true;
    }

    if(skip || grid[i] != 0)
    {
      coinMap[i] = ({ data: 0 });
      continue;
    }

    var worldPos = get2DFrom1D(i);

    var gridPos = worldToGrid(worldPos.x, worldPos.y);
    var score = getNeighbourScore(gridPos.x, gridPos.y);

    var coin;

    if(score >= 3)
      coin = game.add.sprite(worldPos.x, worldPos.y, "coin"),
      coinMap[i] = ({ data: 2, sprite: coin }),
      originalCoinAmount++;
    else
      coin = game.add.sprite(worldPos.x, worldPos.y, "small-coin"),
      coinMap[i] = ({ data: 1, sprite: coin }),
      originalCoinAmount++;

    coin.anchor.x = coin.anchor.y = 0.5;
  }

  //originalCoinAmount -= 8;
}

function getNeighbourScore(x, y)
{
  var neighbours = getNeighbours(x, y);

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

function placeCharacter()
{
  for(var i = 0; i < numberOfPlayers; i++)
  {
    var neighbours = getNeighbours(playerPos[i].x, playerPos[i].y);

    while(true)
    {
      var x = Math.floor(1 + Math.random() * (GameSettings.cols - 2));
      var y = Math.floor(1 + Math.random() * (GameSettings.rows - 2));

      if(x == 1 && y == 1)
        continue;

      if(grid[get1DFrom2D(x, y)] == 0)
      {
          playerPos[i] = { x : x, y : y };
          characters[i].position = gridToWorld(x, y);
          break;
      }
    }
  }
}

var coinSounds = [];
var smallCoinSound;
var explodeSound;
var powerupSound;
var blipSound;
var music;
var winSound;
var gameoverSound;
var gamepad;

var gameIsWon = false;
var graph;
var vertices;

var logger = [];

function destroyLoadingScreen()
{
  //The element
  var loadingScreen = document.getElementsByClassName("loading-screen")[0];

  if(typeof(loadingScreen) == "undefined")
    return;

  //Delete it
  loadingScreen.parentNode.removeChild(loadingScreen);
}

function start()
{

  //First, destroy the loading screen
  destroyLoadingScreen();

  //Creates the start menu..
  createStartMenu();

  //Reseed!
  Math.seedrandom(seed);

  music = game.add.audio("music");
  winSound = game.add.audio("win");

  gameoverSound = game.add.audio("game-over");
  game.ended = false;

  // scale the game 4x
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.scale.setUserScale(2, 2);

  initGamepad();

  grid = [];
  coinMap = [];

  coinSounds.push(game.add.audio("coin-pitch-1"));
  coinSounds.push(game.add.audio("coin-pitch-2"));
  coinSounds.push(game.add.audio("coin-pitch-3"));
  coinSounds.push(game.add.audio("coin-pitch-4"));

  smallCoinSound = game.add.audio("coin-small");
  explodeSound   = game.add.audio("explosion");
  powerupSound   = game.add.audio("powerup");
  blipSound      = game.add.audio("blip");

  // enable crisp rendering
  game.renderer.renderSession.roundPixels = true;
  Phaser.Canvas.setImageRenderingCrisp(game.canvas)

  //Set background colour to black
  game.stage.backgroundColor = "#222";
  document.body.style.backgroundColor = "#000";

  playerDirection = [];
  playerPos = [];
  nextDirection = [];
  characters = [];
  isInterpolating = [ false, false ];
  cursors = [];


  for(var i = 0; i < numberOfPlayers; i++)
  {
    //Set up loggers
    logger[i] = new Logger(i);
    logger[i].reset();

    //Set up cursor keys..
    cursors[i] = game.input.keyboard.createCursorKeys();

    if(i == 1)
    {
      cursors[i] =
      {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D)
      };
    }

    playerPos.push({
      x : 1,
      y : 1
    });

    nextDirection.push([]);

    playerDirection.push({
      x : 0,
      y : 0
    });
  }

  Phaser.Canvas.setSmoothingEnabled(game.context, false);
}

function setupCursors()
{
  var cursors = [];

  for(var i = 0; i < numberOfPlayers; i++)
  {
    //Set up cursor keys..
    cursors[i] = game.input.keyboard.createCursorKeys();

    if(i == 1)
    {
      cursors[i] =
      {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D)
      };
    }
  }

  return cursors;
}

function resetCharacters()
{
  for(var i = 0; i < characters.length; i++)
  {
    if(characters[i] != null)
      characters[i].destroy(); 
  }

  playerDirection = [];
  playerPos = [];
  nextDirection = [];
  characters = [];
  isInterpolating = [ false, false ];
  cursors = [];

  cursors = setupCursors();

  for(var i = 0; i < numberOfPlayers; i++)
  {
    playerPos.push({
      x : 1,
      y : 1
    });

    nextDirection.push([]);

    playerDirection.push({
      x : 0,
      y : 0
    });

    var pos = gridToWorld(playerPos[i].x, playerPos[i].y);

    //console.log(chosenCharacters);

    var playerNumber = i + 1;
    characters[i] = game.add.sprite(pos.x, pos.y, chosenCharacters[i].sprite);
    characters[i].anchor.x = 0.5;
    characters[i].anchor.y = 0.5;

    characters[i].animations.add("walk");
    characters[i].play("walk", 12, true);
    characters[i].visible = true;
  }
}

function lateStart()
{
  if(typeof(pauseLabel) != "undefined") pauseLabel.destroy();
  if(typeof(descText) != "undefined") descText.destroy();
  if(typeof(charSelectionSprite) != "undefined") charSelectionSprite.destroy();

  resetCharacters();

  makeTiles();

  placeCharacter();

  addCoins();

  var g = buildGraph(grid);

  graph = g.graph;
  vertices = g.vertices;

  addEnemies();

  scoreText = game.add.text(32, 4, " ", {
    font:  "12px Press Start 2P",
    fill:  "#000",
    align: "left"
  });

  var thickness = GameSettings.progressThickness;
  var progX = GameSettings.width - 32 - GameSettings.progressWidth + thickness;
  var progY = (16 - GameSettings.progressHeight) / 2 + thickness * 2;

  var progressBG = game.add.sprite(progX - thickness, progY - thickness, "progress-bg");
  progressBG.width  = GameSettings.progressWidth;
  progressBG.height = GameSettings.progressHeight;

  progressBar = game.add.sprite(progX, progY, "progress-fg");
  progressBar.width = GameSettings.progressWidth - thickness * 2;
  progressBar.height = GameSettings.progressHeight - thickness * 2;

  setProgress(0.0);

  game.world.bringToTop(enemyGroup);
}

function setProgress(percent)
{
  progressBar.width = (GameSettings.progressWidth - GameSettings.progressThickness * 2) * percent;
}

function canMoveInDirection(offsetX, offsetY, pos, player)
{
  var newX = (pos.x + offsetX);
  var newY = (pos.y + offsetY);

  var dir = playerDirection[player];

  //var directionChange = !(Math.abs(offsetX) == Math.abs(dir.x)) && (Math.abs(offsetX) == Math.abs(dir.x));

  //console.log(directionChange)
  //console.log(pos, newX, newY, grid[get1DFrom2D(newX, newY)]);

  return (grid[get1DFrom2D(newX, newY)] == 0);// && !directionChange;
}

function changeDirection(offsetX, offsetY, player=0)
{
  if(characters[player] == null)
    return;

  //last move is current move -- new move is offsetX & Y


  if(currentMove[player] == [])
    currentMove[player] = [offsetX, offsetY];

  //Have they changed direction (90 degrees) for either x or y
  var hasMovedX = Math.abs(currentMove[player][0]) != Math.abs(offsetX);
  var hasMovedY = Math.abs(currentMove[player][1]) != Math.abs(offsetY);
  var hasMoved = hasMovedX || hasMovedY;

  //If turned 90 degrees do next direction stuff
  if(hasMoved)
    nextDirection[player] = [offsetX, offsetY];

  //Otherwise -- they're going back on themselves, so do it immediately
  else
    playerDirection[player].x = offsetX,
    playerDirection[player].y = offsetY;

  if(playerDirection[player].x > 0)
    characters[player].scale.x = -1;

  else if(playerDirection[player].x < 0)
    characters[player].scale.x = 1;
}

var isInterpolating = [ false, false ];

function moveCharacter()
{
  for(var i = 0; i < numberOfPlayers; i++)
  {
    if(characters[i] == null)
      continue;

    //Run through each player. Get the position of the
    var pos1D = get1DFrom2D(playerPos[i].x + playerDirection[i].x, playerPos[i].y + playerDirection[i].y);
    var pos1DDir = get1DFrom2D(playerPos[i].x + nextDirection[i][0], playerPos[i].y + nextDirection[i][1]);

    var worldPos = gridToWorld(playerPos[i].x, playerPos[i].y);
    var dist = Math.abs(characters[i].position.x - worldPos.x) + Math.abs(characters[i].position.y - worldPos.y);

    if(characters[i].position.y < 0)
      endGame();

    if(grid[pos1DDir] == 0 && dist < 2 && nextDirection[i] != [])
    {
      characters[i].position.x = worldPos.x;
      characters[i].position.y = worldPos.y;

      //currentMove = [ , offsetY ];

      //changeDirection(nextDirection[i][0], nextDirection[i][1]);
      playerDirection[i].x = nextDirection[i][0];
      playerDirection[i].y = nextDirection[i][1];

      currentMove[i] = [ playerDirection[i].x, playerDirection[i].y ];

      if(playerDirection[i].x > 0)
        characters[i].scale.x = -1;

      else if(playerDirection[i].x < 0)
        characters[i].scale.x = 1;

      nextDirection[i] = [];
    }

    if(grid[pos1D] != 0 && dist < 1)
      continue;

    /*if(grid[pos1D] != 0 && !isInterpolating[i])
    {
      var target = gridToWorld(playerPos[i].x, playerPos[i].y);

      isInterpolating[i] = false;

      var tween = game.add.tween(characters[i]).to({
        x: [ target.x ],
        y: [ target.y ]
      }, 10, "Linear", true);

      tween.onComplete.addOnce(function()
      {
          console.log(i);
          isInterpolating[i] = true;
      }, this);

      continue;
    }*/

    //var worldPos = gridToWorld(playerPos[i].x + playerDirection[i].x, playerPos[i].y + playerDirection[i].y);

    characters[i].position.x += playerDirection[i].x * characterSpeed;
    characters[i].position.y += playerDirection[i].y * characterSpeed;

    var oldPos = playerPos[i];

    playerPos[i] = worldToGrid(characters[i].position.x, characters[i].position.y);

    if(oldPos.x != playerPos[i].x || oldPos.y != playerPos[i].y)
    {
      if(getHitJunctionXY(grid, playerPos[i].x, playerPos[i].y) != -1)
      {
        var pos1D = get1DFrom2D(playerPos[i].x, playerPos[i].y);
        logger[i].addJunction(pos1D);
      }

      logger[i].addPlayerStep(playerPos[i].x, playerPos[i].y);
    }
  }
}

function collectCoins()
{
  if(game.ended)
    return;

  for(var i = 0; i < numberOfPlayers; i++)
  {
    var pos1D = get1DFrom2D(playerPos[i].x, playerPos[i].y);

    if(coinMap[pos1D].data != 0)
    {
      var worldPos = gridToWorld(playerPos[i].x, playerPos[i].y);

      var explosion = game.add.sprite(worldPos.x, worldPos.y, "explosion");
      var explode = explosion.animations.add("explode");

      score += coinMap[pos1D].data * 5;

      scoreText.setText("SCORE: " + score);

      explosion.anchor.x = 0.5;
      explosion.anchor.y = 0.5;

      explosion.scale.x = explosion.scale.y = Math.random() + 1;
      explosion.animations.play("explode", 24, false);
      explosion.lifespan = 1000;

      clearTimeout(switchSpriteTimer);
      switchSpriteTimer = null;
      setTimeout(function(i)
      {
        if(game.ended)
          return;

        if(characters[i] == null)
          return;

        characters[i].loadTexture(chosenCharacters[i].sprite, 0);
        characters[i].animations.play("walk", 12, true);
      }, 1000, i);

      if(characters[i].animations.currentAnim.name != "scream")
      {
        characters[i].loadTexture(chosenCharacters[i].screamSprite, 0);
        characters[i].animations.add("scream");
        characters[i].animations.play("scream", 12, true);
      }

      //Sound
      coinSounds[0].play();
      explodeSound.play();


      //Juicy effects
      game.camera.shake(0.0025 * coinMap[pos1D].data, 50 * coinMap[pos1D].data);

      explode.onComplete.add(function()
      {
        explosion.destroy();
      }, this);

      coinMap[pos1D].sprite.destroy();
      coinMap[pos1D].data = 0;

      setProgress(++pickedUpCoins / originalCoinAmount);

      if(pickedUpCoins / originalCoinAmount >= 1 || gameIsWon)
        winGame(),
        gameIsWon = false;
    }
  }
}

function update()
{
  if(game.input.keyboard.downDuration(Phaser.KeyCode.Q, 1))
    window.location.href = "http://games.researcharcade.com/";

  if(!game.started)
  {
      startGameInput(cursors[0]);
      return;
  }

  if(game.ended)
  {
    endGameInput(cursors[0]);
    return;
  }

  if(game.won)
  {
    wonGameInput(cursors[0]);
    return;
  }


  moveEnemies();

  //handleGamepad();

  //console.log(spaceKey);

  //if(game.input.keyboard.downDuration(Phaser.KeyCode.SPACEBAR, 1))
  //  gameIsWon = true;


  for(var i = 0; i < numberOfPlayers; i++)
  {
    if(characters[i] == null)
      continue;

    if(cursors[i].up.downDuration(1))
      changeDirection(0, -1, i);

    else if(cursors[i].down.downDuration(1))
      changeDirection(0, 1, i);

    else if(cursors[i].left.downDuration(1))
      changeDirection(-1, 0, i);

    else if(cursors[i].right.downDuration(1))
      changeDirection(1, 0, i);
  }

  moveCharacter();

  collectCoins();

  drawProgress();
}

function moveEnemies()
{
  for(var i = 0; i < enemies.length; i++)
    updateEnemy(grid, enemies[i]);
}

function drawProgress()
{

}

function render()
{
}
