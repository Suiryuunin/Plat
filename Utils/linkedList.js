class LinkedNode
{
    constructor(value)
    {
        this.value = value;
        this.next = null;
    }
}

class LinkedList
{
    constructor()
    {
        this.head = null;
    }

    size()
    {
        let length = 0;
        let temp = this.head;
        while (temp != null)
        {
            temp = temp.next;
            length++;
        }
        return length;
    }

    init(value)
    {
        this.head = new LinkedNode(value);
    }

    callNodeMethods(callback)
    {
        let temp = this.head;
        while (temp != null)
        {
            callback(temp.value);
            temp = temp.next;
        }
    }

    addNode(value)
    {
        const node = new LinkedNode(value);
        node.next = this.head;

        this.head = node;
    }

    addBulk(values)
    {
        for (const v of values)
        {
            this.addNode(v);
        }
    }

    pop()
    {
        if (this.head.next)
            this.head = this.head.next;
    }

    deleteFromIndex(index)
    {
        if (index == 0)
        {
            this.pop();
            return;
        }

        let temp = this.head;
        for (let i = 1; i < index && temp; i++) {
            temp = temp.next;
        }

        if (!temp || !temp.next) {
            console.log("Index out of range.");
            return;
        }
        
        // Update the next pointer
        temp.next = temp.next.next;
    }

    deleteNode(value)
    {
        let temp = this.head;
        let index = 0;
        while (temp != null && temp.value != value) {
            temp = temp.next;
            index++;
        }

        if (temp == null)
        {
            console.log("Value not found!");
            return;
        }
        
        this.deleteFromIndex(index);
    }
}