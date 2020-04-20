import {Vector2d} from "./vector";
import {Body2d} from "./physics";
import Graphics from "./graphics";

export class EntityRegistery {
    uid:number=0;
    entities:{[key:number]:Entity2d}={};
    groups:{[key:string]:EntityGroup}={};
    scope:{Graphics:Graphics,EntityRegistery:EntityRegistery};
    settings:{timeStepsPerFrame:number,timeStepLength:number}={timeStepsPerFrame:1,timeStepLength:1};

    constructor(scope:{Graphics:Graphics}){
        this.scope={...scope,...{EntityRegistery:this}};
    }

    register(entity:Entity2d,group:string){
        entity.uid=this.uid;
        entity.group=group;
        this.entities[this.uid]=entity;
        this.groups[group].entities[this.uid]=entity;
        this.uid++;
    }

    unregister(uid:number) {
        if(!this.entities.hasOwnProperty(uid))throw new Error(`There is no entity with a uid of ${uid}`);
        let group=this.entities[uid].group;
        delete this.entities[uid];
        delete this.groups[group].entities[uid];
    }

    createGroup(name:string):EntityGroup {
        if(this.groups.hasOwnProperty(name))throw new Error(`The entity group ${name} already exists`);
        else return this.groups[name]=new EntityGroup(name, this);
    }

    update(){
        for(let i=0;i<(this.settings.timeStepsPerFrame||1);i++){
            let entities=Object.keys(this.entities);
            for(let i=0; i<entities.length; i++) {
                this.entities[+entities[i]].update({...this.scope,...{Graphics:undefined}},this.settings);
                for(let j=i+1; j<entities.length; j++)
                    this.entities[+entities[i]].collide(this.scope,this.entities[+entities[j]]);
                if(this.entities[+entities[i]].removed)this.unregister(+entities[i]);
            }
        }
    };

    frame(group:string) {
        if(!this.groups.hasOwnProperty(group))throw new Error(`Entity group ${group} doesn't exist`);
        this.groups[group].forEntity((entity,uid)=>entity.frame(this.scope));
    };

    getGroup(group:string):EntityGroup {
        if(!this.groups.hasOwnProperty(group))throw new Error(`Entity group ${group} doesn't exist`)
        return this.groups[group];
    };

    config(settings:{timeStepsPerFrame?:number,timeStepLength?:number}) {
        this.settings={...this.settings,...settings};
    }

};

export class EntityGroup {
    name:string;
    entities:{[key:number]:Entity2d}={};
    registery:EntityRegistery;
    constructor(name:string,EntityRegistery:EntityRegistery) {
        this.name=name;
        this.registery=EntityRegistery;
    };
    forEntity(callback:(entity:Entity2d,uid:number)=>void){
        for(let uid in this.entities)callback(this.entities[uid],+uid);
    };
    count(){
        return Object.keys(this.entities).length;
    };
    addEntity(entity:Entity2d) {
        this.registery.register(entity,this.name);
    }
};

export class Entity2d {
    uid:number=-1;
    group:string="";
    body:Body2d;
    removed:boolean=false;
    /**
     * 
     * @param {Vector2d} pos the position of the entity.
     * @param {Body2d} body 
     */
    constructor(pos:Vector2d,body?:Body2d){
        this.body=body||new Body2d();
        this.body.pos=pos;
    };

    update(scope:{EntityRegistery:EntityRegistery},options:{timeStepLength:number}){
        this.body.move(options.timeStepLength);
        this.timeStep(scope);
    };

    kill() {
        this.removed=true;
    };

    collide(scope:{Graphics:Graphics,EntityRegistery:EntityRegistery},entity:Entity2d) {
        if(this.body.collision(entity.body)){
            if(!this.removed)this.collision(scope,entity);
            if(!entity.removed)entity.collision(scope,this);
        }
    };

    timeStep(scope:{EntityRegistery:EntityRegistery}) {};
    frame(scope:{EntityRegistery:EntityRegistery, Graphics:Graphics}) {};
    collision(scope:{Graphics:Graphics,EntityRegistery:EntityRegistery},entity:Entity2d):boolean {return true;};
}