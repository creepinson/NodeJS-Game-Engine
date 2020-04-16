import {Entity2d} from "./entity";

export class EntityRegistery {
    uid:number=0;
    entities:{[key:number]:Entity2d}={};
    groups:{[key:string]:EntityGroup}={};
    constructor(){

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
                this.groups[group].entities[uid].update(this.groups,options);
                if(this.groups[group].entities[uid].removed) {
                    delete this.groups[group].entities[uid]
                    delete this.entities[uid];
                }
            }
        }
        for(let uid in this.groups[group].entities) {
            this.groups[group].entities[uid].frame();
        }
    }

}

export class EntityGroup {
    name:string;
    entities:{[key:number]:Entity2d}={};
    constructor(name:string) {
        this.name=name;
    }
    forEntity(callback:(entity:Entity2d,uid:number)=>void){
        for(let uid in this.entities)callback(this.entities[uid],+uid);
    }
}