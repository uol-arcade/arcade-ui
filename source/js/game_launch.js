arcade.launchGame = function(path, delay = 0)
{
    setTimeout(function()
    {
        window.location.href = "games/" + path;
    }, delay);
}