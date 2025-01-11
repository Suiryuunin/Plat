class Ray {
    constructor(x1,y1,x2,y2)
    {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    cast(scene, exc, skipTrigger = true)
    {
        let hits = [];
        let triggerItems = [];

        for (let j = scene.el.length-1; j >= 0; j--)
        {
            const obj = scene.el[j];

            if (obj != exc && obj.hitbox != undefined)
            {
                const rx1 = obj.hitbox.t.x + (obj.hitbox.t.w*obj.hitbox.t.o.x);
                const ry1 = obj.hitbox.t.y + (obj.hitbox.t.h*obj.hitbox.t.o.y);
                const rx2 = obj.hitbox.t.x + (obj.hitbox.t.w*obj.hitbox.t.o.x) + obj.hitbox.t.w;
                const ry2 = obj.hitbox.t.y + (obj.hitbox.t.h*obj.hitbox.t.o.y) + obj.hitbox.t.h;

                let thits = [];

                if (this.x1 == this.x2)
                {
                    if (this.x1 >= rx1 && this.x1 <= rx2)
                    {
                        if (obj.hitbox.sides.t && ry1 >= Math.min(this.y1,this.y2) && ry1 <= Math.max(this.y1,this.y2))
                            thits.push({x:this.x1, y:ry1, side:"t", trigger:obj.hitbox.trigger});
                        
                        if (obj.hitbox.sides.b && ry2 >= Math.min(this.y1,this.y2) && ry2 <= Math.max(this.y1,this.y2))
                            thits.push({x:this.x1, y:ry2, side:"b", trigger:obj.hitbox.trigger});
                    }
                }
                else
                {
                    const a = (this.y2-this.y1)/(this.x2-this.x1);
                    const b = this.y1-(a*this.x1);

                    let intersect = a*rx1+b;
                    if (obj.hitbox.sides.l && intersect >= ry1 && intersect <= ry2)
                    {
                        if (intersect >= Math.min(this.y1,this.y2) && intersect <= Math.max(this.y1,this.y2))
                            thits.push({x:rx1, y:intersect, side:"l", trigger:obj.hitbox.trigger});
                    }
    
                    intersect = a*rx2+b;
                    if (obj.hitbox.sides.r && intersect >= ry1 && intersect <= ry2)
                    {
                        if (intersect >= Math.min(this.y1,this.y2) && intersect <= Math.max(this.y1,this.y2))
                            thits.push({x:rx2, y:intersect, side:"r", trigger:obj.hitbox.trigger});
                    }
    
                    intersect = (ry1-b)/a;
                    if (obj.hitbox.sides.t && this.y1 < ry1 && intersect >= rx1 && intersect <= rx2)
                    {
                        if (intersect >= Math.min(this.x1,this.x2) && intersect <= Math.max(this.x1,this.x2))
                            thits.push({x:intersect, y:ry1, side:"t", trigger:obj.hitbox.trigger});
                    }
    
                    intersect = (ry2-b)/a;
                    if (obj.hitbox.sides.b && this.y2 > ry2 && intersect >= rx1 && intersect <= rx2)
                    {
                        if (intersect >= Math.min(this.x1,this.x2) && intersect <= Math.max(this.x1,this.x2))
                            thits.push({x:intersect, y:ry2, side:"b", trigger:obj.hitbox.trigger});
                    }
                }
                

                let mdis = Infinity;
                let mi = undefined;
                for (let i = 0; i < thits.length; i++)
                {
                    if (thits[i].trigger)
                        triggerItems.push([obj,Math.sqrt((thits[i].x-this.x1)**2+(thits[i].y-this.y1)**2)]);

                    const dis = Math.sqrt((thits[i].x-this.x1)**2+(thits[i].y-this.y1)**2);
                    mdis = Math.min(mdis, dis);

                    if (mdis == dis) mi = i;
                }
                if (mdis <= Math.sqrt((this.x2-this.x1)**2+(this.y2-this.y1)**2))
                    hits.push(thits[mi]);
            }
        }
        
        let mdis = Infinity;
        let mi = undefined;
        for (let i = 0; i < hits.length; i++)
        {
            if (triggerItems.length > 0 && skipTrigger) break;
            
            
            const dis = Math.sqrt((hits[i].x-this.x1)**2+(hits[i].y-this.y1)**2);
            mdis = Math.min(mdis, dis);

            if (mdis == dis) mi = i;
        }

        return {hit:hits[mi], dis:mdis, triggered:triggerItems};
    }
}