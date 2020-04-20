const TWO_PI=Math.PI*2;
//fill & stroke
function fill(){ctx.fill();};
function stroke(){ctx.stroke();};
function setFill(style){ctx.fillStyle=style;};
function setStroke(style){ctx.fillStroke=style;};
function setFont(font){ctx.font=font;};
//primitive geometries
function fillRect(x,y,w,h){ctx.fillRect(x,y,w,h);};
function strokeRect(x,y,w,h){ctx.strokeRect(x,y,w,h);};
function rect(x,y,w,h){strokeRect(x,y,w,h);fillRect();};
function clearRect(x,y,w,h){save();ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(x,y,w,h);restore();};
//custom geometries & paths
function beginPath(){ctx.beginPath();};
function closePath(){ctx.closePath();};
function vertex(x,y){ctx.lineTo(x,y);};
function polygon(x,y,n,r){beginPath();for(let a=0;a<TWO_PI;a+=TWO_PI/n)vertex(r*Math.cos(a)+x,r*Math.sin(a)+y);closePath();};
function ellipticalArc(x,y,rx,ry,a,s,e,c){ctx.ellipse(x,y,rx,ry,a,s,e,c)};
function ellipse(x,y,rx,ry){beginPath();ellipticalArc(x,y,rx,ry,0,0,TWO_PI);closePath();};
//transforms
function translate(x,y){ctx.translate(x,y);};
function rotate(a){ctx.rotate(a);};
//misc
function save(){ctx.save();};
function restore(){ctx.restore();};
function fillText(s,x,y){ctx.fillText(s,x,y);};
function strokeText(s,x,y){ctx.strokeText(s,x,y);};