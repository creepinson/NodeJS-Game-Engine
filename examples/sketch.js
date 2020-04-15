const engine=require("..");
const {Keyboard,Mouse,Window,Graphics,EntityRegistery}=engine.run({ setup, loop });
const {Entity2d, Vector2d}=engine;

class Point extends Entity2d {
    constructor(x,y,r){
        super(x,y,{maxSpeed:100/60});
        this.r=r;
        this.colour=`rgb(${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},${Math.round(Math.random()*255)})`;
    }

    loop(er){
        for(let uid in er.entities)if(this.uid!=uid) {
            let difference=er.entities[uid].pos.copy().sub(this.pos);
            this.accelerate(difference.setMag(0.1/difference.mag()));
        }
        Graphics.fillCSS(this.colour);
        Graphics.vectorEllipse(this.pos,this.r);
    }

}

function setup() {
    Window.maximize();
    Window.center();
    for(let i=0;i<4;i++)EntityRegistery.addEntity(new Point(Math.round(Math.random()*Window.width),Math.round(Math.random()*Window.height),25));
}

function loop() {
    Graphics.clear(0,0,Window.width,Window.height);
    EntityRegistery.update();
}