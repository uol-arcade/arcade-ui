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
                <li>Get Involved</li>
            </ul>
        </article>

        <article class="games screen">
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