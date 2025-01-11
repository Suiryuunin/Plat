let aur = 0;

class Scene
{
    constructor()
    {
        this.elements = new LinkedList();
        this.el = [];
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
        for (const obj of this.el)
        {
            if (object.visible && !(object === obj) && object.collideWith(obj, rR, rRR))
            {
                if (callback != undefined) callback(obj);
            }
        }
    }

    update()
    {
        for (const obj of this.el)
        {
            obj.update();
        }
    }

    render()
    {
        for (const obj of this.el)
        {
            if (obj.visible) obj.render();
        }
    }
}