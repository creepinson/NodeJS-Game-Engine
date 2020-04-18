import {Vector2d} from"./vector";
import {EntityRegistery} from "./entity registery";
import Graphics from "./graphics";

export class Entity2d {
    uid:(number|undefined);
    removed:boolean=false;
    pos:Vector2d;
    vel:Vector2d=new Vector2d();
    acc:Vector2d=new Vector2d();
    maxSpeed:number;
    
    constructor(pos:Vector2d,options:{maxSpeed?:number}={}){
        this.pos=pos;
        this.maxSpeed=options.maxSpeed||Infinity;
    }

    update(scope:{Graphics:Graphics,EntityRegistery:EntityRegistery},options:{timeStepLength?:number}){
        this.vel.add(this.acc.copy().scale(options.timeStepLength||1));
        this.acc=new Vector2d();
        if(this.vel.mag()>this.maxSpeed)this.vel.setMag(this.maxSpeed);
        this.pos.add(this.vel.copy().scale(options.timeStepLength||1));
        this.timeStep(scope);
    }

    accelerate(v:Vector2d){
        this.acc.add(v);
    }

    kill() {
        this.removed=true;
    }

    timeStep(scope:{Graphics:Graphics,EntityRegistery:EntityRegistery}) {}
    frame(scope:{Graphics:Graphics,EntityRegistery:EntityRegistery}) {}
}