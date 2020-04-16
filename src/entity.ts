import {Vector2d} from"./vector";
import {EntityGroup} from "./entity registery";

export class Entity2d {
    uid:(number|undefined);
    removed:boolean=false;
    pos:Vector2d;
    vel:Vector2d=new Vector2d();
    acc:Vector2d=new Vector2d();
    maxSpeed:number;
    
    constructor(x:number,y:number,options:{maxSpeed?:number}){
        this.pos=new Vector2d(x,y);
        this.maxSpeed=options.maxSpeed||Infinity;
    }

    update(entityGroups:{[key:string]:EntityGroup},options:{timeStepLength?:number}){
        this.vel.add(this.acc.copy().scale(options.timeStepLength||1));
        this.acc=new Vector2d();
        if(this.vel.mag()>this.maxSpeed)this.vel.setMag(this.maxSpeed);
        this.pos.add(this.vel.copy().scale(options.timeStepLength||1));
        this.timeStep(entityGroups);
    }

    accelerate(v:Vector2d){
        this.acc.add(v);
    }

    timeStep(entityGroups:{[key:string]:EntityGroup}) {}
    frame() {}
}