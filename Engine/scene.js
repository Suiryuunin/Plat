let aur = 0;

class Scene
{
    constructor()
    {
        this.elements = new LinkedList();
        this.el = [];
        this.PLAT = [];
        this.SF = [];
        this.SSF = [];
        this.CP = [];
    }

    init(value)
    {
        this.elements.init(value);
        this.el.push(value);
    }

    add(value)
    {
        this.elements.addNode(value);
        this.el=[];
        this.elements.callNodeMethods((obj) =>
        {
            this.el.push(obj);
        });
    }

    addBulk(valArray)
    {
        this.elements.addBulk(valArray);
        this.el=[];
        this.elements.callNodeMethods((obj) =>
        {
            this.el.push(obj);
        });
    }

    deleteItem(value)
    {
        this.elements.deleteNode(value);
    }

    size()
    {
        return this.elements.size();
    }

    collisionsWith(object, callback = undefined, rR = undefined, rRR = undefined)
    {
        for (let i = this.el.length-1; i >= 0; i--)
        {
            const obj = this.el[i];
            if (object.visible && !(object === obj) && object.collideWith(obj, rR, rRR))
            {
                if (callback != undefined) callback(obj);
            }
        }
    }

    update()
    {
        for (let i = this.el.length-1; i >= 0; i--)
        {
            this.el[i].update();
        }
    }

    render()
    {
        for (let i = this.el.length-1; i >= 0; i--)
        {
            const obj = this.el[i];
            if (obj.visible) obj.render();
        }
    }
}