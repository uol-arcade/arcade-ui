
var countdown = 5;
var countdownTimer = null;
var pauseLabel;
var menuIndex = 0;

var delayTimeRestart = 15 * 1000;

var menuItems = ["RETRY", "EXIT"];
var menuItemSprites = [];

var warningText;
var cursor;
var descText;
var enemySprite;
var bg;
var stage = 0;

var charSelectionSprite;
var currentSelectionIndex = 0;
var currentPlayerIndex = 0;

var lastKeyPress = +new Date();

function enterPressed(player = -1)
{
  if(player == -1)
  {
    if(game.input.keyboard.downDuration(Phaser.KeyCode.ENTER, 1))
      return true;

    if(game.input.keyboard.downDuration(Phaser.KeyCode.BACKSPACE, 1))
      return true;

    if(game.input.keyboard.downDuration(Phaser.KeyCode.Z, 1))
        return true;

    if(game.input.keyboard.downDuration(Phaser.KeyCode.F, 1))
        return true;
  }
  else if(player == 0)
  {
    if(game.input.keyboard.downDuration(Phaser.KeyCode.ENTER, 1))
      return true;

    if(game.input.keyboard.downDuration(Phaser.KeyCode.Z, 1))
        return true;
  }
  else if(player == 1)
  {
    if(game.input.keyboard.downDuration(Phaser.KeyCode.BACKSPACE, 1))
      return true;

    if(game.input.keyboard.downDuration(Phaser.KeyCode.F, 1))
        return true;
  }
}

function createStartMenu()
{

  document.body.style.backgroundColor = "#000";

  if(game.started || stage > 0)
    return;

  menuIndex = 0;
  menuItems = ["1 PLAYER", "2 PLAYERS", "EXIT"]

  for(var i = 0; i < menuItemSprites.length; i++)
  {
      if(menuItemSprites[i] != null && typeof(menuItemSprites) != "undefined")
        menuItemSprites[i].destroy();
  }

  if(typeof(enemySprite) != "undefined") enemySprite.destroy();

  menuItemSprites = [];

  var cx = game.world.centerX;
  var cy = game.world.centerY;

  bg = game.add.sprite(0, 0, "black");

  bg.width = GameSettings.width;
  bg.height = GameSettings.height;
  bg.alpha = 1;

  pauseLabel = game.add.sprite(cx , cy - 64, "logo");
  pauseLabel.anchor.setTo(0.5, 0.5);
  pauseLabel.scale.setTo(2, 2);

  for(var i = 0; i < menuItems.length; i++)
  {
    var calcX = cx;
    var calcY = (cy + 64) + (i * 32);

    var sprite = game.add.text(calcX, calcY, menuItems[i],
    {
      font: "12pt Press Start 2P",
      fill: "#fff"
    });

    sprite.anchor.setTo(0.5, 0.5);

    menuItemSprites.push(sprite);
  }

  cursor = game.add.text(0, 0, "<",
  {
    font: "12pt Press Start 2P",
    fill: "#fff"
  });

  cursor.anchor.setTo(0.5, 0.5);
}

function startGame()
{
  chosenCharacters = [];

  var cx = game.world.centerX;
  var cy = game.world.centerY;

  currentPlayerIndex = 0;
  currentSelectionIndex = 0;
  pauseLabel.destroy();

  var keyTexts   = ["arrow keys", "d-pad/arrow keys"];
  var startTexts = ["ENTER", "ENTER/START"];

  //console.log(game.input.gamepad.active);

  var keyText = keyTexts[+(navigator.getGamepads()[0] != null)];
  var startText = startTexts[+(navigator.getGamepads()[0] != null)];

  var text = "Use the " + keyText + "\nto move Adi around.\n\nCollect all the coins and\navoid the enemies to win\nthe level! You have 3 lives\nso be careful!";
  text += "\n\nBy playing this game you are\ncontributing to our research.";


  text += "\n\nBy pressing " + startText + " you are\n consenting to your gameplay\n data being recorded.";
    text += "\n\nFor more information\ncontact researcharcade@gmail.com";

  stage++;

  pauseLabel = game.add.text(cx, cy, text,
  {
    fill: "#fff",
    font: "8pt Press Start 2P",
    align: "center"
  });

  pauseLabel.anchor.setTo(0.5, 0.5);

  cursor.destroy();
  for(var i = 0; i < menuItemSprites.length; i++) menuItemSprites[i].destroy();
}

function drawCharacterSprite()
{
  //Centre coordinates
  var cx = game.world.centerX;
  var cy = game.world.centerY;

  //Destroy all text
  if(typeof(pauseLabel) != "undefined") pauseLabel.destroy();
  if(typeof(descText) != "undefined") descText.destroy();

  if(typeof(charSelectionSprite) != "undefined") charSelectionSprite.destroy();

  var data = characterSprites[currentSelectionIndex];
  charSelectionSprite = game.add.sprite(cx, cy, "player" + (currentSelectionIndex + 1));
  charSelectionSprite.anchor.setTo(0.5, 0.5);
  charSelectionSprite.scale.setTo(2, 2);

  var anim = charSelectionSprite.animations.add("walk");
  anim.play(12, true);

  pauseLabel = game.add.text(cx, cy - 80, "PLAYER " + (currentPlayerIndex + 1) + "\nCHOOSE YOUR CHARACTER",
  {
    font: "14pt Press Start 2P",
    fill: "yellow"
  });

  descText = game.add.text(cx, cy + 48, " < " + data.name + " > ",
  {
    font: "12pt Press Start 2P",
    fill: "#fff"
  });

  pauseLabel.anchor.setTo(0.5, 0.5);
  descText.anchor.setTo(0.5, 0.5);
}

function characterSelection()
{
  drawCharacterSprite();
}

function destroyStartMenu()
{
  currentSelectionIndex = Math.floor(Math.random() * characterSprites.length);

  characterSelection();
}

function generateNewLevel(callStart=false)
{
  seed = Math.floor(Math.random() * 0xffffff);

  //Ended and won are false
  game.ended = false;
  game.won = false;
  game.started = true;

  countdown = 5;

  for(var i = 0; i < menuItemSprites.length; i++)
  {
      if(menuItemSprites[i] != null && typeof(menuItemSprites) != "undefined")
        menuItemSprites[i].destroy();
  }

  if(typeof(enemySprite) != "undefined") enemySprite.destroy();

  document.body.style.backgroundColor = "#222";

  //Remove all enemies
  for(var i = 0; i < enemies.length; i++)
  {

    if(typeof(enemies[i].timer) !== "undefined" && enemies[i].timer != null)
      clearInterval(enemies[i].timer);

    enemies[i].sprite.destroy();
  }
  enemies = [];

  if(typeof(warningText) != "undefined") warningText.destroy();

  //Remove all walls
  for(var i = 0; i < walls.length; i++) walls[i].destroy();
  walls = [];
  grid = [];

  //Remove all coins
  for(var i = 0; i < coinMap.length; i++) if(coinMap[i].data != 0) coinMap[i].sprite.destroy();
  coinMap = [];


  //Destroy text
  for(var i = 0; i < menuItemSprites.length; i++) menuItemSprites[i].destroy();
  menuItemSprites = [];
  //--
  if(typeof(pauseLabel) != "undefined") pauseLabel.destroy();
  if(typeof(cursor) != "undefined") cursor.destroy();
  if(typeof(bg) != "undefined") bg.destroy();
  if(typeof(progressBar) != "undefined") progressBar.destroy();
  if(typeof(descText) != "undefined") descText.destroy();

  clearInterval(countdownTimer);
  countdownTimer = null;

  //Reset variables
  pickedUpCoins = 0;
  isInterpolating = false;
  originalCoinAmount = 0;
  nextDirection = [];
  playerDirection = { x: 0, y: 0 };
  //score = 0;
  lives = 3;

  //Restart logger
  for(var i = 0; i < logger.length; i++)
    logger[i].reset();

  //Start
  if(!callStart)
    lateStart();
  else
    start();
}

function endGameRestart(enemy)
{
  gameoverSound.play();

  lastKeyPress = +new Date();

  game.won = true;

  for(var i = 0; i < characters.length; i++)
  {
    if(characters[i] == null)
    {
      // console.log(chosenCharacters);

      var pos = gridToWorld(playerPos[i].x, playerPos[i].y);

      characters[i] = game.add.sprite(pos.x, pos.y, chosenCharacters[i].sprite);
      characters[i].anchor.setTo(0.5, 0.5);

      characters[i].animations.add("walk");
      characters[i].play("walk", 12, true);
      characters[i].visible = true;
    }
  }

  var cx = game.world.centerX;
  var cy = game.world.centerY;

  bg = game.add.sprite(0, 0, "black");

  bg.width = GameSettings.width;
  bg.height = GameSettings.height;
  bg.alpha = 0.8;

  var text = lives + ((lives == 1) ? (" LIFE LEFT") : (" LIVES LEFT"));

  pauseLabel = game.add.text(cx, cy - 64, text,
  {
    font: "16pt Press Start 2P",
    fill: "#fff"
  });

  //Log the death
  for(var i = 0; i < logger.length; i++)
    logger[i].onDeath(enemy, false);

  var startTexts = ["ENTER", "START"];

  var startText = startTexts[+(navigator.getGamepads()[0] != null)];

  descText = game.add.text(cx, cy + 18, "YOU WERE CAUGHT BY " + enemy.name + "\n\n\n\nPRESS " + startText + " TO CONTINUE",
  {
    font: "10pt Press Start 2P",
    fill: "#fff",
    align: "center"
  });


  for(var i = 0; i < enemies.length; i++)
    enemies[i].sprite.destroy();

  clearTimeout(switchSpriteTimer);
  switchSpriteTimer = null;
  menuIndex = 0;

  enemySprite = game.add.sprite(cx, cy + 16, "enemy" + (enemy.aiType + 1));
  enemySprite.scale.setTo(2, 2);
  enemySprite.animations.add("walk");
  enemySprite.play("walk", 12, true);
  enemySprite.anchor.setTo(0.5, 0.5);

  descText.anchor.setTo(0.5, 0.5);
  pauseLabel.anchor.setTo(0.5, 0.5);
}

function startGameInput(cursors)
{
  if(stage == 65535)
  {
    cursors = setupCursors();

    if(cursors[currentPlayerIndex].left.downDuration(10))
    {
      currentSelectionIndex = (currentSelectionIndex - 1 < 0) ? (characterSprites.length - 1) : (currentSelectionIndex - 1);
      blipSound.play();
      drawCharacterSprite();
    }
    else if(cursors[currentPlayerIndex].right.downDuration(10))
    {
      currentSelectionIndex = (currentSelectionIndex + 1),
      currentSelectionIndex %= characterSprites.length;
      blipSound.play();
      drawCharacterSprite();
    }
    else if(enterPressed(currentPlayerIndex))
    {
      chosenCharacters.push(characterSprites[currentSelectionIndex]);

      currentSelectionIndex = 0;
      currentPlayerIndex++;
      blipSound.play();

      if(currentPlayerIndex >= numberOfPlayers)
      {
        lateStart();

        document.body.style.backgroundColor = "#222";
        pauseLabel.destroy();
        bg.destroy();
        if(typeof(warningText) != "undefined") warningText.destroy();
        game.started = true;
      }
      else
        drawCharacterSprite();
    }
    return;
  }

  if(cursors.down.downDuration(10) || gamepadUpPressed())
  {
    menuIndex = (menuIndex + 1),
    menuIndex %= menuItems.length;
    blipSound.play();
  }
  else if(cursors.up.downDuration(10) || gamepadDownPressed())
  {
    menuIndex = (menuIndex - 1 < 0) ? (menuItems.length - 1) : (menuIndex - 1);
    blipSound.play();
  }
  else if(enterPressed(0))
  {
    if(stage > 0)
    {
        stage = 65535;

        destroyStartMenu();
        return;
    }

    if(menuIndex == 0)
      numberOfPlayers = 1,
      startGame();

    else if(menuIndex == 1)
      numberOfPlayers = 2,
      startGame();

    else if(menuIndex == 2)
      window.location.href = "http://games.researcharcade.com/";
  }

  var cx = game.world.centerX;
  var cy = game.world.centerY;

  var cursorX = cx + 96;
  var cursorY = (cy + 64) + (menuIndex * 32);

  cursor.position.setTo(cursorX, cursorY);
}

function endGameInput(cursors)
{
  var time = +new Date();

  if((time - lastKeyPress) >= 10000)
  {
    var timeLeft = delayTimeRestart - (time - lastKeyPress);

    timeLeft /= 1000;

    timeLeft = Math.round(timeLeft);

    if(typeof(warningText) != "undefined") warningText.destroy();

    if(timeLeft < 0)
      return;

    var cx = game.world.centerX;
    var cy = game.world.centerY;

    warningText = game.add.text(cx - 108, cy + 96, "EXITING IN " + timeLeft + " SECONDS",
    {
      fill: "#fff",
      font: "8pt Press Start 2P",
      align: "center"
    });
  }

  if((time - lastKeyPress) >= delayTimeRestart && window.location.href != "http://games.researcharcade.com/")
  {
    lastKeyPress = time;
    console.log("going to games.researcharcade.com");
    window.location.href = "http://games.researcharcade.com/";
  }

  if(cursors.up.downDuration(10) || gamepadUpPressed())
    menuIndex = (menuIndex + 1),
    lastKeyPress = +new Date(),
    blipSound.play(),
    menuIndex %= menuItems.length;

  else if(cursors.down.downDuration(10) || gamepadDownPressed())
    menuIndex = (menuIndex - 1 < 0) ? (menuItems.length - 1) : (menuIndex - 1),
    blipSound.play(),
    lastKeyPress = +new Date();

  else if(enterPressed() || gamepadStartPressed())
  {
    lastKeyPress = +new Date();

    if(menuIndex == 0)
    {
      generateNewLevel(true);
      game.started = false;
      stage = 0;
      createStartMenu();
    }

    else if(menuIndex == 1)
      window.location.href = "http://games.researcharcade.com/";
  }

  var cx = game.world.centerX;
  var cy = game.world.centerY;

  var cursorX = cx + 64;
  var cursorY = (cy + 48) + (menuIndex * 32);

  cursor.position.setTo(cursorX, cursorY);
}

function wonGameInput(cursors)
{
  var time = +new Date();

  if((time - lastKeyPress) >= 10000)
  {
    var timeLeft = delayTimeRestart - (time - lastKeyPress);

    timeLeft /= 1000;

    timeLeft = Math.round(timeLeft);

    if(typeof(warningText) != "undefined") warningText.destroy();

    if(timeLeft < 0)
      return;

    var cx = game.world.centerX;
    var cy = game.world.centerY;

    warningText = game.add.text(cx - 108, cy + 96, "EXITING IN " + timeLeft + " SECONDS",
    {
      fill: "#fff",
      font: "8pt Press Start 2P",
      align: "center"
    });
  }

  if((time - lastKeyPress) >= delayTimeRestart && window.location.href != "http://games.researcharcade.com/")
  {
    lastKeyPress = time;
    console.log("going to games.researcharcade.com");
    window.location.href = "http://games.researcharcade.com/";
  }

  if(!(enterPressed() || gamepadStartPressed()))
    return;

  if(typeof(warningText) != "undefined") warningText.destroy();
  descText.destroy();

  var oldScore = score;

  descText.destroy();
  bg.destroy();
  enemySprite.destroy();
  pauseLabel.destroy();

  game.ended = game.won = false;

  for(var i = 0; i < enemies.length; i++)
  {
    enemies[i].sprite.destroy();
  }

  clearInterval(countdownTimer);

  enemies = [];
  addEnemies();

  score = oldScore;
}

function winGame()
{
  winSound.play();
  winSound.volume = 1.0;
  lastKeyPress = 99999999;
  game.won = true;

  var cx = game.world.centerX;
  var cy = game.world.centerY;

  bg = game.add.sprite(0, 0, "black");

  bg.width = GameSettings.width;
  bg.height = GameSettings.height;
  bg.alpha = 0.8;

  pauseLabel = game.add.text(cx, cy - 64, "YOU WON!",
  {
    font: "16pt Press Start 2P",
    fill: "#70d1ff"
  });

  descText = game.add.text(cx, cy - 16, "YOUR SCORE IS " + score,
  {
    font: "10pt Press Start 2P",
    fill: "#fff"
  });

  clearTimeout(switchSpriteTimer);
  switchSpriteTimer = null;
  menuIndex = 0;

  var loggerData = [];

  //Log the win
  for(var i = 0; i < logger.length; i++)
  {
    logger[i].onWin();

    var data = logger[i].getData();

    if(Object.keys(data).length > 0)
      loggerData.push(data);
  }

  Logger.pushData(loggerData);


  if(characters[0] != null)
  {
    characters[0].position.x = cx;
    characters[0].position.y = cy + 16;
    characters[0].scale.setTo(2, 2);

    setTimeout(function()
    {
      characters[0].loadTexture(chosenCharacters[0].screamSprite, 0);
      characters[0].animations.add("scream");
      characters[0].animations.play("scream", 12, true);
    }, 1000);
  }

  setTimeout(function()
  {
    countdownTimer = setInterval(function()
    {
      descText.destroy();

      blipSound.play();

      if(countdown == 0)
      {
        for(var i = 0; i < characters.length; i++)
        {
          if(characters[i] != null)
            characters[i].destroy();
        }

        generateNewLevel();
        document.body.style.backgroundColor = "#222";
        return;
      }

      descText = game.add.text(cx, cy - 16, "NEW LEVEL IN " + countdown-- + " SECONDS",
      {
        font: "10pt Press Start 2P",
        fill: "#fff"
      });
      descText.anchor.setTo(0.5, 0.5);
    }, 1000);
  }, 3000);

  if(characters[0] != null)
    game.world.bringToTop(characters[0]);

  descText.anchor.setTo(0.5, 0.5);
  pauseLabel.anchor.setTo(0.5, 0.5);
}

function endGame(enemy)
{
  gameoverSound.play();

  lastKeyPress = +new Date();

  menuIndex = 0;
  menuItems = ["RETRY", "EXIT"];

  for(var i = 0; i < menuItemSprites.length; i++)
  {
      if(menuItemSprites[i] != null && typeof(menuItemSprites) != "undefined")
        menuItemSprites[i].destroy();
  }

  menuItemSprites = [];

  if(typeof(game.ended) == "undefined" || game.ended == false)
    game.ended = true;

  clearTimeout(switchSpriteTimer);
  switchSpriteTimer = null;

  for(var i = 0; i < numberOfPlayers; i++)
  {
    if(characters[i] == null)
      continue;

    characters[i].destroy();
  }

  var cx = game.world.centerX;
  var cy = game.world.centerY;

  bg = game.add.sprite(0, 0, "black");

  bg.width = GameSettings.width;
  bg.height = GameSettings.height;
  bg.alpha = 0.8;

  cursor = game.add.text(0, 0, "<",
  {
    font: "12pt Press Start 2P",
    fill: "#fff"
  });

  cursor.anchor.setTo(0.5, 0.5);

  pauseLabel = game.add.text(cx, cy - 96, "GAME OVER",
  {
    font: "20pt Press Start 2P",
    fill: "#ff0000"
  });

  descText = game.add.text(cx, cy - 32 - 8, "YOU WERE CAUGHT BY " + enemy.name,
  {
    font: "10pt Press Start 2P",
    fill: "#fff"
  });

  var loggerData = [];

  //Log the death
  for(var i = 0; i < logger.length; i++)
  {
    logger[i].onDeath(enemy, true);

    var data = logger[i].getData();

    if(Object.keys(data).length > 0)
      loggerData.push(data);
  }

  Logger.pushData(loggerData);

  for(var i = 0; i < enemies.length; i++)
    enemies[i].sprite.destroy();

  clearTimeout(switchSpriteTimer);
  switchSpriteTimer = null;
  menuIndex = 0;

  enemySprite = game.add.sprite(cx, cy, "enemy" + (enemy.aiType + 1));
  enemySprite.scale.setTo(2, 2);
  enemySprite.animations.add("walk");
  enemySprite.play("walk", 12, true);
  enemySprite.anchor.setTo(0.5, 0.5);

  descText.anchor.setTo(0.5, 0.5);

  for(var i = 0; i < menuItems.length; i++)
  {
    var calcX = cx;
    var calcY = (cy + 48) + (i * 32);

    var sprite = game.add.text(calcX, calcY, menuItems[i],
    {
      font: "12pt Press Start 2P",
      fill: "#fff"
    });

    sprite.anchor.setTo(0.5, 0.5);

    menuItemSprites.push(sprite);
  }

  pauseLabel.anchor.setTo(0.5, 0.5);
}
