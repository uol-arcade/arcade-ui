
window.addEventListener("load", x => 
{
    arcade.vue_menu = new Vue
    ({
        el: ".menu.screen",

        data: 
        {
            currentIndex: 0,
            items: [
                {
                    title: "Games",
                    target: "games"
                },

                {
                    title: "Credits",
                    target: "credits",
                },

                {
                    title: "About",
                    target: "about"
                }
            ]
        },

        mounted: function () 
        {
            let screen = document.querySelector(".menu.screen");

            arcade.keys.on("keyA",     screen, this.selectItem);
            arcade.keys.on("keyStart", screen, this.selectItem);
            arcade.keys.on("keyUp",    screen, this.moveUp);
            arcade.keys.on("keyDown",  screen, this.moveDown);
            arcade.keys.on("keyExit",  screen, this.back);
            arcade.keys.on("keyB",  screen, this.back);
        },

        methods:
        {
            back()
            {
                ScreenSelector.setScreen("start");
            },

            moveDown() {
                this.currentIndex = (this.currentIndex + 1) % this.items.length;
            },

            moveUp() 
            {
                if(this.currentIndex - 1 < 0)
                    this.currentIndex = this.items.length - 1;
                else
                    this.currentIndex = (this.currentIndex - 1);

                let elem = document.querySelector(".menu.screen li.active");
            },

            selectItem(event) 
            {
                let target = this.items[this.currentIndex].target;

                let elem = document.querySelector(".menu.screen li.active");
                PressEffect.spawn(elem);

                ScreenSelector.setScreen(target);
            }
        }
    });
});