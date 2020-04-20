# Installation
```
git clone https://github.com/Brent-Trenholme/Nodejs-Game-Engine
```

# Prerequisites:
## Electron
```
npm i electron -g
```

# Example
```js
const engine=require("./Nodejs-Game-Engine");
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

    timeStep({EntityRegistery}){
        EntityRegistery.getGroup("planets").forEntity((entity,uid)=>{
            if(uid!=this.uid){
                let d=entity.body.pos.copy().sub(this.body.pos);
                this.body.accelerate(d.setMag(0.1/d.mag()));
            }
        });
        let d=sun.copy().sub(this.body.pos);
        this.accelerate(d.setMag(0.1/d.mag()));
    }

    frame({Graphics}){
        Graphics.push();
        Graphics.fillCSS(this.colour);
        Graphics.vectorTransform(this.body.pos);
        Graphics.ellipse(0, 0, 25);
        Graphics.pop();
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
    EntityRegistery.frame("planets");
    Graphics.fillCSS('yellow');
    Graphics.vectorEllipse(sun,25);
}

```


# Running
```
electron .
```