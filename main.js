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


let DASHCOLOR = {
    r:0,
    g:255,
    b:255
};
const _DASHTSteps = Math.round(256/(1/60));
let DASHTSteps = _DASHTSteps;


for (const obj of SCENE.SF)
{
    obj.r = DASHCOLOR.r;
    obj.g = DASHCOLOR.g;
    obj.b = DASHCOLOR.b;
    obj.outc = `rbg(${obj.r}, ${obj.g}, ${obj.b})`;
}

// Viewport
const VP = {
    x:player1.t.x-res.w/2,
    y:player1.t.y-res.h/4*3,
    w:res.w,
    h:res.h
}
let adjustVY = false;


let dx = 0;
let dy = 0;
let ldx = 1;
let ldy = 1;

let ri = false;
let le = false;
//uncrouchable
let uc = true;
let graceSec = 0.1;
let LgraceSec = 0.1;
let Ljumped = false;
let canLJump = false;
let JPressed = false;

let dashed = false;
let dashStop = false;
let dsec = 0;
let dSsec = 0;
let dashLeft = 1;

let dst = undefined;
let dsa = 1;

let onLedge = false;

const update = () =>
{
    SCENE.update();

    DASHTSteps = Math.round(_DASHTSteps * _DELTATIME);
    for (const obj of SCENE.SF)
    {
        if (obj.outc == `rbg(${DASHCOLOR.r}, ${DASHCOLOR.g}, ${DASHCOLOR.b})`) break;

        if (Math.abs(obj.r - DASHCOLOR.r) < 1 && Math.abs(obj.g - DASHCOLOR.g) < 1 && Math.abs(obj.b - DASHCOLOR.b) < 1)
        {
            obj.r = DASHCOLOR.r;
            obj.g = DASHCOLOR.g;
            obj.b = DASHCOLOR.b;
        }
        else
        {
            obj.r += (DASHCOLOR.r - OCrgb.r)/DASHTSteps;
            obj.g += (DASHCOLOR.g - OCrgb.g)/DASHTSteps;
            obj.b += (DASHCOLOR.b - OCrgb.b)/DASHTSteps;
            
            obj.outc = `rbg(${obj.r}, ${obj.g}, ${obj.b})`;
        }
    }

    adjustVY = false;
    player1.grounded = false;
    
    if (graceSec > 0)
        graceSec -= _DELTATIME;

    ri = false;
    le = false;

    let totalCollisions = 0;
    SCENE.collisionsWith (
        player1, (target) => {
            totalCollisions++;
            if (target.name == "StaminaFruit" && target.outc == `rbg(${DASHCOLOR.r}, ${DASHCOLOR.g}, ${DASHCOLOR.b})` && dashLeft == 0)
            {
                dashLeft++;
                target.r = OCrgb.r;
                target.g = OCrgb.g;
                target.b = OCrgb.b;
                target.outc = `rbg(${target.r}, ${target.g}, ${target.b})`;
            }
        },
        (target) => {
            
        },
        (target, tsides) => {
            if (target.trigger)
                return;


            if (tsides.l || tsides.r)
            {
                onLedge = true;
                if (!keys[JUMPKEY] && !keyups[JUMPKEY])
                    canLJump = true;
                else
                    canLJump = false;
                
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
            
            if (tsides.t)
            {
                player1.v.y += (1-player1.v.y)/4;
            }
            if (tsides.b)
            {
                player1.grounded = true;
                player1.ground = target.parent;
                player1.friction = target.parent.friction;
                graceSec = 0.1;
            }
        },
    );
    if (totalCollisions == 0)
    {
        onLedge = false;
    }
    
    if (LgraceSec > 0)
        LgraceSec -= _DELTATIME;

    if (onLedge && graceSec <= 0)
    {
        LgraceSec = 0.1;
        Ljumped = false;
    }

    if (dsec > 0) dsec -= _DELTATIME;

    if (dSsec > 0)
    {
        dsa = dSsec/0.5;
        dSsec -= _DELTATIME;
    }
    else dst = undefined;

    if (onLedge && keys[GRABKEY] && (player1.v.y < -16))
    {
        adjustVY = true;
        if (!dashed || (dashed && player1.v.y < 1))
            player1.v.y = -16;
        else
        {
            // player1.v.y -= player1.v.y/2;
            // dashStop = true;
            player1.v.y = 0;
        }
    }
    else
    {
        if (!dashed || (dashed && player1.v.y < 1))
            player1.v.y-= dsec > 0 ? 4/(1/60)*_DELTATIME : 128/(1/60)*_DELTATIME;
        else
        {
            // player1.v.y -= player1.v.y/2;
            // dashStop = true;
            player1.v.y = 0;
        }
    }

    if (player1.grounded)
    {
        player1.v.y = 0;
        dashLeft = 1;
    }

    if (ri && dx > 0 || le && dx < 0)
    {
        player1.v.x = 0;
    }
    else
    {
        // onLedge = false;

        player1.v.x += dx* (player1.grounded ? (player1.ground.friction != undefined ? player1.ground.friction : 128) : AIRACC);
        if (Math.abs(player1.v.x) >              2048*32/((player1.friction != undefined ? player1.friction:128) * (player1.t.h < playerH/2 ? 2 : 1)))
            player1.v.x = Math.sign(player1.v.x)*2048*32/((player1.friction != undefined ? player1.friction:128) * (player1.t.h < playerH/2 ? 2 : 1));
        // if (Math.abs(player1.v.x) > 2048*32/(player1.grounded ? ((player1.ground.friction != undefined ? player1.ground.friction:128) * (player1.t.h < playerH ? 2 : 1)) : 0.01))
        //     player1.v.x = Math.sign(player1.v.x)*2048*32/(player1.grounded ? ((player1.ground.friction != undefined ? player1.ground.friction:128) * (player1.t.h < playerH ? 2 : 1)) : 0.01);
    
        if (dx == 0 && player1.v.x != 0)
        {
            const oldSign = Math.sign(player1.v.x);
            player1.v.x -= Math.sign(player1.v.x)*(player1.ground != undefined ? (player1.ground.friction ? player1.ground.friction/2:128) : 128)/(1/60)*_DELTATIME;
            if (Math.sign(player1.v.x) != oldSign) player1.v.x = 0;
        }

    }
    

    player1.hitbox.coldt.w = player1.t.w;
    player1.hitbox.coldt.h = player1.t.h;

    if (!keys[JUMPKEY] && !keys[DOWNKEY] && !keyups[JUMPKEY])
    {
    }


    if (!JPressed && keys[JUMPKEY] && LgraceSec > 0 && !Ljumped && canLJump)
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
        
        if (keys[JUMPKEY] || keys[DOWNKEY])
        {
            player1.imgT.b = 4;

            player1.t.h = ((player1.t.h-16)/1.5)*(1/60)/_DELTATIME+16;
            if ((36 - player1.t.h) > 0)
                player1.t.w = (36 - player1.t.h)+56;

        }
        else if (player1.t.h != playerH)
        {
            if (keyups[JUMPKEY])
            {
                player1.v.y = ((playerH - player1.t.h)/(playerH/2)*36)**2/1.2;
                graceSec = 0;
            }

            player1.t.w = 64;
        }
    }


    // Dash
    if (!keys[DASHKEY] && dashed)
    {
        dashStop = false;
        dashed = false;
    }
    else if (keys[DASHKEY] && !dashed && dashLeft > 0)
    {
        dashLeft--;
        dsec = 0.1;
        dSsec = 0.5;

        dst = {
            x:player1.t.x,
            y:player1.t.y,
            w:player1.t.w,
            h:player1.t.h,
            o:player1.t.o,
        }

        dashed = true;
        player1.v.x = 0;
        player1.v.y = 0;
        if (ldx == 0 && ldy == 0 && dx == 0 && dy == 0)
            player1.v.x = 16384*(1/60)/_DELTATIME;
        else
        {
            if (dx == 0 && dy == 0)
            {
                if (!(ldx == 0 && ldx == 0))
                {
                    player1.v.x = Math.sqrt(16384**2/2)*(1/60)/_DELTATIME *ldx;
                    player1.v.y = Math.sqrt((16384*1.2)**2/2)*(1/60)/_DELTATIME *ldy;
                }
                else
                {
                    player1.v.x = 16384*(1/60)/_DELTATIME *ldx;
                    player1.v.y = 16384*(1/60)/_DELTATIME *ldy;
                }
            }
            else
            {
                if (!(dx == 0 && dx == 0))
                {
                    player1.v.x = Math.sqrt(16384**2/2)*(1/60)/_DELTATIME *dx;
                    player1.v.y = Math.sqrt((16384*1.2)**2/2)*(1/60)/_DELTATIME *dy;
                }
                else
                {
                    player1.v.x = 16384*(1/60)/_DELTATIME *dx;
                    player1.v.y = 16384*(1/60)/_DELTATIME *dy;
                }
            }

            if (dy != 0 || ldy != 0) dsec += 0.07;
        }
    }


    // Viewport Position
    if (player1.t.y + player1.t.h*player1.t.o.y < VP.y || player1.t.y + player1.t.h*player1.t.o.y + player1.t.h > VP.y+VP.h)
        adjustVY = true;
    
    if (Math.abs(player1.t.x-res.w/2-VP.x) > 16)
    {
        VP.x += ((player1.t.x-res.w/2)-VP.x)/16/(1/60)*_DELTATIME;
    }
    if (Math.abs(player1.t.y-res.h/4*3-VP.y) > 16)
    {
        if (adjustVY)
            VP.y += ((player1.t.y-res.h/4*3)-VP.y)/16/(1/60)*_DELTATIME;
        else
            VP.y += ((player1.t.y-res.h/4*3)-VP.y)/32/(1/60)*_DELTATIME;
    }


    // Restore Height
    if (!(keys[JUMPKEY] || keys[DOWNKEY]))
    {
        console.log(onLedge)
        if (player1.grounded || (onLedge && keys[GRABKEY]) || keyups[JUMPKEY])
        {
            player1.t.h += ((Math.sin(_TIME/512)*2+58)-player1.t.h)/2/(1/60)*_DELTATIME;
            player1.imgT.b = 4;
        }
        else if (player1.v.y > 0)
        {
            player1.t.h = 72;
            player1.imgT.b = 4;
        }
        else
            player1.imgT.b = 16;

        // player1.t.w += (-Math.sin(_TIME/512)*2+56)-player1.t.w;


        if (!(keys[JUMPKEY] || keys[DOWNKEY]))
        {
            const ray = new Ray(player1.t.x + player1.t.o.x*player1.t.w+               (player1.t.w-playerW)/2+1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-4, player1.t.x + player1.t.o.x*player1.t.w+              (player1.t.w-playerW)/2+1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-64);
            const ray2 = new Ray(player1.t.x + player1.t.o.x*player1.t.w + player1.t.w-(player1.t.w-playerW)/2-1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-4, player1.t.x + player1.t.o.x*player1.t.w + player1.t.w-(player1.t.w-playerW)/2-1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-64);
            if (Math.min(ray.cast(SCENE, player1).dis, ray2.cast(SCENE, player1).dis)+4 < playerH)
            {
                player1.t.h = Math.min(ray.cast(SCENE, player1).dis, ray2.cast(SCENE, player1).dis)+3;
                player1.imgT.b = 4;
            }
        }

        // point.t.x = (ray.cast(SCENE, player1).hit != undefined ? ray.cast(SCENE, player1).hit.x : 0);
        // point.t.y = (ray.cast(SCENE, player1).hit != undefined ? ray.cast(SCENE, player1).hit.y : 0);
        // console.log(Math.min(ray.cast(SCENE, player1).dis, ray2.cast(SCENE, player1).dis))
    }

    if (keyups[JUMPKEY])
        delete keyups[JUMPKEY]

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
    rr.drawBackground(currentCtx, BGCOLOR);
    
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
    if (dst != undefined)
    {
        let tt = {
            x:dst.x-VP.x,
            y:dst.y-VP.y,
            w:dst.w,
            h:dst.h,
            o:dst.o
        };
        // rr.drawRect(currentCtx, tt, player1.c, dsa, "fillborder", 1, "cyan");
    }
    rr.render();
};

const keys = {
    "KeyW": false,
    "KeyS": false,
    "KeyA": false,
    "KeyD": false
}
const keyups = {};

window.addEventListener("keydown", (e) => {
    if (keys[e.code]) return;

    switch (e.code)
    {
        case UPKEY:
        {
            ldy = 1;
            if (dy < 1) dy++;
            break;
        }
        case DOWNKEY:
        {
            ldy = -1;
            if (dy > -1) dy--;
            break;
        }
        case LEFTKEY:
        {
            ldx = -1;
            if (dx > -1) dx--;
            break;
        }
        case RIGHTKEY:
        {
            ldx = 1;
            if (dx < 1) dx++;
            break;
        }
    }

    keys[e.code] = true;
});
window.addEventListener("keyup", (e) => {
    if (e.code == UPKEY && keys[e.code] && dy > -1)
        dy--;
    if (e.code == DOWNKEY && keys[e.code] && dy < 1)
        dy++;
    if (e.code == LEFTKEY && keys[e.code] && dx < 1)
        dx++;
    if (e.code == RIGHTKEY && keys[e.code] && dx > -1)
        dx--;

    delete keys[e.code];
    keyups[e.code] = true;

    if (!(keys[LEFTKEY] && keys[RIGHTKEY]))
        ldx = 0;
    if (!(keys[UPKEY] && keys[DOWNKEY]))
        ldy = 0;
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