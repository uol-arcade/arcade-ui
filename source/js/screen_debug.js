
window.addEventListener("load", x => 
{
    arcade.vue_debug = new Vue
    ({
        el: ".debug.screen",

        data:
        {
            timeStr: "",
            heapStr: "",
            index: 0,
            items:
            {
                "Hard refresh page": this.refreshPage,
                "Show cheat bindings": this.showCheatBindings
            }
        },

        mounted: function () 
        {
            let screen = document.querySelector(".debug.screen");
            arcade.keys.on("keyStart", screen, this.startPressed);

            window.setInterval(this.clock, 100);
        },

        methods:
        {
            clock()
            {
                this.timeStr = new Date().toLocaleTimeString();
                this.heapStr = (window.performance.memory.usedJSHeapSize / window.performance.memory.jsHeapSizeLimit * 100).toFixed(3) + "% js heap";
            },

            refreshPage()
            {
                window.location.reload(true);
            },

            showCheatBindings()
            {
                console.log("CHEATS (on p2 pad)");
                console.log("======================");
                console.log("deadbeef - Console");
                console.log("cafe     - Debug strip");
                console.log("======================");
            },

            startPressed() 
            {
                console.log("hi");
            }
        }
    });
});