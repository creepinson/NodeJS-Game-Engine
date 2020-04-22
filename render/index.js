const {ipcRenderer}=require("electron");


/**
 * Initial setup
 */

const canvas=document.querySelector("canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const ctx=canvas.getContext('2d');
let mousex=0;
let mousey=0;

document.addEventListener("keydown",e=>ipcRenderer.send("keyboard",{ code: e.keyCode, state: true }));
document.addEventListener("keyup",e=>ipcRenderer.send("keyboard",{ code: e.keyCode, state: false }));
document.addEventListener("mousemove",e=>{
    if(mousex==e.x&&mousex.y==e.y)return;
    mousex=e.x;
    mousey=e.y;
    ipcRenderer.send("mousemove",{x:e.x, y:e.y});
});
document.addEventListener("mousedown",e=>{
    ipcRenderer.send("mousedown",{button:e.which});
})

ipcRenderer.on("resize",()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
});

/**
 * Graphics
 */

const TWO_PI=Math.PI*2;
//fill & stroke
function fill(){ctx.fill();};
function stroke(){ctx.stroke();};
function setFill(style){ctx.fillStyle=style;};
function setStroke(style){ctx.strokeStyle=style;};
function setFont(font){ctx.font=font;};
//primitive geometries
function fillRect(x,y,w,h){ctx.fillRect(x,y,w,h);};
function strokeRect(x,y,w,h){ctx.strokeRect(x,y,w,h);};
function rect(x,y,w,h){
    strokeRect(x,y,w,h);
    fillRect(x,y,w,h);
};
function clearRect(x,y,w,h){
    save();
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(x,y,w,h);
    restore();
};
//custom geometries & paths
function beginPath(){ctx.beginPath();};
function closePath(){ctx.closePath();};
function vertex(x,y){ctx.lineTo(x,y);};
function polygon(x,y,n,r){
    beginPath();
    for(let a=0;a<TWO_PI;a+=TWO_PI/n)
        vertex(r*Math.cos(a)+x,r*Math.sin(a)+y);
    closePath();
};
function ellipticalArc(x,y,rx,ry,a,s,e,c){ctx.ellipse(x,y,rx,ry,a,s,e,c)};
function ellipse(x,y,rx,ry){
    beginPath();
    ellipticalArc(x,y,rx,ry,0,0,TWO_PI,false);
    closePath();
};
//transforms
function translate(x,y){ctx.translate(x,y);};
function rotate(a){ctx.rotate(a);};
//misc
function save(){ctx.save();};
function restore(){ctx.restore();};
function fillText(s,x,y){ctx.fillText(s,x,y);};
function strokeText(s,x,y){ctx.strokeText(s,x,y);};

/**
 * DOM
 */

function createElement(options) {
    switch(options.tag) {
        case 'button' :
        let e=document.createElement('button');
        e.id=options.id;
        e.addEventListener("click",()=>ipcRenderer.send("element-click",{id:options.id}));
        e.style.position='absolute';
        e.style.left=`${options.pos.x===undefined?'0px':options.pos.x}`;
        e.style.top=`${options.pos.y===undefined?'0px':options.pos.y}`;
        e.innerText=options.text===undefined?'':options.text;
        document.body.appendChild(e);
        console.log(e);
        break;
    }
}

function updateElement(id,options) {
    let e=document.getElementById(id);
    e.style.left=`${options.pos.x}px`;
    e.style.top=`${options.pos.y}px`;
    e.innerText=options.innerText;
}

//let the main process know everthing is set up
ipcRenderer.send("ready");