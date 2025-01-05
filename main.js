"use strict";

const resize = () =>
{
    rr.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    rr.render();

};

//KEYBINDS default
let UPKEY = "KeyW";
let DOWNKEY = "KeyS";
let LEFTKEY = "KeyA";
let RIGHTKEY = "KeyD";
let DASHKEY = "KeyJ";
let JUMPKEY = "KeyK";
let GRABKEY = "KeyL";


// UI
const playerW = 64;
const playerH = 64;
const player1 = new Dynamic("rect", {x:64,y:res.h/2-64,w:playerW,h:playerH, o: {x:-0.5,y:-1}}, "black", new RectCollider());
player1.name = "player";

const pad2 = new Dynamic("rect", {x:res.w-64,y:res.h/2-64,w:32,h:128, o: {x:-1,y:0}}, "black", new RectCollider());

const EDGEL = new Dynamic("rect", {x:8,    y:0, w:4,h:res.h, o: {x:-1,y:0}},  "black", new RectCollider());
const EDGER = new Dynamic("rect", {x:res.w-8,y:0,w:4,h:res.h, o: {x:0,y:0}}, "black", new RectCollider());
const EDGET = new Dynamic("rect", {x:0,y:8,     w:res.w,h:4, o: {x:0,y:-1}},  "black", new RectCollider());
const EDGEB = new Dynamic("rect", {x:0,y:res.h-8,w:res.w,h:4, o: {x:0,y:0}}, "black", new RectCollider());

const PLAT = new Dynamic("rect", {x:0,y:res.h-256,w:256,h:4, o: {x:0,y:0}}, "black", new RectCollider());
PLAT.hitbox.sides = _PLATFORM;
EDGEB.friction = 32;

const crouchWall = new Dynamic("rect", {x:256,y:res.h-12-16-5,     w:128,h:512, o: {x:0,y:-1}}, "black", new RectCollider());
const crouchWall2 = new Dynamic("rect", {x:1024,y:res.h-12-16-5-16,     w:128,h:128, o: {x:0,y:-1}}, "black", new RectCollider());
const point = new Dynamic("circle", {x:8,y:8,     w:8,h:8, o: {x:-.5,y:-.5}}, "yellow");

SCENE.init(player1);
SCENE.addBulk([point,EDGEL,EDGER, EDGEB, EDGET, crouchWall, crouchWall2, PLAT]);

//HARD CODED HELPERS ;-;
let dx = 0;

let ri = false;
let le = false;
//uncrouchable
let uc = true;
let graceSec = 0.1;
let LgraceSec = 0.1;
let Ljumped = false;
let JPressed = false;
let upDowned = false;

let onLedge = false;

const update = () =>
{
    SCENE.update();

    player1.grounded = false;
    
    if (graceSec > 0)
        graceSec -= _DELTATIME;

    ri = false;
    le = false;

    SCENE.collisionsWith (
        player1, (target) => {

        },
        (target) => {
            
        },
        (target, tsides) => {
            if (tsides.l || tsides.r)
            {
                onLedge = true;
                if (tsides.r){
                    ri = true;
                    player1.v.x = 0;
                }
                if (tsides.l){
                    le = true;
                    player1.v.x = 0;
                }
            }
            else
            {
                onLedge = false;
            }
        },
    );
    
    if (LgraceSec > 0)
        LgraceSec -= _DELTATIME;

    if (onLedge && graceSec <= 0)
    {
        LgraceSec = 0.1;
        Ljumped = false;
    }

    if (onLedge && keys[GRABKEY] && (player1.v.y < -16))
    {
        player1.v.y = -16;
    }
    else
    {
        player1.v.y-=256/(1/60)*_DELTATIME;
    }

    if (player1.grounded)
    {
        player1.v.y = 0;
    }

    if (ri && dx > 0 || le && dx < 0)
    {
        player1.v.x = 0;
    }
    else
    {
        onLedge = false;

        player1.v.x += dx* (player1.grounded ? (player1.ground.friction != undefined ? player1.ground.friction : 128) : AIRACC);
        if (Math.abs(player1.v.x) > 2048*32/(player1.grounded ? ((player1.ground.friction != undefined ? player1.ground.friction:128) * (player1.t.h < playerH ? 2 : 1)) : 0.01))
            player1.v.x = Math.sign(player1.v.x)*2048*32/(player1.grounded ? ((player1.ground.friction != undefined ? player1.ground.friction:128) * (player1.t.h < playerH ? 2 : 1)) : 0.01);
    
        if (dx == 0 && player1.v.x != 0)
        {
            const oldSign = Math.sign(player1.v.x);
            player1.v.x -= Math.sign(player1.v.x)*(player1.ground.friction != undefined ? player1.ground.friction/2:128);
            if (Math.sign(player1.v.x) != oldSign) player1.v.x = 0;
        }

    }
    

    player1.hitbox.coldt.w = player1.t.w;
    player1.hitbox.coldt.h = player1.t.h;

    if (!JPressed && keys[JUMPKEY] && LgraceSec > 0 && !Ljumped)
    {
        JPressed = true;
        player1.v.y = 2048;
        player1.v.x = 1024 * (ri * -2 + 1);
        Ljumped = true;
    }
    if (!keys[JUMPKEY]) JPressed = false;

    if (graceSec > 0)
    {
        if (keys[JUMPKEY]) upDowned = true;
        if (keys[JUMPKEY] || keys[DOWNKEY])
        {
            player1.t.h = ((player1.t.h-16)/1.5)*(1/60)/_DELTATIME+16;
            if ((36 - player1.t.h) > 0)
                player1.t.w = (36 - player1.t.h)+64;

        }
        else if (player1.t.h != playerH)
        {
            if (upDowned)
            {
                player1.v.y = ((playerH - player1.t.h)/(playerH/2)*36)**2;
                upDowned = false;
            }
            graceSec = 0;
            player1.t.w = 64;
        }
    }
    if (!(keys[JUMPKEY] || keys[DOWNKEY]) && player1.t.h != playerH)
    {
        player1.t.h += (playerH - player1.t.h)/2/(1/60)*_DELTATIME;
        if (player1.t.h > playerH-1) player1.t.h = playerH;

        if (player1.grounded)
        {
            const ray = new Ray(player1.t.x + player1.t.o.x*player1.t.w+(player1.t.w-playerW)/2+1,                player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-4, player1.t.x + player1.t.o.x*player1.t.w+(player1.t.w-playerW)/2+1,               player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-64);
            const ray2 = new Ray(player1.t.x + player1.t.o.x*player1.t.w + player1.t.w-(player1.t.w-playerW)/2-1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-4, player1.t.x + player1.t.o.x*player1.t.w + player1.t.w-(player1.t.w-playerW)/2-1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-64);
    
            if (Math.min(ray.cast(SCENE, player1).dis, ray2.cast(SCENE, player1).dis)+4 < player1.t.h)
                player1.t.h = Math.min(ray.cast(SCENE, player1).dis, ray2.cast(SCENE, player1).dis)+4;
        }

        // point.t.x = (ray.cast(SCENE, player1).hit != undefined ? ray.cast(SCENE, player1).hit.x : 0);
        // point.t.y = (ray.cast(SCENE, player1).hit != undefined ? ray.cast(SCENE, player1).hit.y : 0);
        // console.log(Math.min(ray.cast(SCENE, player1).dis, ray2.cast(SCENE, player1).dis))
    }
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
    "KeyD": false
}

window.addEventListener("keydown", (e) => {
    if (keys[e.code]) return;

    if (e.code == LEFTKEY && dx > -1)
        dx--;
    if (e.code == RIGHTKEY && dx < 1)
        dx++;

    keys[e.code] = true;
});
window.addEventListener("keyup", (e) => {
    if (e.code == LEFTKEY && keys[e.code] && dx < 1)
        dx++;
    if (e.code == RIGHTKEY && keys[e.code] && dx > -1)
        dx--;

    delete keys[e.code];
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