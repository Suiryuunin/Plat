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
    constructor(type = "none", {x,y,w,h,o}, c, collider = undefined, frameSet = 0, fps = 12, loop = true)
    {
        this.type = type;
        this.name = "nameless";
        this.id = id;
        id++;
        this.visible = true;
        this.t = {x:x,y:y,w:w,h:h,o:o};
        this.ot = {x:x,y:y,w:w,h:h,o:o};
        this.c = c;
        this.outc = OUTLINECOLOR;
        this.oc = c;
        this.ooutc = this.outc;
        
        this.filter = "";

        this.ro = {x:0,y:0};
        this.hovering = false;
        this.visible = true;
        this.active = true;
        this.imgT = {l:0,r:0,t:0,b:0};

        if (collider)
        {
            this.hitbox = collider;
            this.hitbox.t = this.t;
        }

        this.flip = {x:1,y:1};
        this.r = 0;
        this.alpha = 1;

        this.center = {x:this.t.x + this.t.w*this.t.o.x + this.t.w/2, y:this.t.y + this.t.h*this.t.o.y + this.t.h/2};

        this.frameSet = frameSet;
        this.fps = fps;

        this.creationTime = _TIME;

        this.loop = loop;
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

    drawIMG(ctx = currentCtx)
    {
        let tt = {
            x:this.t.x-VP.x,
            y:this.t.y-VP.y,
            w:this.t.w,
            h:this.t.h,
            o:this.t.o
        };
        ctx.filter = this.filter;
        rr.drawImg(ctx, tt, this.imgT, this.c, this.alpha, this.r, this.flip.x, this.flip.y);
        ctx.filter = "none";
    }

    render(ctx = currentCtx)
    {
        switch(this.type)
        {
            case "rect":
            {
                let tt = {
                    x:this.t.x-VP.x,
                    y:this.t.y-VP.y,
                    w:this.t.w,
                    h:this.t.h,
                    o:this.t.o
                };
                rr.drawRect(ctx, tt, this.c, this.alpha, "fillborder", 1, this.outc);
                break;
            }

            case "circle":
            {
                let tc = {
                    x:this.center.x-VP.x,
                    y:this.center.y-VP.y
                };
                rr.drawCircle(ctx, tc, this.t.w / 2, this.c, this.alpha);
                break;
            }
            
            case "ani":
            {
                this.c = this.frameSet[Math.floor(((_TIME-this.creationTime) % (1000/this.fps*this.frameSet.length)) / (1000/this.fps))];
                this.drawIMG(ctx);
                break;

            }

            case "img":
            {
                this.drawIMG(ctx);
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
    constructor(type, {x,y,w,h,o}, c, collider = undefined, frameSet = undefined, fps = 0)
    {
        super(type, {x,y,w,h,o}, c, collider, frameSet, fps)
        
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
        if (this.hitbox)
            this.hitbox.parent = this;
        this.setOldTransform();

        if (Math.abs(this.v.x) > 8192 && Math.abs(this.v.y) > 8192)
        {
            // switch (true)
            // {
            //     case this.v.x > 0 && this.v.y > 0:
            //     {
            //         const ray = new Ray(player1.t.x + player1.t.o.x*player1.t.w+               (player1.t.w-playerW)/2+1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-4, player1.t.x + player1.t.o.x*player1.t.w+              (player1.t.w-playerW)/2+1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-64);
            //         // const ray2 = new Ray(player1.t.x + player1.t.o.x*player1.t.w + player1.t.w-(player1.t.w-playerW)/2-1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-4, player1.t.x + player1.t.o.x*player1.t.w + player1.t.w-(player1.t.w-playerW)/2-1, player1.t.y+player1.t.o.y*player1.t.h+player1.t.h-64);
            //         if (Math.min(ray.cast(SCENE, player1).dis, ray2.cast(SCENE, player1).dis)+4 < playerH)
            //         {
                        
            //         }
                    
            //         break;
            //     }
            //     case this.v.x > 0 && this.v.y < 0:
            //     {
            //         break;
            //     }
            //     case this.v.x < 0 && this.v.y > 0:
            //     {
            //         break;
            //     }
            //     case this.v.x < 0 && this.v.y < 0:
            //     {
            //         break;
            //     }
            // }

            const ray = new Ray(
                (player1.t.x+player1.t.o.x*player1.t.w)+player1.t.w/2,
                (player1.t.y+player1.t.o.y*player1.t.h)+player1.t.h/2,
                (player1.t.x+player1.t.o.x*player1.t.w)+player1.t.w/2 + this.v.x*_DELTATIME,
                (player1.t.y+player1.t.o.y*player1.t.h)+player1.t.h/2 - this.v.y*_DELTATIME
            );

            const result = ray.cast(SCENE, player1);

            if (result.dis < Math.sqrt((this.v.x*_DELTATIME)**2 + (this.v.y*_DELTATIME)**2))
            {
                point.t.x = result.hit.x;
                switch (result.hit.side)
                {
                    case "l":
                    {
                        player1.t.x = result.hit.x-(player1.t.w/2)-(player1.t.w*player1.t.o.x);
                        player1.t.y = result.hit.y-((player1.t.h/2)/(-player1.v.x)*player1.v.y);
                        point.t.y = result.hit.y;
                        break;
                    }
                    case "r":
                    {
                        player1.t.x = result.hit.x-(player1.t.w/2)-(player1.t.w*player1.t.o.x);
                        player1.t.y = result.hit.y+((player1.t.h/2)/(-player1.v.x)*player1.v.y);
                        point.t.y = result.hit.y;
                        break;
                    }
                    case "t":
                    {
                        player1.t.x = result.hit.x+((player1.t.w/2)/(player1.v.y)*-player1.v.x);
                        player1.t.y = result.hit.y-(player1.t.h/2)-(player1.t.h*player1.t.o.y);
                        point.t.y = result.hit.y;
                        break;
                    }
                    case "b":
                    {
                        player1.t.x = result.hit.x+((player1.t.w/2)/(player1.v.y)*-player1.v.x);
                        player1.t.y = result.hit.y-(player1.t.h/2)-(player1.t.h*player1.t.o.y);
                        point.t.y = result.hit.y;
                        break;
                    }
                }
            }
            else
            {
                this.t.x += this.v.x * _DELTATIME;
                this.t.y -= this.v.y * _DELTATIME;
            }
        }
        else
        {
            this.t.x += this.v.x * _DELTATIME;
            this.t.y -= this.v.y * _DELTATIME;
        }

        this.center = {x:this.t.x + this.t.w*this.t.o.x + this.t.w/2, y:this.t.y + this.t.h*this.t.o.y + this.t.h/2};
        if (this.hitbox)
            this.hitbox.updateTransform();

        if (this.updateMore != undefined)
            this.updateMore();
    }

    collideWith(target, rR = undefined, rRR = undefined)
    {
        if (this.hitbox.isCollidingWith(target.hitbox, rR, rRR))
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