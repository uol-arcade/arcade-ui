
window.addEventListener("load", x =>
{
    arcade.vue_games = new Vue
    ({
        el: ".games.screen",
        data:
        {
            currentIndex: 0,
            games:
            [
                {
                    title: "Adi's Maze Unlimited",
                    genre: "Platformer",
                    players: 2,
                    imagePath: "assets/images/adis-maze.png",
                    author: "Benjamin Williams",
                    description: "Lorem ipsum dolor, sit amet consectetur elit. Sunt a mazime iste.",
                    path: "pacman-unlimited"
                }

                // {
                //     title: "Qong",
                //     genre: "Sports",
                //     players: 1,
                //     imagePath: "assets/images/qong.png",
                //     author: "Benjamin Williams",
                //     description: "Lorem ipsum dolor, sit amet consectetur elit. Sunt a mazime iste. Lorem. Ipsum.",
                //     path: "qong"
                // },
            ]
        },

        mounted: function()
        {
            this.games = arcade.games;

            arcade.keys.on("keyLeft",  this.$el, this.left);
            arcade.keys.on("keyRight", this.$el, this.right);
            arcade.keys.on("keyA",     this.$el, this.A);
            arcade.keys.on("keyB",     this.$el, this.B);
        },

        methods:
        {
            transitionOut(func) 
            {
                let game = document.querySelector(".game");
                
                if(game.classList.contains("transitionIn") || game.classList.contains("transitionOut"))
                    return;
                
                game.classList.toggle("transitionOut");

                window.setTimeout(func.bind(this), 600);
            },

            transitionIn(func) 
            {
                let game = document.querySelector(".game");
                game.classList.toggle("transitionOut");
                game.classList.toggle("transitionIn");

                window.setTimeout(() => { game.classList.toggle("transitionIn"); }, 1000);
            },

            A()
            {
                let button = this.$el.querySelector(".key.info.primary kbd");

                PressEffect.spawn(button);
                
                arcade.launchGame(this.currentGame.path, 500);

                AudioManager.playSelect();
            },

            B()
            {
                let button = this.$el.querySelector(".key.info.secondary kbd");

                // PressEffect.spawn(button);
                ScreenSelector.setScreen("menu");

                AudioManager.playBack();
            },

            left()
            {
                if(this.currentIndex == 0)
                {
                    AudioManager.playBack();
                    return;
                }

                PressEffect.spawn(document.querySelector(".chevron.left span"));

                this.transitionOut(function()
                {
                    this.currentIndex--;
                    this.transitionIn();
                });

                AudioManager.playMove();
            },

            right()
            {
                if (this.currentIndex == this.games.length - 1)
                {
                    AudioManager.playBack();
                    return;
                }

                PressEffect.spawn(document.querySelector(".chevron.right span"));

                this.transitionOut(function () 
                {
                    this.currentIndex++;
                    this.transitionIn();
                });

                AudioManager.playMove();
            }
        },

        computed:
        {   
            currentGame()
            {
                return this.games[this.currentIndex];
            }
        },

        filters:
        {
            formatPlayers(input)
            {
                if(input == 1)
                    return input + " player";

                else if(input > 1)
                    return "1-" + input + " players";
            }
        }
    });
});