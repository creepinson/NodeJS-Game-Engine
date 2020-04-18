import {Entity2d} from "./entity";
import Graphics from "./graphics";

export class EntityRegistery {
    uid:number=0;
    entities:{[key:number]:Entity2d}={};
    groups:{[key:string]:EntityGroup}={};
    scope:{Graphics:Graphics};
    constructor(scope:{Graphics:Graphics}){
        this.scope=scope;
    }

    addEntity(entity:Entity2d,group:string){
        entity.uid=this.uid;
        this.entities[this.uid]=entity;
        this.groups[group].entities[this.uid]=entity;
        this.uid++;
    }

    createGroup(name:string) {
        if(this.groups.hasOwnProperty(name))throw new Error(`The entity group ${name} already exists`);
        else this.groups[name]=new EntityGroup(name);
    }

    update(group:string,options:{timeSteps?:number,timeStepLength?:number}={}){
        if(!this.groups.hasOwnProperty(group))throw new Error(`Entity group ${group} doesn't exist`);
        for(let i=0;i<(options.timeSteps||1);i++){
            for(let uid in this.groups[group].entities) {
                this.groups[group].entities[uid].update({...this.scope,...{EntityRegistery:this}},options);
                if(this.groups[group].entities[uid].removed) {
                    delete this.groups[group].entities[uid]
                    delete this.entities[uid];
                }
            }
        }
        this.groups[group].forEntity((entity,uid)=>{
            if(this.groups[group].entities[uid].removed)delete this.groups[group].entities[uid];
            entity.frame({...this.scope,...{EntityRegistery:this}});
        })
        
    }

}

export class EntityGroup {
    name:string;
    entities:{[key:number]:Entity2d}={};
    constructor(name:string) {
        this.name=name;
    }
    forEntity(callback:(entity:Entity2d,uid:number)=>void){
        for(let uid in this.entities)if(!this.entities[uid].removed)callback(this.entities[uid],+uid);
    }
    count(){
        return Object.keys(this.entities).length;
    }
}