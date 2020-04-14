import {Vector2d} from"./vector";

export class Entity2d {
    pos:Vector2d;
    vel:Vector2d=new Vector2d();
    show:(Function|undefined);
    constructor(x:number,y:number){
        this.pos=new Vector2d(x,y);
    }
    update(){
        this.pos.add(this.vel);
        if(this.show instanceof Function)this.show();
    }
    accelerate(v:Vector2d){
        this.vel.add(v);
    }
}