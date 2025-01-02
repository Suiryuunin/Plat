class Settings {

    constructor() {

        // Default values
        // Setup
        this.text = "Genesis";
        this.genMode = 0;
        this.gameMode = 0;
        this.oGameMode = 0;
        this.words = 30;
        this.maxChar = 30;
        
        // Gameplay
        this.maxWords = 3;
        this.interval = 50;
        this.speed = 2;
        this.bF = 0;
        this.ceil = 0;
        this.health = 3;
        this.caps = false;
        this.auto = 1;
        this.old = [this.text, this.genMode, this.gameMode, this.words, this.maxChar];
        this.check = false;

    }

    updateOld()
    {
        this.old = [this.text, this.genMode, this.gameMode, this.words, this.maxChar];
    }

    modify(/* Gameplay -> */ maxWords, interval, speed, caps, auto, space, bF, ceil,
        /* Setup -> */ text = this.text, genMode = this.genMode, gameMode = this.gameMode, words = this.words, maxChar = this.maxChar)
    {

        this.maxWords = maxWords;
        this.interval = interval;
        this.speed = speed;
        this.caps = caps;
        this.auto = auto;
        this.check = space;
        this.bF = bF;
        this.ceil = ceil;

        this.text = text;
        this.genMode = genMode;
        this.gameMode = gameMode;
        this.words = words;
        this.maxChar = maxChar;

    }
    
}

class Slider {

    constructor(setting, x, y, w, h, rr, value = 0, minMax, valueOffset = 0, alpha = 1) {

        this.type = "slider";

        this.setting = setting;

        this.x = x + 60;
        this.y = y;
        this.barX = x + Math.floor(w / 2);
        this.barY = y + Math.floor(h / 2);
        this.fixedPos = [this.x + w / 2, this.y];
        this.w = w;
        this.h = h;
        this.o = {x:0,y:0};
        this.rr = rr;
        this.value = value;
        this.fake;
        this.minMax = minMax;
        this.valueOffset = valueOffset;

        this.alpha = alpha

        this.barWidth = this.w + Math.floor(this.rr.settings.canvas.w / 2) - 48;

    }

    updatePos() {

        this.rr.drawWord(this.rr.settings, this.setting, 48, this.y - 5, 0, false, 1, 16, this.alpha);

        this.rr.drawRect(this.rr.settings, {x:this.x,           y:this.y,               w:this.w,        h:this.h,     o:this.o}, this.rr.color, 1, this.alpha);
        this.rr.drawRect(this.rr.settings, {x:this.x,           y:this.y,               w:this.w,        h:this.h,     o:this.o}, this.rr.color, 1, this.alpha);
        this.rr.drawRect(this.rr.settings, {x:this.fixedPos[0], y:this.fixedPos[1] + 3, w:this.barWidth, h:this.h - 6, o:this.o}, this.rr.color, 1, this.alpha);
        
        this.rr.drawWord(this.rr.settings, (this.fake == undefined ? [this.value] : [this.fake]), 188, this.y - 5, {x:-0.5,y:0}, false, 16, "white",this.alpha);
        this.rr.drawFill(this.rr.settings, {x:this.x,           y:this.y,               w:this.w,        h:this.h,     o:this.o}, 0.5 - (1-this.alpha) / 2)

    }

}

class Options {

    constructor(setting, x, y, rr, options, index = 0, offsetX = 0, alpha = 1) {

        this.type = "options";

        this.setting = setting;

        this.x = x + 168;
        this.y = y - 5;
        this.fixedPos = [this.x, this.y];
        this.offsetX = offsetX;

        this.rr = rr;
        this.options = options;
        this.index = index;

        this.rr.settings.font = `16px MisterPixel`;
        this.w = this.rr.settings.measureText(this.options[this.index])["w"];
        this.h = 16;

        this.alpha = alpha

    }

    updatePos() {

        this.rr.settings.font = `16px MisterPixel`;
        this.w = this.rr.settings.measureText(this.options[this.index])["w"];

        this.x = this.fixedPos[0] + this.offsetX * this.w + 2;

        this.rr.drawWord(this.rr.settings, this.setting, 48, this.y, 0, false, 1, 16, this.alpha);
        this.rr.drawWord(this.rr.settings, this.options[this.index], this.fixedPos[0], this.y, this.offsetX, true, 1, 16, this.alpha);

    }

}

class Button {

    constructor(x, y, rr, text, offsetX = 0, enabled, pageChange) {

        this.type = "button";

        this.text = text;

        this.x = x;
        this.y = y - 6;
        this.fixedPos = [this.x, this.y];
        this.offsetX = offsetX;
        this.enabled = enabled;

        this.rr = rr;

        this.rr.settings.font = `16px MisterPixel`;
        this.w = this.rr.settings.measureText(this.text)["w"];
        this.h = 16;

        this.action = () => {

            if (enabled) {

                if (pageChange * 0 == 0)
                {
                    gameState += pageChange;
                    lastPage += pageChange;
                }
                else
                {
                    document.getElementById('borderS').style.rr = 'none';
                    
                    INIT();
                }

            }
        
        }

    }

    updatePos() {

        this.rr.settings.font = `16px MisterPixel`;
        this.w = this.rr.settings.measureText(this.text)["w"];

        this.x = this.fixedPos[0] + this.offsetX * this.w + 2;

        this.rr.drawWord(this.rr.settings, this.text, this.fixedPos[0], this.y, this.offsetX, false, 1, 16, (this.enabled) ? 1 : 0.5);

    }

}