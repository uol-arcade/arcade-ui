
class VideoCarousel
{
    constructor()
    {
        //Timer update count
        this.timerUpdateDelay = 0.5;

        //Set up timer
        this.timerID = -1;
        this.videoIndex = 0;
        this.pauseIndex = 0;

        //Set up timer
        this.videoSeconds = 0;
        this.setupTimer();

        //Are we in pause mode?
        this.paused = false;

        //Call change backgrounds
        this.changeBackground(0);
    }

    changeBackground(offset=1)
    {
        //Find video index
        this.videoIndex = (this.videoIndex + offset) % arcade.videos.length;

        //Pause the video, change url of source
        this.videoElement.pause();
        this.sourceElement.setAttribute("src", arcade.videos[this.videoIndex].path);

        //Load the video and play it
        this.videoElement.load();
        this.videoElement.play();
    }

    setupTimer()
    {
        //Clear the existing timer
        clearInterval(this.timerID);

        //Set up the new timer
        this.timerID = window.setInterval(this.timerUpdate.bind(this), this.timerUpdateDelay * 1000);

        //Set up ended callback
        this.videoElement.addEventListener("ended", this.onVideoEnded.bind(this));
    }

    onVideoEnded()
    {
        //Change background
        this.changeBackground(1);

        //Reset state variables
        this.paused = false;
        this.pauseIndex = 0;
        this.videoSeconds = 0;
    }

    updatePauseState()
    {
        //Are we paused? If so.. set to none, otherwise: block
        if(this.paused)
            document.querySelector(".start.screen").style.display = "none";
        else
            document.querySelector(".start.screen").style.display = "block";
            
        //Is this.pauseIndex > video array length? 
        if(this.pauseIndex >= this.pauses.length)
            return;

        //More than the start?
        if (this.videoSeconds >= this.pauses[this.pauseIndex][0]) 
        {
            //Not paused? set paused to true.
            if (!this.paused)
                this.paused = true;
        }

        //More than the end?
        if (this.videoSeconds >= this.pauses[this.pauseIndex][1])
        {
            //Paused? reset to false
            if(this.paused)
                this.paused = false, 
                this.pauseIndex++;
        }
    }

    timerUpdate()
    {
        //Update paused state
        this.updatePauseState();

        //Increase seconds
        this.videoSeconds += this.timerUpdateDelay;
    }

    get pauses()
    {
        return arcade.videos[this.videoIndex].pauses;
    }

    get currentPath()
    {
        return arcade.videos[this.videoIndex].path;
    }

    get videoElement()
    {
        return document.querySelector("#background-video");
    }

    get sourceElement()
    {
        return document.querySelector("#background-video > source");
    }

}

window.addEventListener("load", () =>
{
    //Make a new video carousel
    let carousel = new VideoCarousel();

    //Then do some stuff
    console.log(carousel);
});