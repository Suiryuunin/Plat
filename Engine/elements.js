let id = 0;

class Word
{
    constructor({x,y,h,o}, word = "", c, collision = _NOCOLLISION)
    {
        this.word = word;
        this.id = id;
        id++;
        this.t = {x:x,y:y,h:h,o:o};
        this.ot = {x:x,y:y,h:h,o:o};
        this.c = c;
        this.oc = c;
        
        this.visible = true;
        this.active = true;
        this.collision = collision;
        
        this.alpha = 1;

        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
    }

    update()
    {}

    updateCollision({l,r,t,b})
    {
        return {l,r,t,b};
    }

    render(ctx = currentCtx)
    {
        rr.drawWord(ctx, [this.word], this.t.x, this.t.y, this.t.o, false, this.t.h, this.c, this.alpha,this.t.h);
    }
}

class StaticObject
{
    constructor(type = "none", {x,y,w,h,o}, c, collider = undefined, initFrame = 0, delay = 1, loop = true)
    {
        this.type = type;
        this.name = "nameless";
        this.id = id;
        id++;
        this.t = {x:x,y:y,w:w,h:h,o:o};
        this.ot = {x:x,y:y,w:w,h:h,o:o};
        this.c = c;
        this.oc = c;
        this.red = 255;
        this.ro = {x:0,y:0};
        this.hovering = false;
        this.visible = true;
        this.active = true;

        if (collider)
        {
            this.hitbox = collider;
            this.hitbox.t = this.t;
        }

        this.flip = {x:1,y:1};
        this.r = 0;
        this.alpha = 1;

        this.center = {x:this.t.x + this.t.w*this.t.o.x + this.t.w/2, y:this.t.y + this.t.h*this.t.o.y + this.t.h/2};

        if (this.type == "ani")
        {
            this.frameSet = [];
            for (const f of this.c)
            {
                const TEMPIMG = new Image();
                TEMPIMG.src = f;
                this.frameSet.push(TEMPIMG);
            }
            this.frame = initFrame;
        }
        this.delay = delay;
        this.delayC = 0;

        this.loop = loop;
    }

    updateFrameSet(frames)
    {
        this.frameSet = [];

        for (const f of frames)
        {
            const TEMPIMG = new Image();
            TEMPIMG.src = f;
            this.frameSet.push(f);
        }
        this.frame = 0;
    }
    
    

    update()
    {
        if (this.hitbox)
        {
            this.hitbox.t = this.t;
        }
        if (this.updateMore != undefined)
            this.updateMore();
    }

    render(ctx = currentCtx)
    {
        switch(this.type)
        {
            case "rect":
            {
                rr.drawRect(ctx, this.t, this.c, this.alpha);
                break;
            }

            case "circle":
            {
                rr.drawCircle(ctx, this.center, this.t.w / 2, this.c, this.alpha);
                break;
            }

            case "img":
            {
                rr.drawImg(ctx, this.t, this.c, this.alpha, this.r, this.flip.x, this.flip.y);
                break;
            }

            case "ani":
            {
                const transform =
                {
                    x:this.t.x+this.ro.x,
                    y:this.t.y+this.ro.y,
                    w:this.t.w,
                    h:this.t.h,
                    o:this.t.o
                }
                rr.drawImg(ctx, transform, this.frameSet[this.frame], this.alpha, this.r, this.flip.x, this.flip.y);
                this.delayC++;
                if (this.delayC >= this.delay*_DELTATIME)
                {
                    if (this.loop)
                        this.frame = (this.frame+1)%this.frameSet.length;
                    else if (this.frame != this.frameSet.length-1)
                        this.frame++;
                    this.delayC = 0;
                }
                break;
            }

            default:
                console.log("INVALID TYPE!");
        }
        if (this.renderMore != undefined)
            this.renderMore();
    }

    // isCollidingWith({x,y,w,h,o})
    // {
    //     const _x = this.t.x+this.t.w*this.t.o.x;
    //     const _y = this.t.y+this.t.h*this.t.o.y;
    //     const __x = x + w * o.x;
    //     const __y = y + h * o.y;
    //     return (
    //         _x+this.t.w >= __x &&
    //         _x <= __x+w &&
    //         _y+this.t.h >= __y &&
    //         _y <= __y+h
    //     );
    // }

    // isOCollidingWith({x,y,w,h,o})
    // {
    //     const _x = this.ot.x+this.ot.w*this.ot.o.x;
    //     const _y = this.ot.y+this.ot.h*this.ot.o.y;
    //     const __x = x + w * o.x;
    //     const __y = y + h * o.y;
    //     return (
    //         _x+this.ot.w >= __x &&
    //         _x <= __x+w &&
    //         _y+this.ot.h >= __y &&
    //         _y <= __y+h
    //     );
    // }
}

class Box extends StaticObject
{
    constructor({x,y,w,h,o}, c, collider, flipX = 1)
    {
        super("color", {x,y,w,h,o}, c, collider);
        this.flip.x = flipX;
    }
}

class Img extends StaticObject
{
    constructor({x,y,w,h,o}, c, collider, flipX = 1)
    {
        super("img", {x,y,w,h,o}, c, collider);
        this.flip.x = flipX;
    }
}

class Dynamic extends StaticObject
{
    constructor(type, {x,y,w,h,o}, c, collider = undefined)
    {
        super(type, {x,y,w,h,o}, c, collider)
        
        this.dynamic = true;
        this.direction = {x:0,y:0};
        this.v = {x:0, y:0};
        this.oldt = {};
        this.oldcenter = {};
    }

    setOldTransform()
    {
        this.oldt.x = this.t.x;
        this.oldt.y = this.t.y;
        this.oldt.w = this.t.w;
        this.oldt.h = this.t.h;
        this.oldt.o = this.t.o;
        this.oldcenter = {x:this.oldt.x + this.oldt.w*this.oldt.o.x + this.oldt.w/2, y:this.oldt.y + this.oldt.h*this.oldt.o.y + this.oldt.h/2};

        if (this.hitbox)
            this.hitbox.updateOldTransform();
    }

    moveTo({x,y})
    {
        this.t.x = x;
        this.t.y = y;
    }
    moveBy({x,y}, d=1)
    {
        this.t.x += x*d;
        this.t.y += y*d;
    }
    moveTowards({x,y}, d)
    {
        this.t.x += Math.round((x-this.t.x)*d);
        this.t.y += Math.round((y-this.t.y)*d);
    }
    setDirectionTo({x,y})
    {
        x -= this.t.x;
        y -= this.t.y;
        const m = Math.sqrt(x**2+y**2);
        this.direction = {x:x/m, y:y/m};
    }

    translateBy({x,y})
    {
        this.t.x += x;
        this.t.y += y;
    }

    scaleTo({w,h})
    {
        this.t.w = w;
        this.t.h = h;
    }

    scaleBy(s)
    {
        this.t.w *= s;
        this.t.h *= s;
    }

    update()
    {
        // *special for pong
        if (this.red > 255) this.red = 255;
        this.c = `#ff${(this.red*1).toString(16).length < 2 ? "0"+(this.red*1).toString(16) : (this.red*1).toString(16)}${(this.red*1).toString(16).length < 2 ? "0"+(this.red*1).toString(16) : (this.red*1).toString(16)}`;
        if (this.red < 255) this.red+=Math.round(8/(1/30)*_DELTATIME);

        if (this.hitbox)
            this.hitbox.parent = this;
        this.setOldTransform();
        
        this.t.y -= this.v.y * _DELTATIME;
        this.t.x += this.v.x * _DELTATIME;

        this.center = {x:this.t.x + this.t.w*this.t.o.x + this.t.w/2, y:this.t.y + this.t.h*this.t.o.y + this.t.h/2};
        if (this.hitbox)
            this.hitbox.updateTransform();

        if (this.updateMore != undefined)
            this.updateMore();
    }

    collideWith(target, rR = undefined, rRR = undefined)
    {
        if (this.hitbox.isCollidingWith(target.hitbox, {l:false, r:false, t:false, b:false}, rR, rRR))
        {
            this.t.x = this.hitbox.t.x;
            this.t.y = this.hitbox.t.y;
            this.center = {x:this.t.x + this.t.w*this.t.o.x + this.t.w/2, y:this.t.y + this.t.h*this.t.o.y + this.t.h/2};
            return true;
        }
        return false;
    }

    


    
}

class Physics extends Dynamic
{
    constructor(type, {x,y,w,h,o}, c, collision = _BLOCKALL)
    {
        super(type, {x,y,w,h,o}, c, collision)

        this.maxV = {x:12, y: Infinity};
        this.grounded = false;
        this.gravityMultiplier = 1;
    }

    update()
    {
        this.setOldTransform();
        if (!this.grounded)
            this.v.y += _GRAVITY*this.gravityMultiplier;
        this.t.y -= this.v.y;
        this.t.x += this.v.x;

        if (this.updateMore != undefined)
            this.updateMore();
    }
}