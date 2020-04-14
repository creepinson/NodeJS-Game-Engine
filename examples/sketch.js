const engine=require("..");
const {Keyboard,Mouse,Window}=engine.run({ setup, loop });
const {Graphics}=Window;
const {Entity2d, Vector2d}=engine;

class Point extends Entity2d {
    constructor(x,y,r){
        super(x,y);
        this.r=r;
    }
    show(){
        Graphics.fillCSS('orange');
        Graphics.vectorEllipse(this.pos,this.r);
    }
}

let point;

function setup() {
    Window.maximize();
    Window.center();
    point = new Point(Window.width*Math.random(),Window.height*Math.random(),25);
    point.accelerate(new Vector2d(1,0));
}

function loop() {
    Graphics.clear(0,0,Window.width,Window.height);
    point.update();
}