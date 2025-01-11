"use strict";

const resize = () =>
{
    rr.resize(window.innerWidth, window.innerHeight, res.h/res.w);
    rr.render();

};

let rCooldown = 0;

//KEYBINDS default
let UPKEY = "KeyW";
let DOWNKEY = "KeyS";
let LEFTKEY = "KeyA";
let RIGHTKEY = "KeyD";
let DASHKEY = "KeyJ";
let JUMPKEY = "KeyK";
let GRABKEY = "KeyL";


const DASHCOLOR = {
    h:192,
    s:56,
    l:72
};


// Viewport
const VP = {
    x:player1.t.x-res.w/2,
    y:player1.t.y-res.h/4*3,
    w:res.w,
    h:res.h
};
let adjustVY = false;

function AdjustVP()
{
    if (player1.t.y + player1.t.h*player1.t.o.y < VP.y)
        adjustVY = true;
    
    if (Math.abs(player1.t.x-res.w/2-VP.x) > 16)
    {
        VP.x += ((player1.t.x-res.w/2)-VP.x)/16/(1/60)*_DELTATIME;
    }
    if (Math.abs(player1.t.y-res.h/4*3-VP.y) > 16)
    {
        switch (true)
        {
            case (adjustVY):
                VP.y += ((player1.t.y-res.h/4*3)-VP.y)/16/(1/60)*_DELTATIME;
                break;
            case (!player1.grounded && player1.t.y + player1.t.h*player1.t.o.y + player1.t.h >= VP.y+VP.h-128 && player1.t.y + player1.t.h*player1.t.o.y + player1.t.h < VP.y+VP.h-64):
                VP.y += ((player1.t.y-res.h*.75)-VP.y)/12/(1/60)*_DELTATIME;
                break;
            case (!player1.grounded && player1.t.y + player1.t.h*player1.t.o.y + player1.t.h >= VP.y+VP.h-64 && player1.t.y + player1.t.h*player1.t.o.y + player1.t.h < VP.y+VP.h-32):
                VP.y += ((player1.t.y-res.h*.75)-VP.y)/6/(1/60)*_DELTATIME;
                break;
            case (!player1.grounded && player1.t.y + player1.t.h*player1.t.o.y + player1.t.h >= VP.y+VP.h-32 && player1.t.y + player1.t.h*player1.t.o.y + player1.t.h < VP.y+VP.h-16):
                VP.y += ((player1.t.y-res.h/4*3)-VP.y)/4/(1/60)*_DELTATIME;
                break;
            case (!player1.grounded && player1.t.y + player1.t.h*player1.t.o.y + player1.t.h >= VP.y+VP.h-16 && player1.t.y + player1.t.h*player1.t.o.y + player1.t.h < VP.y+VP.h-8):
                VP.y += ((player1.t.y-res.h/4*3)-VP.y)/3.5/(1/60)*_DELTATIME;
                break;
            case (!player1.grounded && player1.t.y + player1.t.h*player1.t.o.y + player1.t.h >= VP.y+VP.h-8 && player1.t.y + player1.t.h*player1.t.o.y + player1.t.h < VP.y+VP.h-0):
                VP.y += ((player1.t.y-res.h/4*3)-VP.y)/3/(1/60)*_DELTATIME;
                break;
            default:
                VP.y += ((player1.t.y-res.h/4*3)-VP.y)/32/(1/60)*_DELTATIME;
                break;
        }
        
    }

    VP.x = Math.round(VP.x);
    VP.y = Math.round(VP.y);
}


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
let dashLeft = 0;

let dst = undefined;
let dsa = 1;

let Pc = {
    h: 0,
    s:50,
    l:100
}

let onLedge = false;

const midMsg = document.getElementById("midMsg");

function Events(obj)
{
    switch (obj)
    {
        case p[0]:case p[1]:case p[2]:
            midMsg.innerHTML = "Press WASD to Move";
            break;

        case p[3]:
            midMsg.innerHTML = "Press K to Jump";
            break;

        case p[5]:case p[6]:
            midMsg.innerHTML = "Press L to Grab onto a Ledge";
            break;
            
        case p[26]:case p[27]:case p[28]:
            midMsg.innerHTML = "Press K to Wall Jump";
            break;

        case p[8]:
            midMsg.innerHTML = "Gold Orbs Grant You 2 Dash Charges";
            break;
            
        case p[13]:
            midMsg.innerHTML = "Blue Orbs Grant You 1 Dash Charge</br></br>Press J to Dash";
            break;

        case p[41]:
            midMsg.innerHTML = "This Is A Checkpoint! :D";
            break;

        case final[0]: case final[1]:
            midMsg.innerHTML = "YOU DID IT!!!!</br></br>...</br></br>Due to Various Reasons, The Level Is Hella Short...My Bad ;P";
            break;

        default:
            midMsg.innerHTML = "";
            break;
    }
}








function DashPowerUp(sf)
{
    dashLeft=sf.double?2:1;
    sf.s = DashPowerDownParam.s;
    sf.l = DashPowerDownParam.l;
    sf.filter = `sepia(${sf.s}) hue-rotate(${sf.double?DASHH2:DASHH1}deg) saturate(${sf.double?DASHS2:DASHS1})`;
    sf.fps = 12;
}

const update = () =>
{

    

    // Reset filter
    for (const obj of SCENE.SF)
    {
        if (!(obj.filter == `sepia(${DashPowerUpParam.s}) hue-rotate(${obj.double?DASHH2:DASHH1}deg) saturate(${obj.double?DASHS2:DASHS1})`))
        {
            if (Math.abs(DashPowerUpParam.s - obj.s) < 0.1)
            {
                obj.s = DashPowerUpParam.s;
                obj.filter = `sepia(${obj.s}) hue-rotate(${obj.double?DASHH2:DASHH1}deg) saturate(${obj.double?DASHS2:DASHS1})`;
                obj.fps = 16;
            }
            else
            {
                obj.s += (DashPowerUpParam.s - DashPowerDownParam.s)/128/(1/60)*_DELTATIME;
                
                obj.filter = `sepia(${obj.s}) hue-rotate(${obj.double?DASHH2:DASHH1}deg) saturate(${obj.double?DASHLS2:DASHLS1})`;
            }
        }
    }

    if (((player1.LCP == undefined && player1.visible) || (player1.LCP != undefined && player1.LCP.visible && AABB(player1.t.x+player1.t.o.x*player1.t.w, player1.t.y+player1.t.o.y*player1.t.h, player1.t.w, player1.t.h,
        player1.LCP.t.x+player1.LCP.t.o.x*player1.LCP.t.w, player1.LCP.t.y+player1.LCP.t.o.y*player1.LCP.t.h, player1.LCP.t.w, player1.LCP.t.h))) && 
        player1.t.x == player1.cp.x && player1.t.y == player1.cp.y && rCooldown !=0
    ) rCooldown -= 0.5;
    if (rCooldown != 0)
    {
        player1.t.x = player1.oldt.x = player1.cp.x;
        player1.t.y = player1.oldt.y = player1.cp.y;
        AdjustVP();
        return;
    };

    SCENE.update();

    adjustVY = false;
    player1.grounded = false;
    
    if (graceSec > 0)
        graceSec -= _DELTATIME;

    ri = false;
    le = false;

    let totalCollisions = 0;
    SCENE.collisionsWith (
        player1, (obj) => {
            totalCollisions++;
            Events(obj);
            if (obj.name == "StaminaFruit" && obj.filter == `sepia(${DashPowerUpParam.s}) hue-rotate(${obj.double?DASHH2:DASHH1}deg) saturate(${obj.double?DASHS2:DASHS1})` && dashLeft < (obj.double?2:1))
            {
                DashPowerUp(obj);
            }
            else
            if (obj.name == "checkpoint")
            {
                for (const sf of SCENE.SF)
                {
                    sf.c = I_FLAGW;
                }
                obj.c = I_FLAG;
                player1.cp = {x:obj.t.x, y:obj.t.y};
                player1.LCP = obj;
            }
            else
            if (obj.name == "Spike")
            {
                player1.die();
            }
        },
        (obj) => {
            
        },
        (obj, tsides) => {
            if (obj.trigger)
                return;


            if (tsides.l || tsides.r)
            {
                if (!onLedge)
                {
                    onLedge = true;
    
                    if (keys[JUMPKEY])
                        canLJump = false;
                    else
                        canLJump = true;
                }
                if (keyups[JUMPKEY])
                    canLJump = true;
                
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
                player1.ground = obj.parent;
                player1.friction = obj.parent.friction;
                graceSec = 0.1;
            }
        },
    );

    for (const obj of SCENE.SF)
    {
        if (AABB(
                player1.t.x+player1.t.o.x*player1.t.w, player1.t.y+player1.t.o.y*player1.t.h, player1.t.w, player1.t.h,
                obj.t.x+obj.t.o.x*obj.t.w, obj.t.y+obj.t.o.y*obj.t.h, obj.t.w, obj.t.h
            )
            && obj.filter == `sepia(${DashPowerUpParam.s}) hue-rotate(${obj.double?DASHH2:DASHH1}deg) saturate(${obj.double?DASHS2:DASHS1})` && dashLeft == 0)
        {
            DashPowerUp(obj);
        }
    }

    
    if (totalCollisions == 0)
    {
        onLedge = false;
        midMsg.innerHTML = "";
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
        if ((!dashed || (dashed && player1.v.y < 1)) && rCooldown == 0)
            player1.v.y-= dsec > 0 ? 4/(1/60)*_DELTATIME : 96/(1/60)*_DELTATIME;
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

    if (graceSec > 0 && (!onLedge || player1.grounded))
    {
        adjustVY = true;
        
        if (keys[JUMPKEY] || keys[DOWNKEY])
        {
            player1.imgT.b = 4;

            player1.t.h = ((player1.t.h-16)/1.5)*(1/60)/_DELTATIME+16;
            if ((36 - player1.t.h) > 0)
            {
                player1.t.w = Math.floor((36 - player1.t.h)+56);
            }

        }
        else if (player1.t.h != playerH)
        {
            if (keyups[JUMPKEY])
            {
                player1.v.y = ((playerH - player1.t.h)/(playerH/2)*36)**2/1.5;
                graceSec = 0;
            }

            player1.t.w = 64;
        }
    }


      //////////
     // Dash //
    //////////

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
        {
            switch (lWasd)
            {
                case LEFTKEY:
                    player1.v.x = -16384*(1/60)/_DELTATIME;
                    break;
                case RIGHTKEY:
                    player1.v.x = 16384*(1/60)/_DELTATIME;
                    break;
                case UPKEY:
                    player1.v.y = 16384*(1/60)/_DELTATIME;
                    break;
                case DOWNKEY:
                    player1.v.y = -16384*(1/60)/_DELTATIME;
                    break;
                    
            }
        }
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


    // Player color
    switch (dashLeft)
    {
        case 0:
            // Pc.h=192;
            // Pc.s=50;
            // Pc.l=100;

            player1.filter = "";
            break;  
        case 1:
            // Pc = DASHCOLOR;
            player1.filter = `sepia(1) hue-rotate(${DASHH1}deg) saturate(${DASHS1})`;
            break;
        case 2:
            player1.filter = `sepia(1) hue-rotate(${DASHH2}deg) saturate(${DASHS2})`;
            break;
    }

    lightColor = `hsl(${Pc.h}deg ${Pc.s}% ${Pc.l})`;



    // Viewport Position
    AdjustVP();


    // Restore Height
    if ((!(keys[JUMPKEY] || keys[DOWNKEY])) || (onLedge && keys[GRABKEY]))
    {
        if (player1.grounded || (onLedge && keys[GRABKEY] && !player1.grounded) || keyups[JUMPKEY])
        {
            player1.t.h += ((Math.sin(_TIME/512)*3+62)-player1.t.h)/2/(1/60)*_DELTATIME;
            player1.imgT.b = 4;
        }
        else if (dashed)
        {
            switch (true)
            {
                case Math.abs(player1.v.x) > 8192 && Math.abs(player1.v.y) > 8192:
                    player1.t.w = 60;
                    player1.t.h = 60;
                    break;
                case Math.abs(player1.v.x) > 8192:
                    player1.t.w = 72;
                    break;
                case Math.abs(player1.v.y) > 8192:
                    player1.t.h = 72;
                    break;
            }
        }
        else if (player1.v.y > 0)
        {
            player1.t.h = 72;
            player1.imgT.b = 4;
        }
        else if (player1.v.y != 0)
            player1.imgT.b = 16;
        else
            player1.imgT.b = 4;

        // player1.t.w += (-Math.sin(_TIME/512)*2+56)-player1.t.w;


        // Raycast to fit under
        if (!(keys[JUMPKEY] || keys[DOWNKEY]))
        {
            const ray = new Ray(player1.t.x + player1.t.o.x*player1.t.w+               (player1.t.w-playerW)/2+1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-4, player1.t.x + player1.t.o.x*player1.t.w+              (player1.t.w-playerW)/2+1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-64);
            const ray2 = new Ray(player1.t.x + player1.t.o.x*player1.t.w + player1.t.w-(player1.t.w-playerW)/2-1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-4, player1.t.x + player1.t.o.x*player1.t.w + player1.t.w-(player1.t.w-playerW)/2-1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-64);

            const result = [ray.cast(SCENE, player1), ray2.cast(SCENE, player1)];

            if (Math.min(result[0].dis, result[1].dis)+4 < playerH)
            {
                player1.t.h = Math.min(result[0].dis, result[1].dis)+3;
                player1.imgT.b = 4;
            }
        }
    }

    if (rCooldown != 0)
    {
        player1.v.x = player1.v.y = 0;
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

const keys   = {},
      keyups = {};

let lWasd = RIGHTKEY;

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
    if (e.code == LEFTKEY || e.code == RIGHTKEY || e.code == UPKEY || e.code == DOWNKEY)
        lWasd = e.code;
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