const res = {w:1280, h:720};


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


 /////////////
 // IMAGES //
////////////

function AssignAniFrames(arr, prefix, suffix)
{
    for (let i = 0; i<arr.length; i++)
    {
        arr[i].src = prefix+i+suffix;
    }
}

const I_HPLAT = new Image(128,128);
I_HPLAT.src = "Assets/Textures/HPlat.png";
const I_VPLAT = new Image(128,128);
I_VPLAT.src = "Assets/Textures/VPlat.png";
const I_HSPIKE = new Image(128,128);
I_HSPIKE.src = "Assets/Textures/HSpike.png";
const I_VSPIKE = new Image(128,128);
I_VSPIKE.src = "Assets/Textures/VSpike.png";
const I_FLAG = new Image(128,128);
I_FLAG.src = "Assets/Textures/Flag.png";
const I_FLAGW = new Image(128,128);
I_FLAGW.src = "Assets/Textures/FlagW.png";


const A_PLAYER = [new Image(128,128),new Image(128,128),new Image(128,128)];
AssignAniFrames(A_PLAYER, "Assets/Textures/Player/p000", ".png");
const A_DASHP = [new Image(128,128),new Image(128,128),new Image(128,128)];
AssignAniFrames(A_DASHP, "Assets/Textures/DashP/frame000", ".png");