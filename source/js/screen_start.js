
window.addEventListener("load", x => 
{
    arcade.vue_start = new Vue
    ({
        el: ".start.screen",

        data: 
        {

        },

        mounted: function () 
        {
            let screen = document.querySelector(".start.screen");
            arcade.keys.on("keyStart", screen, this.startPressed);
        },

        methods:
        {
            startPressed()
            {
                AudioManager.playSelect();
                ScreenSelector.setScreen("menu");
            }
        }
    });
});