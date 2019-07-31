arcade.keys =  {};

arcade.keys.currentListener = null;

arcade.keys.keyLeftEvent = new Event("keyLeft");
arcade.keys.keyRightEvent = new Event("keyRight");
arcade.keys.keyAEvent = new Event("keyA");
arcade.keys.keyBEvent = new Event("keyB");

arcade.keys.dispatchEvents = (event) =>
{
    if(arcade.keys.currentListener == null)
        return;
        
    if (event.code == "ArrowLeft")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyLeftEvent);
    
    else if (event.code == "ArrowRight")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyRightEvent);

    else if (event.code == "KeyZ")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyAEvent);

    else if (event.code == "KeyX")
        arcade.keys.currentListener.dispatchEvent(arcade.keys.keyBEvent);
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