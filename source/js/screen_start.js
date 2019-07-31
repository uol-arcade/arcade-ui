
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
            arcade.keys.on("keyA", screen, this.A);
        },

        methods:
        {
            A()
            {
                console.log("Hi");
            }
        }
    });
});