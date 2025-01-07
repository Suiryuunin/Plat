let _DELTATIME = 0;
let _PDELTATIME = 0;
let _TIME = 0;

const TargetFPS = document.createElement("div");
TargetFPS.style.position = "absolute";
TargetFPS.style.bottom = "36px";
TargetFPS.style.right = "4px";
TargetFPS.style.transform = "translateZ(1px)";
TargetFPS.style.color = "white";
document.querySelector("body").appendChild(TargetFPS);
const LiveFPS = document.createElement("div");
LiveFPS.style.position = "absolute";
LiveFPS.style.bottom = "4px";
LiveFPS.style.right = "4px";
LiveFPS.style.transform = "translateZ(1px)";
LiveFPS.style.color = "white";
document.querySelector("body").appendChild(LiveFPS);

class Engine
{
    constructor (fps, update, render)
    {
        this.time = 0;
        this.timeStamp = 0;
        this.delta = 0;
        this.update = update;
        this.render = render;
        this.fps = fps;
        this.fpsCap = 60;
        this.stopQueued = 0;

        _PDELTATIME = 1 / this.fps;

        window.addEventListener("keydown", (e) => {
            if (e.code == "Digit9" && this.fps > 1)
            {
                this.fps--;
            }
            if (e.code == "Digit0" && this.fps < this.fpsCap)
            {
                this.fps++;
            }
        });

        this.run = (time) =>
        {
            _TIME = this.time = time;
            this.delta = (this.time - this.timeStamp)/1;

            if (this.delta >= 1000 / (this.fps + 4))
            {
                for (let i = 0; i < 1; i++)
                    this.update();
                this.render();

                TargetFPS.innerHTML = "Target FPS: "+this.fps.toFixed(2);
                TargetFPS.style.color = this.fps > 24 ? "green" : "red";
                LiveFPS.innerHTML = " Live FPS: "+(1000/this.delta).toFixed(2);
                LiveFPS.style.color = (1000/this.delta) > 24 ? "green" : "red";

                this.timeStamp = time;

                _DELTATIME = this.delta / 1000;
                if (_DELTATIME > 2 / this.fps)
                    _DELTATIME = 1 / this.fps;
            }

            this.animationRequest = window.requestAnimationFrame(this.run);
        }
    }

    start()
    {
        this.animationRequest = window.requestAnimationFrame(this.run);
    }

    stop()
    {
        window.cancelAnimationFrame(this.animationRequest);
    }
}