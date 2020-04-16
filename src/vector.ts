export class Vector {
    data:Array<number>=[];
    length:number;
    
    constructor(length:number){
        this.length=length;
        for(let i=0;i<length;i++)this.data[i]=0;
    }

    add(v:Vector):Vector {
        if(this.length!=v.length)throw new Error("Can't perform operations on vectors of differing lengths");
        for(let i=0;i<this.length;i++)this.data[i]+=v.data[i];
        return this;
    }

    static add(v1:Vector, v2:Vector):Vector {
        return Vector.copy(v1).add(v2);
    }

    sub(v:Vector):Vector {
        if(this.length!=v.length)throw new Error("Can't perform operations on vectors of differing lengths");
        for(let i=0;i<this.length;i++)this.data[i]-=v.data[i];
        return this;
    }

    static sub(v1:Vector, v2:Vector):Vector {
        return Vector.copy(v1).sub(v2);
    }    

    scale(n:number):Vector {
        for(let i=0;i<this.length;i++)this.data[i]*=n;
        return this;
    }

    static scale(v:Vector, n:number):Vector {
        return Vector.copy(v).scale(n);
    }

    mag():number {
        let squaredSum=0;
        for(let i=0;i<this.length;i++)squaredSum+=this.data[i]**2;
        return squaredSum**(1/2);
    }

    normalize():Vector {
        return this.scale(this.mag()**-1);
    }

    static normalize(v:Vector):Vector {
        return Vector.copy(v).normalize();
    }

    toArray():Array<number> {
        let data=[];
        for(let i=0;i<this.length;i++)data[i]=this.data[i];
        return data;
    }

    static fromArray(array:Array<number>):Vector {
        let v=new Vector(array.length);
        v.data=array;
        return v;
    }

    static copy(v:Vector):Vector {
        return Vector.fromArray(v.toArray());
    }

}

export class Vector2d {
    x:number;
    y:number;
    /**
     * Create a new two dimensional vector.
     * @param {number} x the x position of the vector
     * @param {number} y the y position of the vector
     */
    constructor(x?:number,y?:number) {
        /** @typedef number the x position of the vector */
        this.x=x||0;
        /** @typedef number the y position of the vector */
        this.y=y||0;
    }

    /**
     * Add another vector to this vector.
     * @param {Vector2d} v the vector to be added.
     * @returns {Vector2d}
     */
    add(v:Vector2d):Vector2d {
        this.x+=v.x;
        this.y+=v.y;
        return this;
    }

    /**
     * Add two vectors.
     * @param {Vector2d} v1 the first vector.
     * @param {Vector2d} v2 the second vector.
     * @returns {Vector2d} the result of the vector addition.
     */
    static add(v1:Vector2d, v2:Vector2d):Vector2d {
        return v1.copy().add(v2);
    }

    sub(v:Vector2d):Vector2d {
        this.x-=v.x;
        this.y-=v.y;
        return this;
    }

    static sub(v1:Vector2d, v2:Vector2d):Vector2d {
        return v1.copy().sub(v2);
    }    

    scale(n:number):Vector2d {
        this.x*=n;
        this.y*=n;
        return this;
    }

    static scale(v:Vector2d, n:number):Vector2d {
        return v.copy().scale(n);
    }

    mag():number {
        return (this.x**2+this.y**2)**(1/2);
    }

    normalize():Vector2d {
        return this.scale(this.mag()**-1);
    }

    static normalize(v:Vector2d):Vector2d {
        return v.copy().normalize();
    }

    setMag(n:number) {
        return this.normalize().scale(n);
    }

    static setMag(v:Vector2d,n:number) {
        return v.copy().setMag(n);
    }

    copy(){
        return new Vector2d(this.x,this.y);
    }

    static copy(v:Vector2d):Vector2d {
        return v.copy();
    }

    angle(){
        Math.atan2(this.y,this.x);
    }

    static fromAngle(angle:number){
        return new Vector2d(Math.sin(angle),Math.cos(angle));
    }

    static random() {
        return Vector2d.fromAngle(Math.random()*Math.PI*2);
    }

}