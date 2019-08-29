<?php

# Load connection string and connect
$connectStr = file_get_contents("api/config/mongo_connect_file");
$client = new MongoDB\Client($connectStr);

# Find all documents, filter _id out
$cursor = $client->arcade->games->find([], [ "projection" => [ '_id' => 0] ]);

# Format them into JSON
$json = json_encode(iterator_to_array($cursor));

# Print json data
print($json);

?>