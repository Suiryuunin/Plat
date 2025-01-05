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

// Viewport
const VP = {
    x:player1.t.x-res.w/2,
    y:player1.t.y-res.h/4*3,
    w:res.w,
    h:res.h
}
let adjustVY = false;


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

    adjustVY = false;
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
        adjustVY = true;
        player1.v.y = -16;
    }
    else
    {
        player1.v.y-=128/(1/60)*_DELTATIME;
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
        if (Math.abs(player1.v.x) >              2048*32/((player1.friction != undefined ? player1.friction:128) * (player1.t.h < playerH ? 2 : 1)))
            player1.v.x = Math.sign(player1.v.x)*2048*32/((player1.friction != undefined ? player1.friction:128) * (player1.t.h < playerH ? 2 : 1));
        // if (Math.abs(player1.v.x) > 2048*32/(player1.grounded ? ((player1.ground.friction != undefined ? player1.ground.friction:128) * (player1.t.h < playerH ? 2 : 1)) : 0.01))
        //     player1.v.x = Math.sign(player1.v.x)*2048*32/(player1.grounded ? ((player1.ground.friction != undefined ? player1.ground.friction:128) * (player1.t.h < playerH ? 2 : 1)) : 0.01);
    
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
        player1.v.y = 1024;
        player1.v.x = 1024 * (ri * -2 + 1);
        player1.friction = 64;
        Ljumped = true;
    }

    if (!keys[JUMPKEY]) JPressed = false;

    if (graceSec > 0)
    {
        adjustVY = true;
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
                player1.v.y = ((playerH - player1.t.h)/(playerH/2)*36)**2/1.2;
                upDowned = false;
            }
            graceSec = 0;
            player1.t.w = 64;
        }
    }

    // Viewport Position
    if (player1.t.y + player1.t.h*player1.t.o.y < VP.y || player1.t.y + player1.t.h*player1.t.o.y + player1.t.h > VP.y+VP.h)
        adjustVY = true;

    VP.x = player1.t.x-res.w/2;
    if (adjustVY)
        VP.y += ((player1.t.y-res.h/4*3)-VP.y)/16/(1/60)*_DELTATIME;
    else
        VP.y += ((player1.t.y-res.h/4*3)-VP.y)/32/(1/60)*_DELTATIME;


    // Restore Height
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

function AABB(x1,y1,w1,h1,x2,y2,w2,h2)
{
    if (
        x1 < x2 + w2 &&
        x1 + w1 > x2 &&
        y1 < y2 + h2 &&
        y1 + h1 > y2
    ) return true;
    return false;
}

const render = () =>
{
    rr.drawBackground(currentCtx, "black");
    
    for (const obj of SCENE.el)
    {
        if (
            AABB(
                VP.x,VP.y,VP.w,VP.h,
                obj.t.x+obj.t.o.x*obj.t.w, obj.t.y+obj.t.o.y*obj.t.h, obj.t.w, obj.t.h
            )
        )
            obj.visible = true;
        else
            obj.visible = false;
    }

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