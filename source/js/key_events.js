arcade.keys =  {};

arcade.keys.currentListener = null;

arcade.keys.keyLeftEvent = new Event("keyLeft");
arcade.keys.keyRightEvent = new Event("keyRight");
arcade.keys.keyUpEvent = new Event("keyUp");
arcade.keys.keyDownEvent = new Event("keyDown");
arcade.keys.keyAEvent = new Event("keyA");
arcade.keys.keyBEvent = new Event("keyB");
arcade.keys.keyStartEvent = new Event("keyStart");
arcade.keys.keyExitEvent = new Event("keyExit");

arcade.keys.dispatchEvents = (event) =>
{
    if(arcade.keys.currentListener == null)
        return;

    arcade.keys.currentListener = document.querySelector("." + ScreenSelector.currentScreen + ".screen");

    if (event.code == "ArrowLeft")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyLeftEvent);
    
    else if (event.code == "ArrowRight")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyRightEvent);

    else if (event.code == "ArrowUp")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyUpEvent);
        
    else if (event.code == "ArrowDown")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyDownEvent);

    else if (event.code == "KeyZ")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyAEvent);

    else if (event.code == "KeyX")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyBEvent);
        
    else if (event.code == "KeyQ")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyExitEvent);

    else if (event.code == "Enter")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyStartEvent);
};

arcade.keys.on = (event, elem, func) =>
{
    elem.addEventListener(event, func);
};

window.addEventListener("keydown", arcade.keys.dispatchEvents.bind(this));

window.addEventListener("load", () =>
{
    ScreenSelector.setScreen("start");
});