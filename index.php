<!DOCTYPE html>
<html>
    <head>
        
        <link href="assets/fonts/pocket/pocket.css" rel="stylesheet" type="text/css"/>
        <link href="assets/fonts/upheaval/upheaval.css" rel="stylesheet" type="text/css"/>

        <link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">

        <link href="dist/css/arcade-ui.min.css" rel="stylesheet" type="text/css"/>
    </head>
    <body>

        <article class="start screen hidden">
            <img class="splash" src="assets/images/press-start.png"/>
            <h3>Use the joystick to navigate</h3>
        </article>

        <article class="menu screen hidden">
            <img class="header" src="assets/images/research-arcade-header.png"/>
            <ul class="centered">
                <li class="active">Games</li>
                <li>Credits</li>
                <li>About</li>
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
                    <ul>
                        <li class="title">Hosted Games Developers</li>
                        <li>Chris Ross</li>
                    </ul>
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

        <article class="games screen hidden">
            <button class="chevron left">
                &lt;
            </button>
            <section class="game">
                <figure>
                    <img src="assets/images/adis-maze.png"/>
                </figure>
                <aside>
                    <span class="wrapper">
                        <h1>Adi's Maze Unlimited</h1>
                        <h2>Platformer <span>|</span> 1-2 players <span>|</span> Benjamin Williams</h2>
                        <p>
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt a maxime iste obcaecati necessitatibus quaerat qui.
                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt fuga cum, voluptas perferendis iusto iste? Explicabo provident error quo, eaque, eius doloremque sed obcaecati perspiciatis, nesciunt sunt aliquid voluptate unde.
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
                &gt;
            </button>
        </article>

        <article class="about screen">
            <article>
                <h1>About</h1>
                <p>
                    This project was developed within intLab, a research group at the University of Lincoln focusing
                    on human-computer interaction and video games.
                </p>
                <p>
                    All of the games featured on this machine are free to play, and are independently created by our
                    staff and students. By playing our games, you are contributing to our research! For more information, scan the QR
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

        <kbd class="version-info">
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