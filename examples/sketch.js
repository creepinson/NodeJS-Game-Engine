const engine=require("..");
const {Keyboard,Mouse,Window}=engine.run({ setup, loop });
const {Graphics}=Window;
const {Entity2d, Vector2d}=engine;

function setup() {
    Window.maximize();
    Window.center();
}

function loop() {
    Graphics.clear(0,0,Window.width,Window.height);
    Graphics.ellipse(10,10,10);
}