import {Body2d,CircleBody,PolygonBody,RectBody} from "./bodies";
import Graphics from "../graphics";

export class World {
    uid:number=0;
    bodies:{[key:number]:Body2d}={};
    groups:{[key:string]:BodyGroup}={};
    Graphics:Graphics;

    constructor(Graphics:Graphics){
        this.Graphics=Graphics;
    }

    addBody(body:Body2d,group:string){
        body.uid=this.uid;
        body.group=group;
        this.bodies[this.uid]=body;
        this.groups[group].bodies[this.uid]=body;
        this.uid++;
    }

    removeBody(uid:number) {
        if(!this.bodies.hasOwnProperty(uid))throw new Error(`No body with a uid of ${uid} exists`);
        let group=this.bodies[uid].group;
        delete this.bodies[uid];
        delete this.groups[group].bodies[uid];
    }

    createGroup(name:string):BodyGroup {
        if(this.groups.hasOwnProperty(name))throw new Error(`Body group ${name} already exists`);
        else return this.groups[name]=new BodyGroup(name, this);
    }

    update(options:{timeSteps?:number,timeStepLength?:number}={}){
        for(let i=0;i<(options.timeSteps||1);i++){
            let bodies=Object.keys(this.bodies);
            for(let i=0; i<bodies.length; i++) {
                this.bodies[+bodies[i]].update(this,options.timeStepLength||1);
                for(let j=i+1; j<bodies.length; j++) {
                    let body1=this.bodies[+bodies[i]],
                    body2=this.bodies[+bodies[j]];
                    if(body1.collide(body2)){
                        body1.collision(this,body2);
                        body2.collision(this,body1);
                    };
                };
                if(this.bodies[+bodies[i]].removed)this.removeBody(+bodies[i]);
            }
        }
        for(let group in this.groups)this.groups[group].forBody((body:Body2d)=>body.frame(this.Graphics,this));
    };

    getGroup(group:string):BodyGroup {
        if(!this.groups.hasOwnProperty(group))throw new Error(`Body group ${group} doesn't exist`)
        return this.groups[group];
    };

};

export class BodyGroup {
    name:string;
    bodies:{[key:number]:Body2d}={};
    world:World;
    constructor(name:string,World:World) {
        this.name=name;
        this.world=World;
    };
    forBody(callback:(body:Body2d,uid:number)=>void){
        for(let uid in this.bodies)callback(this.bodies[uid],+uid);
    };
    count(){
        return Object.keys(this.bodies).length;
    };
    addBody(body:Body2d) {
        this.world.addBody(body,this.name);
    }
};

export {
    Body2d,
    CircleBody,
    PolygonBody,
    RectBody
}