import {Body2d,CircleBody,PolygonBody,RectBody} from "./physics/bodies";
import Graphics from "./window/dom/canvas/graphics";

export class World {
    id:number=0;
    bodies:{[key:number]:Body2d}={};
    groups:{[key:string]:BodyGroup}={};
    renderer:Graphics;

    constructor(renderer:Graphics){
        this.renderer=renderer;
    }

    addBody(body:Body2d,group:string){
        body.id=this.id;
        body.group=group;
        this.bodies[this.id]=body;
        this.groups[group].bodies[this.id]=body;
        this.id++;
    }

    removeBody(id:number) {
        if(!this.bodies.hasOwnProperty(id))throw new Error(`No body with a uid of ${id} exists`);
        let group=this.bodies[id].group;
        delete this.bodies[id];
        delete this.groups[group].bodies[id];
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
                    if(body1.isColliding(body2)&&(+body1.collision(body2,this)*+body2.collision(body1,this)))body1.repulse(body2);
                };
                if(this.bodies[+bodies[i]].removed)this.removeBody(+bodies[i]);
            }
        }
        for(let id in this.bodies)this.bodies[id].frame(this.renderer,this);
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
    forBody(callback:(body:Body2d,id:number)=>void){
        for(let id in this.bodies)callback(this.bodies[id],+id);
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