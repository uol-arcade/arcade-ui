
var ScreenSelector = {};

ScreenSelector.currentScreen = "start"
ScreenSelector.currentElement = null;

ScreenSelector.setScreen = function(name)
{
    ScreenSelector.currentElement = document.querySelector("." + name + ".screen");

    var elems = document.querySelectorAll(".screen");

    for(var elem of elems)
        elem.classList.add("hidden");

    ScreenSelector.currentElement.classList.remove("hidden");

    arcade.keys.currentListener = ScreenSelector.currentElement;
}