let option = undefined;

let mI = undefined;

const mouseDown = (e) => {

    if (Math.floor(gameState) == 0)
        mI = new MouseInput(e);

}

const mouseUp = () => {

    
    if (mI != undefined && mI.el != undefined && mI.el.alpha == 1 && mI.el.type == "options") {

        mI.el.index *= 1;
        mI.el.index = (mI.el.index + 1) % mI.el.options.length;
        
        if (mI.el.changed === false)
            mI.el.changed = true;

    }

    if (mI != undefined && mI.el != undefined && mI.el.type == "button") {

        mI.el.action();

    }

    mI = undefined;

}

class MouseInput {

    constructor(e) {

        let page = pages[Math.floor(gameState * 10 - 1)];

        this.updateValue = function() {

            if (this.el.type == "slider")
                this.el.value = Math.ceil((this.el.x - (this.el.fixedPos[0] - Math.floor(this.el.width / 2))) / (this.el.barWidth / this.el.minMax[1])) + this.el.valueOffset;

        };
        
        this.getElement = function() {

            for (let i = 0; i < page.length; i++) {

                if ( page[i].alpha == 1 && page[i].type == "slider" && ((e.clientX - edge[0] > Math.floor((page[i].fixedPos[0] / 384 * 0.8 + 0.1) * rr.canvas.width) && e.clientX - edge[0] < Math.floor(((page[i].fixedPos[0] + page[i].barWidth) / 384 * 0.8 + 0.1) * rr.canvas.width)) && (e.clientY - edge[1] > Math.floor((page[i].fixedPos[1] / 288 * 0.8 + 0.1) * rr.canvas.height) && e.clientY - edge[1] < Math.floor(((page[i].fixedPos[1] + page[i].height) / 288 * 0.8 + 0.1) * rr.canvas.height))) ) {

                    page[i].x = Math.floor( Math.round( ( ( (((e.clientX - edge[0]) / rr.canvas.width - 0.1) / 0.8 * 384) ) - page[i].fixedPos[0]) / (page[i].barWidth / page[i].minMax[1])) * (page[i].barWidth / page[i].minMax[1]) + page[i].fixedPos[0] - page[i].width / 2);
                    return (page[i]);

                }


                if ((e.clientX - edge[0] > Math.floor((page[i].x / 384 * 0.8 + 0.1) * rr.canvas.width) && e.clientX - edge[0] < Math.floor(((page[i].x + page[i].width) / 384 * 0.8 + 0.1) * rr.canvas.width)) && (e.clientY - edge[1] > Math.floor((page[i].y / 288 * 0.8 + 0.1) * rr.canvas.height) && e.clientY - edge[1] < Math.floor(((page[i].y + page[i].height) / 288 * 0.8 + 0.1) * rr.canvas.height)))
                    return(page[i]);

                
            }
            
        };
        
        this.el = this.getElement();

        if (this.el != undefined)
            this.updateValue();

    }
    
    move(e) {
    
        if (mI != undefined && mI.el != undefined && mI.el.alpha == 1 && mI.el.type == "slider") {
            
            if (e.clientX - edge[0] > Math.floor((mI.el.fixedPos[0] / 384 * 0.8 + 0.1) * rr.canvas.width - (mI.el.width / 2 - 4)) && e.clientX - edge[0] < Math.floor(((mI.el.fixedPos[0] + mI.el.barWidth) / 384 * 0.8 + 0.1) * rr.canvas.width) )
                mI.el.x = Math.floor( Math.round( ( ( (((e.clientX - edge[0]) / rr.canvas.width - 0.1) / 0.8 * 384) ) - mI.el.fixedPos[0]) / (mI.el.barWidth / mI.el.minMax[1])) * (mI.el.barWidth / mI.el.minMax[1]) + mI.el.fixedPos[0] - mI.el.width / 2);


            if (e.clientX - edge[0] < Math.floor((mI.el.fixedPos[0] / 384 * 0.8 + 0.1) * rr.canvas.width - (mI.el.width / 2 - 4)) )
                mI.el.x = mI.el.fixedPos[0] - Math.floor(mI.el.width / 2);

            if (e.clientX - edge[0] > Math.floor(((mI.el.fixedPos[0] + mI.el.barWidth) / 384 * 0.8 + 0.1) * rr.canvas.width) )
                mI.el.x = mI.el.fixedPos[0] + mI.el.barWidth - Math.floor(mI.el.width / 2);

            mI.updateValue();
            if (mI.el.changed === false)
                mI.el.changed = true;
        }
    
    }

}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);
window.addEventListener("mousedown", mouseDown);
window.addEventListener("mouseup", mouseUp);