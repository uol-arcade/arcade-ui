<?php

    # Include the mongo arcade client and mongo db
    require_once '../vendor/autoload.php';
    require_once 'mongo/MongoArcadeClient.php';

    # Make a new client
    $client = new Arcade\MongoClient("config/mongo_connect_file");

    # Print out the connection string
    print($client->getJSON());

?>