var gamepad;

//pad.id.match(/(0079)/) != null

function initGamepad()
{
  game.input.gamepad.start();
  gamepad = game.input.gamepad.pad1;
}

function horizontalJustPressed(sign)
{
  return false;
}

function verticalJustPressed(sign)
{
  return false;
}

function gamepadStartPressed()
{
  return gamepad.justPressed(Phaser.Gamepad.XBOX360_START);
}

function gamepadRightPressed()
{
  return gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || horizontalJustPressed(1);
}

function gamepadLeftPressed()
{
  return gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_LEFT) || horizontalJustPressed(-1);
}

function gamepadUpPressed()
{
  return gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_UP) || verticalJustPressed(1);
}

function gamepadDownPressed()
{
  return gamepad.justPressed(Phaser.Gamepad.XBOX360_DPAD_DOWN) || verticalJustPressed(-1);
}


function handleGamepad()
{
  if(gamepadUpPressed())
    changeDirection(0, -1);

  else if(gamepadDownPressed())
    changeDirection(0, 1);

  else if(gamepadLeftPressed())
    changeDirection(-1, 0);

  else if(gamepadRightPressed())
    changeDirection(1, 0);
}
