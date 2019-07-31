class PressEffect
{
    constructor(elem)
    {
        this.elem = elem;

        this.spawn(elem);
    }

    spawn(elem)
    {
        let effect = document.createElement("section");
        effect.classList.add("pressed");

        elem.style.position = "relative";
        this.childElem = elem.appendChild(effect);

        let m = 10;

        effect.style.marginTop = (Math.randomRange(-m, m)) + "px";
        effect.style.marginLeft = (Math.randomRange(-m, m)) + "px";

        setTimeout(function()
        {
            this.childElem.remove();
        }.bind(this), 1000);
    }
}

PressEffect.spawn = function(elem)
{
    return new PressEffect(elem);
}