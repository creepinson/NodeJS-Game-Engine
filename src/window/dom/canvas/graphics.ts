import Canvas from "../canvas";
export default class Graphics {
    canvas:Canvas;
    doFill:boolean;
    doStroke:boolean;
    constructor(canvas:Canvas) {
        this.canvas=canvas;
        this.canvas.instructions+=`createContext(${this.canvas.id});`;
        this.doFill=true;
        this.doStroke=true;
    }
    instruct(method:string,...args:Array<any>) { this.canvas.instructions+=`${method}(${this.canvas.id},${args});`; }
    /**
     * Draw a rectangle
     * @param x the x position of the rectangle
     * @param y the y position of the rectangle
     * @param w the width of the rectangle
     * @param h the height of the rectangle
     */
    rect(x:number,y:number,w:number,h:number=w) {
        if(!this.doFill&&!this.doStroke)return;
        if(this.doFill)this.instruct("fillRect",x,y,w,h);
        if(this.doStroke)this.instruct("strokeRect",x,y,w,h);
    }
    /**
     * Disable fill
     */
    noFill() {
        this.doFill=false;
    }
    /**
     * Disable stroke
     */
    noStroke() {
        this.doStroke=false;
    }
    /**
     * Set the fill colour using css
     * @param css the css colour value to be set
     */
    fillCSS(css:string) {
        this.instruct("fillCSS",`"${css}"`);
        this.doFill=true;
    }
    /**
     * Set the fill colour to an RGB value
     * @param red amount of red
     * @param green amount of green
     * @param blue amount of blue
     */
    fillRGB(red:number,green:number,blue:number) {
        this.fillCSS(`rgb(${[red,green,blue]})`);
    }
    /**
     * Set the fill colour to an RGBA value
     * @param red amount of red
     * @param green amount of green
     * @param blue amount of blue
     * @param alpha amount of alpha
     */
    fillRGBA(red:number,green:number,blue:number,alpha:number) {
        this.fillCSS(`rgba(${[red,green,blue,alpha]})`);
    }
    /**
     * Set the stroke colour using css
     * @param css the css colour value to be set
     */
    strokeCSS(css:string) {
        this.instruct("strokeCSS",`"${css}"`);
        this.doStroke=true;
    }
    /**
     * Set the stroke colour to an RGB value
     * @param red amount of red
     * @param green amount of green
     * @param blue amount of blue
     */
    strokeRGB(red:number,green:number,blue:number) {
        this.strokeCSS(`rgb(${[red,green,blue]})`);
    }
    /**
     * Set the stroke colour to an RGBA value
     * @param red amount of red
     * @param green amount of green
     * @param blue amount of blue
     * @param alpha amount of alpha
     */
    strokeRGBA(red:number,green:number,blue:number,alpha:number) {
        this.strokeCSS(`rgba(${[red,green,blue,alpha]})`);
    }
    /**
     * Clear the entirity of the canvas
     */
    clear() {
        this.instruct("clear");
    }
    /**
     * Clear a section of the canvas
     * @param x the x coordinate of the rectangle to be cleared
     * @param y the y coordinate of the rectangle to be cleared
     * @param w the width of the rectangle to be cleared
     * @param h the height of the rectangle to be cleared
     */
    clearRect(x:number,y:number,w:number,h:number) {
        this.instruct("clearRect",x,y,w,h);
    }
    /**
     * Translate the origin of the canvas
     * @param x the shift in the x axis
     * @param y the shift in the y axis
     */
    translate(x:number,y:number) {
        this.instruct("translate",x,y);
    }
    /**
     * Rotate the canvas
     * @param rotation the angle to rotate by
     */
    rotate(rotation:number) {
        
    }
    /**
     * Save the current transformation matrix
     */
    push() {
        this.instruct("save");
    }
    /**
     * Restore the last stored transformation matrix
     */
    pop() {
        this.instruct("restore");
    }
    /**
     * Reset the transformation matrix
     */
    reset() {
        this.instruct("reset");
    }
    /**
     * Draw a line
     * @param x the x coordinate of the first point
     * @param y the y coordinate of the first point
     * @param x2 the x coordinate of the second point
     * @param y2 the y coordinate of the second point
     */
    line(x:number,y:number,x2:number,y2:number) {
        if(!this.doStroke)return;
        this.instruct("line",x,y,x2,y2);
        this.stroke();
    }
    /**
     * Fill the last drawn shape
     */
    fill() { if(this.doFill)this.instruct("fill"); }
    /**
     * Stroke the last drawn shape
     */
    stroke() { if(this.doStroke)this.instruct("stroke"); }
    /**
     * Draw a regular polygon
     * @param x the x coordinate of the polygon
     * @param y the y coordinate of the polygon
     * @param sides the number of sides the polygon will have
     * @param radius the radius of the polygon
     * @param rotation the angle the polygon will be rotated by
     */
    polygon(x:number,y:number,sides:number,radius:number,rotation=0) {
        if(!this.doFill&&!this.doStroke)return;
        this.instruct("polygon",x,y,sides,radius,rotation);
        this.fill();
        this.stroke();
    }
    /**
     * 
     * @param x 
     * @param y 
     * @param rx 
     * @param ry 
     * @param rotation 
     * @param start 
     * @param end 
     * @param counter 
     */
    ellipse(x:number,y:number,rx:number,ry:number=rx,rotation=0,start=0,end:number=Math.PI*2,counter=false) {
        if(!this.doFill&&!this.doStroke)return;
        this.instruct("ellipse",x,y,rx,ry,rotation,start,end,counter);
        this.fill();
        this.stroke();
    }
    background() {
        if(this.doFill)this.instruct("background");
    }
}