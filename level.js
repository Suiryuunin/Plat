let OUTLINECOLOR = "white";
let OCrgb = {
    r:255,
    g:255,
    b:255
};
let BGCOLOR = "black";


const playerW = 64;
const playerH = 64;
const playerMH = 58;
// const player1 = new Dynamic("rect", {x:128*1.5,y:128*5,w:playerW,h:playerH, o: {x:-0.5,y:-1}}, A_PLAYER[0], new RectCollider(), A_PLAYER, 16);
const player1 = new Dynamic("rect", {x:128*22.5, y:128*3.5,w:playerW,h:playerH, o: {x:-0.5,y:-1}}, A_PLAYER[0], new RectCollider(), A_PLAYER, 16);
player1.name = "player";
player1.type = "ani";
player1.imgT = {l:4,r:4,t:4,b:4};
player1.friction = 128;
player1.LCP = undefined;
player1.cp = {x:player1.t.x, y:player1.t.y};
player1.deaths=0;
const reEl = document.getElementById("restarts");
reEl.innerHTML = "Restart Count: " + player1.deaths;

player1.die = () => {
    dashLeft = 0;
    player1.v.x = player1.v.y = 0;
    player1.t.x = player1.cp.x;
    player1.t.y = player1.cp.y;
    player1.oldt = {
        x:player1.t.x,
        y:player1.t.y,
        w:player1.t.w,
        h:player1.t.h,
        o:player1.t.o,
    };
    rCooldown = 1;
    player1.deaths++;
    reEl.innerHTML = "Restart Count: " + player1.deaths;
};

const DashPowerUpParam = {
    s:1,
    l:1
};
const DashPowerDownParam = {
    s:0,
    l:2
};

// Dash Hue
const DASHH1 = 135;
const DASHH2 = 0;

const DASHS1 = 4;
const DASHS2 = 4;
const DASHLS1 = 2;
const DASHLS2 = 2;

const p = [];
const s = [];
for (let i = 0; i < 18; i++)
{
    s.push(new VerticalSpike(0, 128*(4-i)))
}
s.push(new VerticalSpike(0, 128*4))

for (let i = 0; i < 20; i++)
{
    p.push(new HorizontalPlat(128*i, 128*5, (i==0 ? _PLATFORML : (i == 19 ? _PLATFORMR : _PLATFORMC))));
}

p.push(new VerticalPlat(128*4+64, 128*4,_WALLB), new VerticalPlat(128*4+64, 128*3,_WALLT));
p.push(new VerticalPlat(128*5+96, 128*3,_WALLB), new VerticalPlat(128*5+96, 128*2,_WALLC), new VerticalPlat(128*5+96, 128,_WALLC), new VerticalPlat(128*5+96, 0,_WALLT));
p.push(new VerticalPlat(128*7, 128*4,_WALLB), new VerticalPlat(128*7, 128*3,_WALLC), new VerticalPlat(128*7, 128*2,_WALLC), new VerticalPlat(128*7, 128,_WALLC));

p.push(new HorizontalPlat(128*7, 64, _PLATFORML), new HorizontalPlat(128*8, 64, _PLATFORMR), new HorizontalPlat(128*9, 128*2, _BLOCKALL), new HorizontalPlat(128*10, 128*3.5, _BLOCKALL));

const SF = [];
SF.push(new DashOrb(128*13.5,128*4.5), new DashOrb(128*17.5,128));

p.push(new VerticalPlat(128*19, 128, _WALLC),new VerticalPlat(128*19, 128*2, _WALLC),new VerticalPlat(128*19, 128*3, _WALLC),new VerticalPlat(128*19, 128*4, _WALLC));
p.push(new HorizontalPlat(128*19, 64, _PLATFORML),new HorizontalPlat(128*20, 64, _PLATFORMR), new HorizontalPlat(128*21, 128*2, _BLOCKALL), new HorizontalPlat(128*22, 128*3.5, _BLOCKALL));

for (let i = 0; i < 20; i++)
{
    s.push(new HorizontalSpike(128*(i+20), 128*5.5));
}

SF.push(new DashOrb(128*26,128*3.25));
p.push(new HorizontalPlat(128*29, 128*3.5, _PLATFORML),new HorizontalPlat(128*30, 128*3.5, _PLATFORMR));
SF.push(new DashOrbII(128*33.5,128*4));

p.push(new VerticalPlat(128*35, 128*2, _WALLB), new VerticalPlat(128*35, 128*1, _WALLC), new VerticalPlat(128*35, 128*0, _WALLC), new VerticalPlat(128*35, 128*-1, _WALLC), new VerticalPlat(128*35, 128*-2, _WALLT));
p.push(new VerticalPlat(128*33, 128*-1, _WALLB), new VerticalPlat(128*33, 128*-2, _WALLC), new VerticalPlat(128*33, 128*-3, _WALLC), new VerticalPlat(128*33, 128*-4, _WALLT));
const final = [new HorizontalPlat(128*35, 128*-2.5, _PLATFORML),new HorizontalPlat(128*36, 128*-2.5, _PLATFORMR)];




// Checkpoint
const cp = []
cp.push(new Checkpoint(128*22.5, 128*3.5));

const SSF = new DashOrbII(128*8.5,128*4.5);


const point = new Dynamic("circle", {x:8,y:8,     w:8,h:8, o: {x:-.5,y:-.5}}, "yellow");
SCENE.el.push(...SCENE.PLAT, ...SCENE.SPIKES, player1, ...SCENE.CP, ...SCENE.SF, ...SCENE.SSF);


window.addEventListener('keyup', (e)=>{
    if (e.code == "KeyH")
        player1.die();
});

// SCENE.el.push(new Word({x:128,y:128*3,h:64,o:{x:0,y:0}}, ["WASD to Move", "K to Jump"], "red"));