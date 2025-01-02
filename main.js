"use strict";

const resize = () =>
{
    rr.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    rr.render();

};


// UI

const player1 = new Dynamic("rect", {x:64,y:res.h/2-64,w:128,h:128, o: {x:0,y:0}}, "white", new RectCollider());
const pad2 = new Dynamic("rect", {x:res.w-64,y:res.h/2-64,w:32,h:128, o: {x:-1,y:0}}, "white", new RectCollider());

const EDGEL = new Dynamic("rect", {x:4,    y:0, w:res.w,h:res.h, o: {x:-1,y:0}},  "white", new RectCollider());
const EDGER = new Dynamic("rect", {x:res.w-4,y:0,w:res.w,h:res.h, o: {x:0,y:0}}, "white", new RectCollider());
const EDGET = new Dynamic("rect", {x:0,y:4,     w:res.w,h:res.h, o: {x:0,y:-1}},  "white", new RectCollider());
const EDGEB = new Dynamic("rect", {x:-256,y:res.h-4,w:res.w+512,h:res.h, o: {x:0,y:0}}, "white", new RectCollider());

SCENE.init(player1);
SCENE.addBulk([EDGEB, EDGEL, EDGER, EDGET]);

//HARD CODED HELPERS ;-;
let my = 0;
let mx = 0;

const update = () =>
{

    switch (true)
    {
        case keys["KeyW"]: case keys["ArrowUp"]:
            my = 1;
            break;

        case keys["KeyS"]: case keys["ArrowDown"]:
            my = -1;
            break;

        default:
            my = 0;
            break;
    }
    switch (true)
    {
        case keys["KeyA"]:
            mx = -1;
            break;

        case keys["KeyD"]:
            mx = 1;
            break;

        default:
            mx = 0;
            break;
    }

    player1.v.x=mx*512;
    player1.v.y-=256;

    SCENE.update();

    SCENE.collisionsWith (
        player1, (target) => {
            if (target == EDGEB)
                player1.v.y = 0;
        },
        (target) => {
            
        },
        (target, tsides, l = undefined, r = undefined, t = undefined, b = undefined) => {
            
        },
    );
    if (my > 0)
        player1.v.y=2048;
    
};

const render = () =>
{
    rr.drawBackground(currentCtx, "black");

    SCENE.render();
    rr.render();
};

const keys = {
    "KeyW": false,
    "KeyS": false,
    "KeyA": false,
    "KeyD": false,
    "ArrowUp": false,
    "ArrowDown": false
}

window.addEventListener("keydown", (e) => {
    if(keys[e.code] === false)
        keys[e.code] = true;
});
window.addEventListener("keyup", (e) => {
    if(keys[e.code] === true)
        keys[e.code] = false;
});

// window.addEventListener("click", () =>
// {
//     SCENE.deleteItem(rect2);
//     rect2 = null;
// });


const _ENGINE = new Engine(60, update, render);
_ENGINE.start();

addEventListener("load", () => {resize();});

addEventListener("resize", resize);