

var AudioManager = function() {};

AudioManager.moveSound   = new Audio("assets/audio/blip-high.wav");
AudioManager.backSound   = new Audio("assets/audio/blip-low.wav");
AudioManager.selectSound = new Audio("assets/audio/powerup.wav");

AudioManager.playMove = function()
{
    AudioManager.moveSound.pause();
    AudioManager.moveSound.currentTime = 0;
    AudioManager.moveSound.play();
}

AudioManager.playBack = function () 
{
    AudioManager.backSound.pause();
    AudioManager.backSound.currentTime = 0;
    AudioManager.backSound.play();
}

AudioManager.playSelect = function () 
{
    AudioManager.selectSound.pause();
    AudioManager.selectSound.currentTime = 0;
    AudioManager.selectSound.play();
}