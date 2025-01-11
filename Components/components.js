class Checkpoint extends Dynamic
{
    constructor({x,y})
    {
        super("rect", {x,y,w:48,h:96, o:{x:-0.5,y:-1}}, "hotpink", new RectCollider());
        this.hitbox.trigger = true;
        this.name = "checkpoint";
    } 
}