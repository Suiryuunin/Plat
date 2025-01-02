const res = {w:1920, h:1080};


//Collision preset
const _NOCOLLISION = {l:false, r:false, t:false, b:false};
const _BLOCKALL = {l:true, r:true, t:true, b:true};
const _PLATFORMC = {l:false, r:false, t:true, b:true};
const _PLATFORMR = {l:false, r:true, t:true, b:true};
const _PLATFORML = {l:true, r:false, t:true, b:true};
const _PLATFORM = {l:false, r:false, t:true, b:false};
const _WALLC = {l:true, r:true, t:false, b:false};
const _WALLT = {l:true, r:true, t:true, b:false};
const _WALLB = {l:true, r:true, t:false, b:true};

// Wall size
const ws = {w:64, h:128};
const fs = {w:128, h:32};
const fs2 = {w:128, h:24};

const _GRAVITY = -1.2;
const _VCENTER = {x: Math.floor(res.w/2), y: Math.floor(res.h/2)};
const _NOOFFSET = {x:0,y:0};
const _CENTEROFFSET = {x:-0.5,y:-0.5};