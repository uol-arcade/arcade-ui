<?php
    
require 'vendor/autoload.php';

?>

<!DOCTYPE html>
<html>
    <head>
        
        <link href="assets/fonts/pocket/pocket.css" rel="stylesheet" type="text/css"/>
        <link href="assets/fonts/upheaval/upheaval.css" rel="stylesheet" type="text/css"/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css" integrity="sha256-PHcOkPmOshsMBC+vtJdVr5Mwb7r0LkSVJPlPrp/IMpU=" crossorigin="anonymous" />
        <link href="dist/css/arcade-ui.min.css" rel="stylesheet" type="text/css"/>

        <script type="text/javascript">
        var arcade = {};

        arcade.games = <?php require("api/games.php"); ?>;
        </script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js"></script>
        <script src="source/js.min.js"></script>

    </head>
    <body>

        <video id="background-video" autoplay loop muted>
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
                        <p>
                            A project hosted and developed within the University of Lincoln School of Computer Science.
                            Copyright &copy; University of Lincoln 2017-<?php echo date("Y"); ?>. All rights reserved.
                            Design, development and maintenance by Benjamin Williams &lt;bwilliams@lincoln.ac.uk&gt;.
                            More information can be found at &lt;http://researcharcade.com/&gt;.
                        </p>
                    </header>
                    <ul>
                        <li class="title">Project Lead</li>
                        <li>Chris Headleand</li>
                    </ul>
                    <ul>
                        <li class="title">Architecture Lead</li>
                        <li>Benjamin Williams</li>
                    </ul>
                    <ul>
                        <li class="title">Cabinet Design / Build</li>
                        <li>Alex Chapman</li>
                        <li>Charlie Volland-Butler</li>
                        <li>Chris Headleand</li>
                    </ul>
                    <!-- <ul>
                        <li class="title">Hosted Games Developers</li>
                        <li>Chris Ross</li>
                    </ul> -->
                    <ul>
                        <li class="title">Previous Developers</li>
                        <li>Ben Hide</li>
                        <li>Jake Harrington</li>
                        <li>Marlon Gilliam</li>
                        <li>Tom Smith</li>
                    </ul>
                    <ul>
                        <li class="title">Technical Support</li>
                        <li>Matt Ashton</li>
                        <li>Jason Hall</li>
                        <li>Jeff Pashley</li>
                        <li>Tom Reed</li>
                    </ul>
                    <ul>
                        <li class="title">Thanks</li>
                        <li>Kieran Hicks</li>
                        <li>The intLab research group</li>
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
                <p>
                    This project was developed within intLab, a research group at the University of Lincoln focusing
                    on human-computer interaction and video games.
                </p>
                <p>
                    All of the games featured on this machine are free to play, and are independently created by our
                    students. By playing these games, you are contributing to our research! For more information, scan the QR
                    code to the right, or head on over to <span>&lt;http://researcharcade.com/&gt;</span>.
                </p><p>
                    If you wish to create a game to be hosted here, please get in touch with Benjamin Williams
                    at <span>&lt;bwilliams@lincoln.ac.uk&gt;</span> for further details!
                </p>
            </article>
            <figure>
                <img src="assets/images/qr.png"/>
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