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
EDGEB.friction = 128;

const crouchWall = new Dynamic("rect", {x:256,y:res.h-12-16-5,     w:128,h:512, o: {x:0,y:-1}}, "black", new RectCollider());
const crouchWall2 = new Dynamic("rect", {x:1024,y:res.h-12-16-5-16,     w:128,h:128, o: {x:0,y:-1}}, "black", new RectCollider());
const point = new Dynamic("circle", {x:8,y:8,     w:8,h:8, o: {x:-.5,y:-.5}}, "yellow");

SCENE.init(player1);
SCENE.addBulk([point,EDGEL,EDGER, EDGEB, EDGET, crouchWall, crouchWall2, PLAT]);