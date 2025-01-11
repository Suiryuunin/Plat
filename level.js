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
const player1 = new Dynamic("rect", {x:64,y:1080/2-64,w:playerW,h:playerH, o: {x:-0.5,y:-1}}, A_PLAYER[0], new RectCollider(), A_PLAYER, 16);
player1.name = "player";
player1.type = "ani";
player1.imgT = {l:4,r:4,t:4,b:4};
player1.friction = 128;
player1.LCP = undefined;
player1.cp = {x:player1.t.x, y:player1.t.y};

player1.die = () => {
    dashLeft = 0;
    player1.v.x = player1.v.y = 0;
    player1.t.x = player1.cp.x;
    player1.t.y = player1.cp.y;
    rCooldoown = 1;
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

const pad2 = new Dynamic("rect", {x:1920-64,y:1080/2-64,w:32,h:128, o: {x:-1,y:0}}, BGCOLOR, new RectCollider());

const EDGEL = new Dynamic("rect", {x:8,    y:0, w:4,h:1080, o: {x:-1,y:0}},  BGCOLOR, new RectCollider());
const EDGER = new Dynamic("rect", {x:1920-8,y:0,w:4,h:1080, o: {x:0,y:0}}, BGCOLOR, new RectCollider());
const EDGET = new Dynamic("rect", {x:0,y:8,     w:1920,h:4, o: {x:0,y:-1}},  BGCOLOR, new RectCollider());
const EDGEB = new Dynamic("rect", {x:0,y:1080-8,w:1920,h:4, o: {x:0,y:0}}, BGCOLOR, new RectCollider());

const PLAT = new Dynamic("rect", {x:0,y:1080-256,w:256,h:4, o: {x:0,y:0}}, BGCOLOR, new RectCollider());
PLAT.hitbox.sides = _PLATFORM;
EDGEB.friction = 128;

const crouchWall = new Dynamic("rect", {x:256,y:1080-12-16-5,     w:128,h:512, o: {x:0,y:-1}}, BGCOLOR, new RectCollider());
const crouchWall2 = new Dynamic("rect", {x:1024,y:1080-12-16-5-16,     w:128,h:256, o: {x:0,y:-1}}, BGCOLOR, new RectCollider());
const point = new Dynamic("circle", {x:8,y:8,     w:8,h:8, o: {x:-.5,y:-.5}}, "yellow");

const SF = new DashOrb(1024+256-256,1080-512);
const SSF = new DashOrbII(1024+256-128,1080-512);

SCENE.init(player1);
SCENE.addBulk([point,EDGEL,EDGER, EDGEB, EDGET, crouchWall, crouchWall2, PLAT]);








// Checkpoint
const cp = new Checkpoint(128,1080-12-16-5);

SCENE.CP.push(cp);

SCENE.addBulk(SCENE.CP)


window.addEventListener('keyup', (e)=>{
    if (e.code == "KeyH")
        player1.die();
});


SCENE.addBulk([...SCENE.SF, ...SCENE.SSF]);