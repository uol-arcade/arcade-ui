/**
 * Class for detecting cheats from keyboard input
 */
var CheatDetector = function ()
{
    window.addEventListener("keydown", this.onKeyDown.bind(this));
    this.cheats = [];
    this.map = [];
};


/**
 * Maps characters to key codes for non-alphanumeric keystrokes (e.g. arrow keys)
 * @param {string or array} char The character to map.
 * @param {string or array} key  The key to map the character to.
*/
CheatDetector.prototype.mapKey = function (char, key) 
{
    if (typeof (char) == "string") 
    {
        //If a single character is passed.. push it
        this.map.push
            ({
                char: char,
                key: key
            });
    }
    else if (typeof (char.length) != "undefined" && typeof (key.length) != "undefined")
    {
        //Otherwise we have two arrays -- map by index
        for (var i = 0; i < char.length; i++)
            this.map.push
                ({
                    char: char[i],
                    key: key[i]
                });
    }

    //And return this instance (for chaining)
    return this;
}


/**
 * Called when a key is pressed down anywhere on the page.
 * @param  {obj} e The passed event data
 */
CheatDetector.prototype.onKeyDown = function (e) 
{
    //Get the character pressed, convert to lower case
    var char = String.fromCharCode(e.keyCode).toLowerCase();

    for (var i = 0; i < this.map.length; i++)
    {
        if (this.map[i].key == e.keyCode)
            char = this.map[i].char;
    }

    //Now run through each cheat and process it
    for (var i = 0; i < this.cheats.length; i++)
        this.processCheat(char, this.cheats[i]);
}

/**
 * Main function for this class -- adds a cheat and sets up a callback for
 * when it is entered. (But without readable cheat name)
 *
 * @param  {string}   code     The string of keys to be detected.
 * @param  {Function} callback The function to call if it has been detected.
 */
CheatDetector.prototype.onCheat = function (code, callback) 
{
    //Push into the list of cheats
    this.cheats.push
        ({
            code: code.toLowerCase(),
            counter: 0,
            name: "n/a",
            callback: callback
        });
}

/**
 * Main function for this class -- adds a cheat and sets up a callback for
 * when it is entered.
 *
 * @param  {string}   code     The string of keys to be detected.
 * @param  {string}   name     The readable "name" of the cheat to differentiate it.
 * @param  {Function} callback The function to call if it has been detected.
 */
CheatDetector.prototype.onCheatEx = function (code, name, callback) 
{
    //Push into the list of cheats
    this.cheats.push
        ({
            code: code.toLowerCase(),
            name: name,
            counter: 0,
            callback: callback
        });
}

/**
 * Processes a single cheat -- adds to counter if character has matched.
 *
 * @param  {string} char  The character that was pressed.
 * @param  {obj}    cheat The cheat to be processed.
 */
CheatDetector.prototype.processCheat = function (char, cheat) 
{
    if (char == cheat.code[cheat.counter]) {
        //If the key pressed matches the current token, then look at the next
        //one next time
        cheat.counter++;

        if (cheat.counter >= cheat.code.length) {
            //If this counter is over the cheat length.. then we've entered a cheat!
            //Reset the counter back to 0.
            cheat.counter = 0;

            //And call the callback for this cheat
            cheat.callback
                ({
                    code: cheat.code,
                    name: cheat.name
                });
        }
    }
    else {
        //Otherwise the character didn't match.. reset back to 0.
        cheat.counter = 0;
    }
}

/**
 * Shows a notification with a title and some text
 * @param  {string} title The title of the notification.
 * @param  {string} text  The text of the notification.
 */
function showNotification(title, text) {
    //Set the title and body text
    $(".notification h1").html(title);
    $(".notification p").html(text);

    //Show the notification
    $(".notification").show();

    //And hide it after 5 seconds
    setTimeout(function () {
        $(".notification").hide();
    }, 5000);
}

//Create a new cheat detector
var cheatDetector = new CheatDetector();

//Map arrow keys to inputs
cheatDetector.mapKey(["a","b","c","d","e","f"], [70, 71, 72, 74, 75, 76]);

//deadbeef on p2
cheatDetector.onCheat("deadbeef", function (data) 
{
    console.log("deadbeef");
    document.querySelector(".debug.screen").classList.toggle("hidden");
});


cheatDetector.onCheat("cafe", function (data) 
{
    console.log("cafe");
    document.querySelector(".version-info").classList.toggle("hidden");
});



//abcdef
//fghjkl
//deadbeef = jkfjgkkl
//cafe     = halk