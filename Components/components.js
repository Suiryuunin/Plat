class Checkpoint extends Dynamic
{
    constructor(x,y)
    {
        super("img", {x,y,w:48,h:96, o:{x:-0.5,y:-1}}, I_FLAGW, new RectCollider());
        this.hitbox.trigger = true;
        this.name = "checkpoint";
        SCENE.CP.push(this);
        this.imgT = {l:4,r:4,t:4,b:4};
    }
}

class DashOrb extends Dynamic
{
    constructor(x,y)
    {
        super("ani", {x,y, w:64,h:64, o: {x:-0.5,y:-0.5}}, A_DASHP[0], new RectCollider(), A_DASHP, 16);

        this.name = "StaminaFruit";
        this.hitbox.trigger = true;
        this.s=1;
        this.filter = `sepia(${DashPowerUpParam.s}) hue-rotate(${this.double?DASHH2:DASHH1}deg) saturate(${this.double?DASHS2:DASHS1})`;
        SCENE.SF.push(this);
    }
}

class DashOrbII extends DashOrb
{
    constructor(x,y)
    {
        super(x,y);

        this.double = true;
        SCENE.SSF.push(this);
    }
}

class HorizontalPlat extends Dynamic
{
    constructor(x,y, sides = _BLOCKALL)
    {
        super("img", {x,y, w:128,h:64, o: {x:0,y:0}}, I_HPLAT, new RectCollider());
        this.name = "HPlat";
        this.hitbox.sides = sides;
        SCENE.PLAT.push(this);
        this.imgT = {l:4,r:4,t:4,b:4};
    }
}
class VerticalPlat extends Dynamic
{
    constructor(x,y, sides = _BLOCKALL)
    {
        super("img", {x,y, w:64,h:128, o: {x:0,y:0}}, I_VPLAT, new RectCollider());
        this.name = "VPlat";
        this.hitbox.sides = sides;
        SCENE.PLAT.push(this);
        this.imgT = {l:4,r:4,t:4,b:4};
    }
}

class HorizontalSpike extends HorizontalPlat
{
    constructor(x,y)
    {
        super(x,y);
        this.name = "Spike";
        this.c = I_HSPIKE;
        SCENE.SPIKES.push(this);
    }
}
class VerticalSpike extends VerticalPlat
{
    constructor(x,y)
    {
        super(x,y);
        this.name = "Spike";
        this.c = I_VSPIKE;
        SCENE.SPIKES.push(this);
    }
}