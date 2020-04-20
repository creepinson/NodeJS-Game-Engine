import {Vector2d} from "./vector";

function CvC(pos1:Vector2d, r1:number, pos2:Vector2d, r2:number):boolean {
    return Math.pow(r1+r2,2)>pos1.copy().sub(pos2).sqMag();
}

function BBvBB(pos1:Vector2d, w1:number, h1:number, pos2:Vector2d, w2:number, h2:number) {
    return pos1.x-w1/2<pos2.x+w2/2&&pos1.x+w1/2>pos2.x-w2/2&&pos1.y-h1/2<pos2.y+h2/2&&pos1.y+h1/2>pos2.y-h2/2
}

interface options {
    isStatic?:boolean,
    mass?:number,
    maxSpeed?:number
}

export class Body2d {
    pos:Vector2d=new Vector2d();
    vel:Vector2d=new Vector2d();
    acc:Vector2d=new Vector2d();
    inverseMass:number;
    isStatic:boolean;
    maxSpeed:number;

    constructor (options:options={}) {
        this.inverseMass=options.mass?Math.pow(options.mass,-1):1;
        this.isStatic=options.isStatic??false;
        this.maxSpeed=options.maxSpeed??Infinity;
    }

    collision(b:Body2d):boolean {return false};

    move(timeStepLength:number) {
        this.vel.add(this.acc.copy().scale(timeStepLength||1));
        this.acc=new Vector2d();
        if(this.vel.mag()>this.maxSpeed)this.vel.setMag(this.maxSpeed);
        this.pos.add(this.vel.copy().scale(timeStepLength||1));
    }

    accelerate(v:Vector2d){
        if(!this.isStatic)this.acc.add(v);
    };

}

export class PolygonBody extends Body2d {
    vertices:Array<Vector2d>;
    r:number;
    constructor(vertices:Array<Vector2d>,options?:options) {
        super(options);
        this.vertices=vertices;
        let g=0;
        for(let v of vertices){
            let d=v.sqMag();
            if(d>g)g=d;
        }
        this.r=Math.sqrt(g);
    }

    collision(b:Body2d):boolean {
        if(b instanceof CircleBody) {
            return CvC(this.pos,this.r,b.pos,b.r);
        }
        return false;
    }

}

export class RectBody extends PolygonBody {
    w:number;
    h:number;

    constructor(w:number,h:number=w,options?:options) {
        super([new Vector2d(-w/2,-h/2), new Vector2d(w/2,-h/2), new Vector2d(w/2,h/2), new Vector2d(-w/2,h/2)],options);
        this.w=w;
        this.h=h;
    };

};

export class CircleBody extends Body2d {
    r:number;

    constructor(r:number,options?:options) {
        super(options);
        this.r=r;
    }

    collision(b:Body2d):boolean {
        if(b instanceof CircleBody) {
            if(!CvC(this.pos,this.r,b.pos,b.r))return false;
            let rv=b.vel.copy().sub(this.vel);
            let n=b.pos.copy().sub(this.pos).normalize();
            let vn=rv.dot(n);
            if(vn>0)return false;
            let e=1;
            let j = -(1 + e) * vn;
            j /= this.inverseMass + b.inverseMass;
            let impulse=n.scale(j);
            if(!b.isStatic)b.vel.add(impulse.copy().scale(b.inverseMass));
            if(!this.isStatic)this.vel.sub(impulse.scale(this.inverseMass));
            return true;
        };
        return false;
    }

}