<?php

# Load connection string and connect
$connectStr = file_get_contents("api/config/mongo_connect_file");
$client = new MongoDB\Client($connectStr);

# Find all documents, filter _id out
$cursor = $client->arcade->text->findOne(["section" => "about"], [ "projection" => [ '_id' => 0] ]);

# Format them into JSON
$json = json_encode($cursor);

# Print json data
print($json);

?>