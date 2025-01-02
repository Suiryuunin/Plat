"use strict"

class RectCollider
{
    constructor(t = {x:0,y:0,w:0,h:0, o: {x:0,y:0}}, sides = _BLOCKALL)
    {
        this.parent = 0;
        this.t = t;
        this.oldt = t;
        this.sides = sides;
        this.type = "rect";
        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
        this.oldcenter = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};

        this.reposition = true;
    }

    repositionR({x,y,w,h,o}, {l,r,t,b})
    {
        switch(true)
        {
            case this.parent.v.x < 0 && l:
            {
                this.t.x = (x+w+w*o.x)-this.t.w*this.t.o.x;

                return;
            }
            case this.parent.v.x > 0 && r:
            {
                this.parent.t.x = (x+w*o.x)-this.t.w - this.t.w*this.t.o.x;

                return;
            }

            case this.parent.v.y < 0 && b:
            {
                this.t.y = (y+h*o.y)-this.t.h - this.t.h*this.t.o.y;

                return;
            }
            case this.parent.v.y > 0 && t:
            {
                this.t.y = (y+h+h*o.y)-this.t.h*this.t.o.y;

                return;
            }
        }
    }
    repositionC(target)
    {
        const cx = target.center.x, cy = target.center.y;
        const r = target.t.w/2;

        const left = this.t.x + this.t.w*this.t.o.x;
        const right = this.t.x + this.t.w + this.t.w*this.t.o.x;
        const top = this.t.y + this.t.h*this.t.o.y;
        const bottom = this.t.y + this.t.h + this.t.h*this.t.o.y;

        switch(true)
        {
            case (this.parent.v.x != 0 && top <= cy && bottom >= cy):
            {
                this.repositionR(target.t);
                return;
            }
            case (this.parent.v.y != 0 && left <= cx && right >= cx):
            {
                this.repositionR(target.t);
                return;
            }
        }

        let vx = false;
        let vy = false;
        switch(true)
        {
            case this.parent.v.x < 0:
            {
                vx = -1;

                break;
            }
            case this.parent.v.x > 0:
            {
                vx = 1;

                break;
            }
        }

        switch(true)
        {
            case this.parent.v.y < 0:
            {
                vy = -1;

                break;
            }
            case this.parent.v.y > 0:
            {
                vy = 1;

                break;
            }
        }

        if (vx != false && vy != false)
        {
            // todo

            return;
        }
        if (vx != false)
        {
            switch(true)
            {
                case top >= cy:
                {
                    point.t.x = Math.sqrt((r)**2-(top-cy)**2)*-vx + cx;
                    point.t.y = top;
                    this.t.x = Math.sqrt((r)**2-(top-cy)**2)*-vx + cx - (this.t.w)*(vx == 1 ? 1 : 0) - this.t.w*this.t.o.x;
                    return;
                }
                case bottom <= cy:
                {
                    point.t.x = Math.sqrt((r)**2-(bottom-cy)**2)*-vx + cx;
                    point.t.y = bottom;
                    this.t.x = Math.sqrt((r)**2-(bottom-cy)**2)*-vx + cx - (this.t.w )*(vx == 1 ? 1 : 0) - this.t.w*this.t.o.x;
                    return;
                }
            }
        }
        if (vy != false)
        {
            switch(true)
            {
                case left >= cx:
                {
                    point.t.x = left;
                    point.t.y = Math.sqrt((r)**2-(left-cx)**2)*vy + cy;
                    this.t.y = Math.sqrt((r)**2-(left-cx)**2)*vy + cy - (this.t.h)*(vy == -1 ? 1 : 0) - this.t.h*this.t.o.y;
                    return;
                }
                case right <= cx:
                {
                    point.t.x = right;
                    point.t.y = Math.sqrt((r)**2-(right-cx)**2)*vy + cy;
                    this.t.y = Math.sqrt((r)**2-(right-cx)**2)*vy + cy - (this.t.h)*(vy == -1 ? 1 : 0) - this.t.h*this.t.o.y;
                    return;
                }
            }
        }
    }

    RRCollision(target, {l,r,t,b})
    {
        if (this.sides.r && !l)
            l = this.collideLeft(target.t);
        if (this.sides.l && !r)
            r = this.collideRight(target.t);
        if (this.sides.b && !t)
            t = this.collideTop(target.t);
        if (this.sides.t && !b)
            b = this.collideBottom(target.t);

        return {l:l,r:r,t:t,b:b};
    }

    compileSides({l,r,t,b})
    {
        return (l+r+t+b) > 0;
    }

    isCollidingWith(target, {l,r,t,b} = {l:false,r:false,t:false,f:false}, rR = undefined, rRR = undefined)
    {
        if (target != undefined)
        {
            if (target.type == "rect")
            {
                let tsides = {};
                if (this.sides != _NOCOLLISION && this.compileSides(tsides = this.RRCollision(target, {l,r,t,b})))
                {
                    if (target.reposition) this.repositionR(target.t, tsides);
                    if (rRR != undefined) rRR(target, tsides);
                    return true;
                }
                return false;
            }
            if (target.type == "circle")
            {
                if (this.sides != _NOCOLLISION && this.compileSides(this.rectCircle(target, this.sides)))
                {
                    if (target.reposition) this.repositionC(target);
                    return true;
                }
                return false;
            }
        }
    }

    areSidesCollidingWith(target, {l,r,t,b} = {l:false,r:false,t:false,f:false})
    {
        if (target != undefined)
        {
            if (target.type == "rect")
            {
                if (this.sides != _NOCOLLISION)
                    return this.RRCollision(target, {l,r,t,b});
                return false;
            }
            if (target.type == "circle")
            {
                if (this.sides != _NOCOLLISION)
                    return this.rectCircle(target, this.sides);
                return false;
            }
        }
    }

    collideTop({x,y,w,h,o})
    {
        const _o = this.t.h * this.t.o.y;
        const _x = this.t.x + this.t.w * this.t.o.x, _y = this.t.y + _o;
        const oldy = this.oldt.y + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x+this.t.w >= __x   &&
            _x          <= __x+w &&
            _y          <= __y+h &&
            oldy        >= __y+h)
            return true;
        
        return false;
    }
    collideBottom({x,y,w,h,o})
    {
        const _o = this.t.h * this.t.o.y;
        const _x = this.t.x + this.t.w * this.t.o.x, _y = this.t.y + _o;
        const oldy = this.oldt.y + _o;
        const __x = x + w * o.x, __y = y + h * o.y;
        
        if (_x+this.t.w   >= __x   &&
            _x            <= __x+w &&
            _y+this.t.h   >= __y   &&
            oldy+this.t.h <= __y)
            return true;
        
        if (this.grounded != undefined)
            this.grounded = false;
        return false;
    }
    collideLeft({x,y,w,h,o})
    {
        const _o = this.t.w * this.t.o.x;
        const _x = this.t.x + _o, _y = this.t.y + this.t.h * this.t.o.y;
        const oldx = this.oldt.x + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x          <= __x+w &&
            oldx        >= __x+w &&
            _y+this.t.h >= __y   &&
            _y          <= __y+h)
            return true;
        
        return false;
    }
    collideRight({x,y,w,h,o})
    {
        const _o = this.t.w * this.t.o.x;
        const _x = this.t.x + _o, _y = this.t.y + this.t.h * this.t.o.y;
        const oldx = this.oldt.x + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x+this.t.w   >= __x   &&
            oldx+this.t.w <= __x   &&
            _y+this.t.h   >= __y   &&
            _y            <= __y+h)
            return true;
        
        return false;
    }

    rectCircle(target)
    {
        const rx = this.t.x + this.t.w * this.t.o.x, ry = this.t.y + this.t.h * this.t.o.y;

        const cx = target.center.x, cy = target.center.y;
        
        let testX = cx;
        let testY = cy;

        let l = false,r = false,t = false,b = false;
      
        // which edge is closest?
        if (cx < rx)               {testX = rx; l = true}    // test left edge
        else if (cx > rx+this.t.w) {testX = rx+this.t.w; r = true}   // right edge
        if (cy < ry)               {testY = ry; t = true;}    // top edge
        else if (cy > ry+this.t.h) {testY = ry+this.t.h; b = true}   // bottom edge
      
        // get distance from closest edges
        const distX = cx-testX;
        const distY = cy-testY;
        const distance = Math.sqrt(distX**2+distY**2);
      
        // if the distance is less than the radius, collision!
        if (distance <= target.t.w/2)
            return {l,r,t,b};

        return false;
    }

    setTransform(t)
    {
        this.t = t;
    }

    updateTransform()
    {
        this.t = this.parent.t;
        this.center = this.parent.center;
    }

    updateOldTransform()
    {
        this.oldt = this.parent.oldt;
        this.oldcenter = this.parent.oldcenter;
    }
}




















class CircleCollider
{
    constructor(t = {x:0,y:0,w:0,h:0, o: {x:0,y:0}})
    {
        this.parent = 0;
        this.t = t;
        this.oldt = t;

        this.type = "circle";
        this.center = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
        this.oldcenter = {x:this.t.x - this.t.w*this.t.o.x - this.t.w/2, y:this.t.y- this.t.h*this.t.o.y - this.t.h/2};
        this.LineChecked = 0;
        this.blacklisted = {};
        this.reposition = true;
    }

    collideTop({x,y,w,h,o})
    {
        const _o = this.t.h * this.t.o.y;
        const _x = this.t.x + this.t.w * this.t.o.x, _y = this.t.y + _o;
        const oldy = this.oldt.y + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x+this.t.w >= __x   &&
            _x          <= __x+w &&
            _y          <= __y+h &&
            oldy        >= __y+h)
            return true;
        
        return false;
    }
    collideBottom({x,y,w,h,o})
    {
        const _o = this.t.h * this.t.o.y;
        const _x = this.t.x + this.t.w * this.t.o.x, _y = this.t.y + _o;
        const oldy = this.oldt.y + _o;
        const __x = x + w * o.x, __y = y + h * o.y;
        
        if (_x+this.t.w   >= __x   &&
            _x            <= __x+w &&
            _y+this.t.h   >= __y   &&
            oldy+this.t.h <= __y)
            return true;
        
        if (this.grounded != undefined)
            this.grounded = false;
        return false;
    }
    collideLeft({x,y,w,h,o})
    {
        const _o = this.t.w * this.t.o.x;
        const _x = this.t.x + _o, _y = this.t.y + this.t.h * this.t.o.y;
        const oldx = this.oldt.x + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x          <= __x+w &&
            oldx        >= __x+w &&
            _y+this.t.h >= __y   &&
            _y          <= __y+h)
            return true;
        
        return false;
    }
    collideRight({x,y,w,h,o})
    {
        const _o = this.t.w * this.t.o.x;
        const _x = this.t.x + _o, _y = this.t.y + this.t.h * this.t.o.y;
        const oldx = this.oldt.x + _o;
        const __x = x + w * o.x, __y = y + h * o.y;

        if (_x+this.t.w   >= __x   &&
            oldx+this.t.w <= __x   &&
            _y+this.t.h   >= __y   &&
            _y            <= __y+h)
            return true;
        
        return false;
    }
    RRCollision(target)
    {
        return {
            l: this.collideLeft(target.t),
            r: this.collideRight(target.t),
            t: this.collideTop(target.t),
            b: this.collideBottom(target.t)
        }
    }
    compileSides({l,r,t,b})
    {
        return (l+r+t+b) > 0;
    }

    repositionRR({x,y,w,h,o}, {l,r,t,b})
    {
        switch(true)
        {
            case l:
            {
                this.t.x = (x+w+w*o.x)-this.t.w*this.t.o.x;

                return;
            }
            case r:
            {
                this.t.x = (x+w*o.x)-this.t.w - this.t.w*this.t.o.x;

                return;
            }

            case b:
            {
                this.t.y = (y+h*o.y)-this.t.h - this.t.h*this.t.o.y;

                return;
            }
            case t:
            {
                this.t.y = (y+h+h*o.y)-this.t.h*this.t.o.y;

                return;
            }
        }
    }
    repositionR(target, rR = undefined, rRR = undefined)
    {
        const x = target.t.x;
        const y = target.t.y;
        const w = target.t.w;
        const h = target.t.h;
        const o = target.t.o;
        const cx = this.center.x, cy = this.center.y;
        const r = this.t.w/2;

        const left = x + w*o.x;
        const right = x + w + w*o.x;
        const top = y + h*o.y;
        const bottom = y + h + h*o.y;

        switch(true)
        {
            case (this.parent.v.x != 0 && top <= cy && bottom >= cy):
            {
                let tsides = {};
                this.repositionRR(target.t, tsides = this.RRCollision(target));
                if (rRR != undefined) rRR(target, tsides);
                
                return;
            }
            case (this.parent.v.y != 0 && left <= cx && right >= cx):
            {
                let tsides = {};
                this.repositionRR(target.t, tsides = this.RRCollision(target));
                if (rRR != undefined) rRR(target, tsides);

                return;
            }
        }

        let vx = false;
        let vy = false;
        switch(true)
        {
            case this.parent.v.x < 0:
            {
                vx = -1;

                break;
            }
            case this.parent.v.x > 0:
            {
                vx = 1;

                break;
            }
        }

        switch(true)
        {
            case this.parent.v.y < 0:
            {
                vy = -1;

                break;
            }
            case this.parent.v.y > 0:
            {
                vy = 1;

                break;
            }
        }

        if (vx != false && vy != false)
        {
            const h = cx > right ? right : left;
            const k = cy < top ? top : bottom;
            const a = -this.parent.v.y/this.parent.v.x;
            const k2 = this.center.y - a*this.center.x;

            yy1 = k2;
            xx2 = res.w;
            yy2 = res.w*a+k2;

            const x1 = (Math.sqrt(a**2 * (r**2-h**2) + k2*(2*k-2*a*h) + 2*a*h*k - k2**2 - k**2 + r**2) - a*k2 + a*k + h)/(a**2 + 1);
            const x2 = (-Math.sqrt(a**2 * (r**2-h**2) + k2*(2*k-2*a*h) + 2*a*h*k - k2**2 - k**2 + r**2) - a*k2 + a*k + h)/(a**2 + 1);
            point.t.x = x1;
            point.t.y = x1*a + k2;
            point2.t.x = x2;
            point2.t.y = x2*a + k2;

            circle1.t.x = x1;
            circle1.t.y = x1*a + k2;
            circle2.t.x = x2;
            circle2.t.y = x2*a + k2;

            this.t.x = (vx == -1 ? x1 : x2) - r - this.t.w*this.t.o.x;
            this.t.y = (vx == -1 ? x1*a + k2 : x2*a + k2) - r - this.t.w*this.t.o.x;
            // ball.v.x = 0;ball.v.y = 0;
            if (rR != undefined) rR(target);
            return;
        }
        
        if (vx != false)
        {
            switch(true)
            {
                case top >= cy:
                {
                    point.t.x = Math.sqrt(r**2-(top-cy)**2)*-vx + (vx == -1 ? right : left);
                    point.t.y = cy;
                    this.t.x = Math.sqrt(r**2-(cy-top)**2)*-vx + (vx == -1 ? right : left) - r - this.t.w*this.t.o.x;
                    
                    if (rR != undefined) rR(target);

                    return;
                }
                case bottom <= cy:
                {
                    point.t.x = Math.sqrt(r**2-(cy-bottom)**2)*-vx + (vx == -1 ? right : left);
                    point.t.y = cy;
                    this.t.x = Math.sqrt(r**2-(cy-bottom)**2)*-vx + (vx == -1 ? right : left) - r - this.t.w*this.t.o.x;

                    if (rR != undefined) rR(target);

                    return;
                }
            }
        }
        if (vy != false)
        {
            switch(true)
            {
                case left >= cx:
                {
                    point.t.x = left;
                    point.t.y = Math.sqrt(r**2-(left-cx)**2)*vy + cy;
                    this.t.y = Math.sqrt(r**2-(left-cx)**2)*vy + (vy == -1 ? top : bottom) - r - this.t.h*this.t.o.y;

                    if (rR != undefined) rR(target);

                    return;
                }
                case right <= cx:
                {
                    point.t.x = right;
                    point.t.y = Math.sqrt(r**2-(right-cx)**2)*vy + cy;
                    this.t.y = Math.sqrt(r**2-(right-cx)**2)*vy + (vy == -1 ? top : bottom) - r - this.t.h*this.t.o.y;

                    if (rR != undefined) rR(target);

                    return;
                }
            }
        }
    }

    isCollidingWith(target, FILLERRRRRRR, rR = undefined, rRR = undefined)
    {
        if (target != undefined) 
        {
            if (target.type == "rect")
            {
                if (target.sides != _NOCOLLISION && this.circleRect(target.t, target.sides, rRR, target))
                {
                    if (target.reposition) if (this.LineChecked == 0) this.repositionR(target, rR, rRR);
                    return true;
                }
                return false;
            }
            if (target.type == "circle")
            {
                return this.circleCircle(target.center, target.t.w/2);
            }
        }
    }
    lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {

        // calculate the direction of the lines
        const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
        const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
      
        // if uA and uB are between 0-1, lines are colliding
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
            return true;

        return false;
    }
    lineRect(x1, y1, x2, y2, {l,r,t,b}, rRR, target) {

        // check if the line has hit any of the rectangle's sides
        // uses the Line/Line function below
        const left =   this.lineLine(x1,y1,x2,y2, l,t, l,b);
        const right =  this.lineLine(x1,y1,x2,y2, r,t, r,b);
        const top =    this.lineLine(x1,y1,x2,y2, l,t, r,t);
        const bottom = this.lineLine(x1,y1,x2,y2, l,b, r,b);
      
        // if ANY of the above are true, the line
        // has hit the rectangle
        if (left || right || top || bottom)
        {
            if (rRR != undefined) rRR(target, {l:false,r:false,t:false,b:false}, l,r,t,b);
            {
                let tsides = {l:false,r:false,t:false,b:false};
                if (this.compileSides(tsides = this.RRCollision(target)))
                {
                    if (target.reposition) this.repositionRR(target.t, tsides);
                    if (rRR != undefined) rRR(target, tsides);
                    this.LineChecked = 2;
                    return true;
                }
                    if (rRR != undefined) rRR(target, tsides, l,r,t,b);
                return true;
            }
        }
        return false;
      }

    // circleLine({l,r,t,b}, m = 0, k = 0, rRR = undefined, target)
    // {
    //     point.t.x = this.oldt.x;
    //     point.t.y = this.oldt.y;
    //     mmm = m;
    //     kkkk = k;

    //     const minX = Math.min(this.oldcenter.x, this.center.x);
    //     const maxX = Math.max(this.oldcenter.x, this.center.x);
    //     const minY = Math.min(this.oldcenter.y, this.center.y);
    //     const maxY = Math.max(this.oldcenter.y, this.center.y);

    //     if( (m*l + k >= t && m*l + k <= b && l <= minX) ||
    //         (m*r + k >= t && m*r + k <= b && r >= maxX) ||
    //         ((t-k)/m >= l && (t-k)/m <= r && t <= minY) ||
    //         ((b-k)/m >= l && (b-k)/m <= r && b >= maxY)   )
    //         {
    //             let tsides = {l:false,r:false,t:false,b:false};
    //             console.log(minX)
    //             if (this.compileSides(tsides = this.RRCollision(target)))
    //             {
    //                 if (target.reposition) this.repositionRR(target.t, tsides);
    //                 if (rRR != undefined) rRR(target, tsides, l,r,t,b);
    //                 this.blacklisted = target;
    //                 this.LineChecked = 2;
    //                 return true;
    //             }
    //         }
    //     return false;
    // }

    circleRect({x,y,w,h,o}, sides, rRR = undefined, target)
    {
        const rx = x + w * o.x, ry = y + h * o.y;

        const cx = this.center.x, cy = this.center.y;
        
        let testX = cx;
        let testY = cy;
      
        // which edge is closest?
        if      (cx < rx && sides.l)   {testX = rx;  }    // test left edge
        else if (cx > rx+w && sides.r) {testX = rx+w;}   // right edge
        if      (cy < ry && sides.t)   {testY = ry;  }    // top edge
        else if (cy > ry+h && sides.b) {testY = ry+h;}   // bottom edge
      
        // get distance from closest edges
        const distX = cx-testX;
        const distY = cy-testY;
        const distance = Math.sqrt(distX**2+distY**2);
      
        // if the distance is less than the radius, collision!
        if ((distance != 0 && distance <= this.t.w/2) || (this.center.x >= rx && this.center.x <= rx+w && this.center.y >= ry && this.center.y <= ry+h))
            return true;
        if (this.lineRect(this.center.x, this.center.y, this.oldcenter.x, this.oldcenter.y, {l:rx, r:rx+w, t:ry, b:ry+h}, rRR, target))
            return true;

        return false;
    }
    
    circleCircle({x,y}, r)
    {

        const cx = this.center.x, cy = this.center.y;

        const distX = cx-x;
        const distY = y-cy;
        const distance = Math.sqrt(distX**2+distY**2);

        if (distance <= (r+this.t.w/2))
        {
            return true;
        }
        return false;
    }

    setTransform(t)
    {
        this.t = t;
    }

    updateTransform()
    {
        if (this.LineChecked > 0) this.LineChecked--;
        if (this.LineChecked - 1 == -1) this.blacklisted = {};
        this.t = this.parent.t;
        this.center = this.parent.center;
    }

    updateOldTransform()
    {
        this.oldt = this.parent.oldt;
        this.oldcenter = this.parent.oldcenter;
    }
}