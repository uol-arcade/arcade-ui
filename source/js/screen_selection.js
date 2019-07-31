
var ScreenSelector = {};

ScreenSelector.currentScreen = "start"

ScreenSelector.setScreen = function(name)
{
    ScreenSelector.currentScreen = name;
    var currentElement = document.querySelector("." + name + ".screen");

    var elems = document.querySelectorAll(".screen");

    for(var elem of elems)
        elem.classList.add("hidden");

    currentElement.classList.remove("hidden");

    arcade.keys.currentListener = ScreenSelector.currentScreen;
}