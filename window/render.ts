/**
 * DOM
 */
let contexts:{[key:number]:CanvasRenderingContext2D}={};

function createElement(options:{tag:string,id:number,style?:{width?:string,height?:string},width?:number,height?:number}) {
    const e=document.createElement(options.tag);
    e.id=options.id.toString();
    e.style.width=options.style?.width??"";
    e.style.height=options.style?.height??"";
    (<any>e).width=options.width;
    (<any>e).height=options.height;
    document.body.appendChild(e);
}

function createContext(id:number) {
    contexts[id]=<CanvasRenderingContext2D>(<HTMLCanvasElement>document.getElementById(id.toString())).getContext("2d");
}

/**
 * Graphics 
 */

//primitive geometries
function fillRect(id:number,x:number,y:number,w:number,h:number){ contexts[id].fillRect(x,y,w,h); }
function strokeRect(id:number,x:number,y:number,w:number,h:number){ contexts[id].strokeRect(x,y,w,h); }
function line(id:number,x:number,y:number,x2:number,y2:number){
    beginPath(id);
    move(id,x,y);
    vertex(id,x2,y2);
    closePath(id);
}
function ellipse(id:number,x:number,y:number,rx:number,ry:number,a:number,s:number,e:number,c:boolean) {
    beginPath(id);
    contexts[id].ellipse(x,y,rx,ry,a,s,e,c);
    closePath(id);
}
function background(id:number) {
    save(id);
    reset(id);
    contexts[id].fillRect(0,0,contexts[id].canvas.width,contexts[id].canvas.height);
    restore(id);
}

//paths & custom geometries
function beginPath(id:number){ contexts[id].beginPath(); }
function closePath(id:number){ contexts[id].closePath(); }
function move(id:number,x:number,y:number) { contexts[id].moveTo(x,y); }
function vertex(id:number,x:number,y:number){ contexts[id].lineTo(x,y); }
function polygon(id:number,x:number,y:number,s:number,r:number,a:number){
    beginPath(id);
    for(let o=a;o<Math.PI*2+a;o+=Math.PI*2/s)vertex(id,r*Math.cos(o)+x,r*Math.sin(o)+y);
    closePath(id);
}

//styling
function fillCSS(id:number,css:string){ contexts[id].fillStyle=css; }
function strokeCSS(id:number,css:string){ contexts[id].strokeStyle=css; }
function fill(id:number){ contexts[id].fill(); }
function stroke(id:number){ contexts[id].stroke(); }

//transformation
function translate(id:number,x:number,y:number){ contexts[id].translate(x,y); }
function rotate(id:number,a:number){ contexts[id].rotate(a); }
function save(id:number){ contexts[id].save(); }
function restore(id:number){ contexts[id].restore(); }
function reset(id:number){ contexts[id].setTransform(1,0,0,1,0,0); }

//clearing
function clearRect(id:number,x:number,y:number,w:number,h:number){ contexts[id].clearRect(x,y,w,h); };
function clear(id:number){
    save(id);
    reset(id);
    clearRect(id,0,0,contexts[id].canvas.width,contexts[id].canvas.height);
    restore(id);
}