<?php
    
require_once 'vendor/autoload.php';
require_once 'api/ArcadeFileLister.php';
require_once 'api/mongo/MongoArcadeClient.php';

?>

<!DOCTYPE html>
<html>
    <head>
        
        <link href="assets/fonts/pocket/pocket.css" rel="stylesheet" type="text/css"/>
        <link href="assets/fonts/upheaval/upheaval.css" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css" integrity="sha256-PHcOkPmOshsMBC+vtJdVr5Mwb7r0LkSVJPlPrp/IMpU=" crossorigin="anonymous" />
        <link href="dist/css/arcade-ui.min.css" rel="stylesheet" type="text/css"/>

        <script type="text/javascript">
        <?php
            # Make a new client
            $client = new Arcade\MongoClient("api/config/mongo_connect_file");

            # Print out the connection string
            print($client->getJSON());
        ?>
        </script>

        <?php $client->printVideoPreloadHTML(); ?>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js"></script>
        <script src="source/js.min.js"></script>

    </head>
    <body>

        <video id="background-video" autoplay muted>
            <source id="background-source" src="assets/video/games-showreel.mp4" type="video/mp4">
        </video>

        <article class="start screen">
            <img class="splash" src="assets/images/press-start.png"/>
            <h3>Use the joystick to navigate</h3>
        </article>

        <article class="menu screen hidden">
            <img class="header" src="assets/images/research-arcade-header.png"/>
            <ul class="centered">
                <li :class="{ 'active': index == currentIndex }" v-for="(item, index) in items">{{ item.title }}</li>
            </ul>
        </article>

        <article class="credits screen hidden">
            <section class="credits">
                <article>
                    <header>
                        <img class="credits-header" src="assets/images/research-arcade-header.png"/>
                        <p v-html="credits_header">
                            
                        </p>
                    </header>
                    <ul v-for="(value, key) in credits">
                        <li class="title">{{ key }}</li>
                        <li v-for="entry in value">{{ entry }}</li>
                    </ul>
                </article>
            </section>
            <button class="key info primary">
                <kbd>B</kbd> Go back
            </button>
        </article>

        <article class="games screen hidden" @keyup.right="right">
            <button class="chevron left">
                <span v-show="currentIndex > 0">&lt;</span>
            </button>
            <section :data-target-path="currentGame.path" class="game">
                <figure>
                    <img :src="currentGame.imagePath"/>
                </figure>
                <aside>
                    <span class="wrapper">
                        <h1>{{ currentGame.title }}</h1>
                        <h2>
                            {{ currentGame.genre }} <span>|</span>
                            {{ currentGame.players | formatPlayers }} <span>|</span>
                            {{ currentGame.author }}
                        </h2>
                        <p>
                            {{ currentGame.description }}
                        </p>
                        <section class="buttons">

                            <button class="key info secondary">
                                <kbd><span>B</span></kbd> Back
                            </button>

                            <button class="key info primary">
                                <kbd><span>A</span></kbd> Play
                            </button>

                        </section>
                    </span>
                </aside>
            </section>
            <button class="chevron right">
                <span v-show="currentIndex < (games.length - 1)">&gt;</span>
            </button>
        </article>

        <article class="about screen hidden">
            <article>
                <h1>About</h1>
                <span v-html="html">
                </span>
            </article>
            <figure>
                <img :src="qr_path"/>
            </figure>
            <section class="buttons">
                <button class="key info primary">
                    <kbd><span>B</span></kbd> Back
                </button>
            </buttons>
        </article>

        <article class="debug screen">
            <aside class="info">
                <nav>
                    <?php echo date("h:i:s"); ?>
                    Fingerprint (...)
                </nav>
                <ul>
                    <li class="active">Restart machine</li>
                    <li>Hard refresh page</li>
                    <li>Shutdown</li>
                    <li>Reboot Chrome</li>
                    <li>Rerun startup batch file</li>
                    <li>Reboot mapper</li>
                    <li>Diagnose joy inputs</li>    
                    <li>Show cheat bindings</li>
                </ul>
            </aside>
            <pre class="console">
Here is some
random text
            </pre>
        </article>

        <kbd class="version-info hidden">
            version <span>5.23</span> |
            last updated 
            <span>
                <?php 
                    $timestamp = filemtime(__FILE__);
                    $date = date('d-m-Y H:i:s', $timestamp);
                    print($date);
                ?>
            </span> |
            last refreshed
            <span>
                <?php 
                    $date = date('d-m-Y H:i:s', time());
                    print($date);
                ?>
            </span> 
        </kbd>
    </body>
</html>