const {ipcRenderer}=require("electron");

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

ipcRenderer.on("resize",()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
});

ipcRenderer.send("ready");