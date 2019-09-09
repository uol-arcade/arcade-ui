

var seed = -1;



window.addEventListener("load", function()

{

  //Reset logger

  seed = Math.floor(Math.random() * 0xffffff);

}.bind(this));



var Logger = function (id)

{

  this.id = id;



  //Get finger print

  this.fingerprint = this.getFingerPrint();



  //Set up firebase ref

  this.firebase = firebase.database().ref("adis-maze-unlimited/" + this.fingerprint);

};



Logger.pushData = function(data)

{

  //Make a new client

  //var client = new ClientJS();



  //Return the finger print

  //var fingerprint = client.getFingerprint();



  //var ref = firebase.database().ref("adis-maze-unlimited/" + fingerprint);

  //ref.push(data);

}



Logger.prototype.reset = function()

{



  //All possible seeds

  var seeds =

  [

    10239024,

    2595169,

    5656916,

    936102,

    15227496,

    16030318

  ];



  //console.log(seed);



  Math.seedrandom(seed);

  console.log("%cmaze seed: " + seed, "background-color:#333;padding:2px;color:#bada55");



  //Timer

  //clearInterval(this.updateTimer);

  //this.updateTimer = null;



  //Call update every second

  //this.updateTimer = setInterval(this.update.bind(this), 500);



  //Setup object initially

  this.data = {};



  //Find start data

  this.startData = this.getStartData(seed);



  //Plays

  this.plays = [];



  //Player steps

  this.playerSteps = [];



  //Enemy distances

  this.enemyDistances = [];



  //Waypoint string

  this.waypoint = "";

}



Logger.prototype.update = function()

{

  if(game.ended || game.won)

    return;



  var distances = {};



  for(var i = 0; i < enemies.length; i++)

  {

    var distX = Math.abs(enemies[i].x - playerPos[this.id].x);

    var distY = Math.abs(enemies[i].y - playerPos[this.id].y);



    distances[enemies[i].name] = distX + distY;

  }



  if(typeof(this.enemyDistances) == "undefined")

    this.enemyDistances = [];



  this.enemyDistances.push(distances);

}



Logger.prototype.addPlayerStep = function(x, y)

{

  //Object

  var obj = {

    x: x,

    y: y,

    time: (+new Date() - this.startData.time)

  };



  this.update();



  //Push the object

  this.playerSteps.push(obj);

}



Logger.prototype.getData = function()

{

  if(this.id == 0)

    this.startData.graph = graph;



  if(this.plays.length == 0)

    return {};



  this.startData.chosenCharacter = chosenCharacters[this.id];



  var data = {

    info: this.startData,

    levels: this.plays

  };



  return data;

}



Logger.prototype.onWin = function()

{

  if(this.playerSteps.length == 0)

    return;



  //Push play

  this.plays.push({

    win: {

      score: score

    },

    playerSteps: this.playerSteps,

    waypoints: this.waypoint,

    enemyDistances: this.enemyDistances

  });



  //this.();



  this.playerSteps = [];

  this.waypoint = "";

  this.enemyDistances = [];



}



Logger.prototype.onDeath = function(enemy, gameOver)

{

  if(this.playerSteps.length == 0)

    return;



  var deathObj = {

    aiType: enemy.aiType,

    name: enemy.name,

    score: score

  };



  //Push play

  this.plays.push({

    death: deathObj,

    playerSteps: this.playerSteps,

    waypoints: this.waypoint,

    enemyDistances: this.enemyDistances

  });



  this.playerSteps = [];

  this.waypoint = "";

  this.enemyDistances = [];

}



Logger.prototype.addJunction = function(id)

{

  this.waypoint += "" + id + ";";

}



Logger.prototype.getStartData = function(seed)

{

  //Build obj

  var obj = {};



  //Set seed

  obj.seed = seed;



  //Time

  obj.time = +new Date();



  return obj;

}



Logger.prototype.getFingerPrint = function()

{

  //Make a new client

  var client = new ClientJS();



  //Return the finger print

  return client.getFingerprint();

}

