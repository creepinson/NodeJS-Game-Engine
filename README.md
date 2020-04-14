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
const {Window}=require("./Nodejs-Game-Engine").run({setup, loop});
const {Graphics}=Window;

let x;
let y;

function setup() {
    x=Math.random()*100;
    y=Math.random()*100;
};

function loop() {
    Graphics.ellipse(x,y,25);
};

```


# Running
```
electron .
```