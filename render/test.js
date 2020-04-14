let events=0;
let start=Date.now();
document.addEventListener("mousemove",()=>{
    events++;
    if(events==1000){
        alert((Date.now()-start)/1000);
    };
});