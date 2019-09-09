<?php namespace Arcade;

    # Exceptions
    class MongoConnectException extends \Exception { }
    class MongoJSONException extends \Exception { }

    /**
     * The main class for accessing MongoDB data for
     * the arcade machines.
     */
    class MongoClient
    {
        # The mongo db client
        private $client = null;

        # The connection string
        private $connection_string = null;

        /**
         * Called when we want to make a new connection to the mongodb service
         *
         * @param [string] $mongo_connect_file The path to the file to read the connection string from.
         */
        function __construct($mongo_connect_file)
        {
            # Does this file exist? If not then stop asap.
            if(!file_exists($mongo_connect_file))
                throw new MongoConnectException("Could not find connection file located at '$mongo_connect_file'.");

            # Get the connection string from the file path that has been passed
            # to this function
            $this->connection_string = file_get_contents($mongo_connect_file);

            # Is the connection string empty?
            if(empty($this->connection_string))
                throw new MongoConnectException("MongoDB connection string was empty in '$mongo_connect_file'.");

            # Make the mongo client
            $this->client = new \MongoDB\Client($this->connection_string);
        }

        public function getJSON()
        {
            # Make the arcade variable
            $data = "var arcade = {};";
  
            # Funcs
            $funcs = 
            [
                "about"   => "getAboutJSON",
                "credits" => "getCreditsJSON",
                "games"   => "getGamesJSON",
                "videos"  => "getVideosJSON"
            ];

            # Append js for each entry
            foreach($funcs as $k => $v)
                $data .= "arcade." . $k . " = " . $this->$v() . ';';

            # And return data
            return $data;
        }

        public function getAboutJSON()
        {
            # Find all documents, filter _id out
            $cursor = $this->client->arcade->text->findOne(["section" => "about"], [ "projection" => [ '_id' => 0] ]);

            # Format them into JSON
            return $this->jsonify($cursor);
        }

        public function printVideoPreloadHTML()
        {
            # Get all the videos
            $cursor = $this->client->arcade->videos->find([], [ "projection" => [ '_id' => 0] ]);

            # Run through each, print out preload url
            foreach($cursor as $video)
                print("<link rel=\"preload\" as=\"video\" crossorigin=\"anonymous\" type=\"video/mp4\" href=\"" . $video["path"] . "\"/>\n");
        }

        public function getVideosJSON()
        {
            # Get all the games 
            $cursor = $this->client->arcade->videos->find([], [ "projection" => [ '_id' => 0] ]);

            # Format them into JSON
            return $this->jsonify($cursor);
        }


        public function getCreditsJSON()
        {
            # Find all documents, filter _id out
            $cursor = $this->client->arcade->text->findOne(["section" => "credits"], [ "projection" => [ '_id' => 0] ]);

            # Format them into JSON
            return $this->jsonify($cursor);
        }

        public function getGamesJSON()
        {
            # Get all the games 
            $cursor = $this->client->arcade->games->find([], [ "projection" => [ '_id' => 0] ]);

            # Format them into JSON
            return $this->jsonify($cursor);
        }

        private function jsonify($cursor)
        {
            return json_encode(iterator_to_array($cursor));
        }
    }

?>