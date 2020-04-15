import {Vector2d} from"./vector";
import EntityRegistery from "./entity registery";

export class Entity2d {
    uid:(number|undefined);
    removed:boolean=false;
    pos:Vector2d;
    vel:Vector2d=new Vector2d();
    loop:(Function|undefined);
    maxSpeed:number;
    constructor(x:number,y:number,options:{maxSpeed?:number}){
        this.pos=new Vector2d(x,y);
        this.maxSpeed=options.maxSpeed||Infinity;
    }
    update(er:EntityRegistery){
        if(this.vel.mag()>this.maxSpeed)this.vel.setMag(this.maxSpeed);
        this.pos.add(this.vel);
        if(this.loop instanceof Function)this.loop(er);
    }
    accelerate(v:Vector2d){
        this.vel.add(v);
    }
}