const engine=require("..");
const {Keyboard,Mouse,Window,Graphics,EntityRegistery}=engine.run({ setup, loop });
const {Entity2d, Vector2d}=engine;

let sun;

class Planet extends Entity2d {
    constructor(x,y,r){
        super(x,y,{maxSpeed:100/60});
        this.vel=Vector2d.random().scale(0.2);
        this.r=r;
        this.colour=`rgb(${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},${Math.round(Math.random()*255)})`;
    }

    timeStep(entityGroups){
        entityGroups["planets"].forEntity((entity,uid)=>{
            if(uid!=this.uid){
                let d=entity.pos.copy().sub(this.pos);
                this.accelerate(d.setMag(0.1/d.mag()));
            }
        });
        let d=sun.copy().sub(this.pos);
        this.accelerate(d.setMag(0.1/d.mag()));
    }

    frame(){
        Graphics.fillCSS(this.colour);
        Graphics.vectorEllipse(this.pos,this.r);
    }

}

function setup() {
    Window.maximize();
    Window.center();
    EntityRegistery.createGroup("planets");
    for(let i=0;i<5;i++)EntityRegistery.addEntity(new Planet(Math.round(Math.random()*Window.width),Math.round(Math.random()*Window.height),25),"planets");
    sun=new Vector2d(Window.width/2,Window.height/2);
}

function loop() {
    Graphics.clear(0,0,Window.width,Window.height);
    EntityRegistery.update("planets",{timeSteps:100,timeStepLength:0.1});
    Graphics.fillCSS('yellow');
    Graphics.vectorEllipse(sun,25);
}