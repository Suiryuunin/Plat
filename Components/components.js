class Checkpoint extends Dynamic
{
    constructor(x,y)
    {
        super("rect", {x,y,w:48,h:96, o:{x:-0.5,y:-1}}, "hotpink", new RectCollider());
        this.hitbox.trigger = true;
        this.name = "checkpoint";
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