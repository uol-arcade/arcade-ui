
arcade.buildMenuOnlyExitable = (elem) =>
{
    return {
        el: elem,

        mounted: function()
        {
            arcade.keys.on("keyB", this.$el, this.back);
        },

        methods:
        {
            back: () => ScreenSelector.setScreen("menu")
        }
    };
}

window.addEventListener("load", x => 
{
    arcade.vue_about = new Vue
    ({
        el: ".about.screen",

        data: 
        {
            qr_path: "assets/images/qr.png",
            html: "Loading..."
        },

        mounted: function () 
        {
            this.qr_path = arcade.about.qr_path;
            this.html    = arcade.about.html;
            
            arcade.keys.on("keyB", this.$el, this.back);
        },

        methods:
        {
            back: () => 
            {
                ScreenSelector.setScreen("menu");
                AudioManager.playBack();
            }
        }
    });

    arcade.vue_credits = new Vue
    ({
        el: ".credits.screen",

        data:
        {
            credits: {},
            credits_header: "Loading..."
        },

        mounted: function () {

            this.credits = arcade.credits.credits;
            this.credits_header = arcade.credits.credits_header;

            arcade.keys.on("keyB", this.$el, this.back);
        },

        methods:
        {
            back: () => 
            {
                ScreenSelector.setScreen("menu");
                AudioManager.playBack();
            }
        }
    });
});


