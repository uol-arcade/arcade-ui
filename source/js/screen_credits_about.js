
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
    arcade.vue_about   = new Vue(arcade.buildMenuOnlyExitable(".about.screen"));
    arcade.vue_credits = new Vue(arcade.buildMenuOnlyExitable(".credits.screen"));
});


