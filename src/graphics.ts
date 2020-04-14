import { Vector2d } from "./vector";
export default class Graphics {
    instructions:Array<string>;
    RECTMODE:('CORNER'|'CENTER');
    constructor(){
        this.instructions=[];
        /** @typedef ('CORNER|'CENTER') the currently selected rect mode. */
        this.RECTMODE='CORNER';
    }
    instruct(instruction:string){
        this.instructions.push(instruction);
    }
    /**
     * Draws a rectangle on the canvas.
     * @param {number} x the x position of the rectangle.
     * @param {number} y the y position of the rectangle.
     * @param {number} w the width of the rectangle.
     * @param {number} h the height of the rectangle.
     * @returns {void}
     */
    rect(x: number, y: number, w: number, h: number) {
        switch(this.RECTMODE) {
            case 'CORNER':
                this.instruct(`fillRect(${x}, ${y}, ${w}, ${h});`);
                break;
            case 'CENTER':
                this.instruct(`fillRect(${x-w/2}, ${y-h/2}, ${w}, ${h});`);
                break;
        }
        this.stroke();
    }
    /**
    * Draws a rectangle on the canvas.
    * @param {Vector2d} v the position of the rectangle.
    * @param {number} w the width of the rectangle.
    * @param {number} h the height of the rectanlge.
    * @returns {void}
    */
    vectorRect(v:Vector2d, w:number, h:number) {
        this.rect(v.x,v.y,w,h);
    }
    /**
     * Clears a rectangular area on the canvas.
     * @param {number} x the x position of the rectangle.
     * @param {number} y the y position of the rectangle.
     * @param {number} w the width of the rectangle.
     * @param {number} h the height of the rectangle.
     * @returns {void}
     */
    clear(x: number, y:number, w: number, h: number) {
        switch(this.RECTMODE) {
            case 'CORNER':
                this.instruct(`clearRect(${x}, ${y}, ${w}, ${h});`);
                break;
            case 'CENTER':
                this.instruct(`clearRect(${x-w/2}, ${y-h/2}, ${w}, ${h});`);
                break;
        }
    }
    /**
     * Sets the fill colour to an rgba value.
     * @param {number} red A number between 0 and 255 determining how red the colour is.
     * @param {number} green A number between 0 and 255 determining how green the colour is.
     * @param {number} blue A number between 0 and 255 determining how blue the colour is.
     * @param {number} alpha A number between 0 and 1 determining how opaque the colour is.
     * @returns {void}
     */
    fillRGBA(red:number,green:number,blue:number,alpha:number){
        this.instruct(`fillStyle='rgba(${red},${green},${blue},${alpha})';`);
    }
    /**
     * Sets the fill colour to an rgb value.
     * @param {number} red A number between 0 and 255 determining how red the colour is.
     * @param {number} green A number between 0 and 255 determining how green the colour is.
     * @param {number} blue A number between 0 and 255 determining how blue the colour is.
     * @returns {void}
     */
    fillRGB(red:number,green:number,blue:number){
        this.instruct(`fillStyle='rgb(${red},${green},${blue})';`);
    }
    /**
     * Sets the fill colour to a CSS style.
     * @param {string} colour the CSS colour style.
     * @returns {void}
     */
    fillCSS(colour:string){
        this.instruct(`fillStyle='${colour}'`);
    }
    /**
     * Sets the stroke colour to an rgba value.
     * @param {number} red A number between 0 and 255 determining how red the colour is.
     * @param {number} green A number between 0 and 255 determining how green the colour is.
     * @param {number} blue A number between 0 and 255 determining how blue the colour is.
     * @param {number} alpha A number between 0 and 1 determining how opaque the colour is.
     * @returns {void}
     */
    strokeRGBA(red:number,green:number,blue:number,alpha:number){
        this.instruct(`strokeStyle='rgba(${red},${green},${blue},${alpha})';`);
    }
    /**
     * Sets the stroke colour to an rgba value.
     * @param {number} red A number between 0 and 255 determining how red the colour is.
     * @param {number} green A number between 0 and 255 determining how green the colour is.
     * @param {number} blue A number between 0 and 255 determining how blue the colour is.
     */
    strokeRGB(red:number,green:number,blue:number){
        this.instruct(`strokeStyle='rgb(${red},${green},${blue})';`);
    }
    /**
     * Sets the stroke colour to a CSS style.
     * @param {string} colour the CSS colour style.
     */
    strokeCSS(colour:string){
        this.instruct(`strokeStyle='${colour}';`);
    }
    /**
     * Sets the rect mode which will effect Graphics.rect, Graphics.clear, & Graphics.vector.rect.
     * 'CORNER': Makes the position of the rectangle it's top left corner.
     * 'CENTER': Makes the position of the rectanlge it's center.
     * @param {('CORNER'|'CENTER')} mode which mode to select.
     */
    rectMode(mode:('CORNER'|'CENTER')){
        this.RECTMODE=mode;
    }
    /**
     * Draws an arc on the canvas.
     * @param {number} x the x position of the arc.
     * @param {number} y the y position of the arc.
     * @param {number} rx the radius of the arc along the x axis.
     * @param {number} ry the radius of the arc along the y axis.
     * @param {number} rotation the rotation of the arc in radians.
     * @param {number} startAngle the starting angle of the arc in radians
     * @param {number} endAngle the ending angle of the arc in radians
     * @param {boolean} [antiClockwise=false] wether or not the arc will go counter clockwise.
     */
    arc(x:number, y:number, rx:number, ry:number, rotation:number, startAngle:number, endAngle:number, antiClockwise:boolean=false){
        this.beginPath();
        this.instruct(`ellipse(${x},${y},${rx},${ry},${rotation},${startAngle},${endAngle},${antiClockwise})`);
        this.closePath();
        this.fill();
        this.stroke();
    }
    /**
     * Draws an ellipse on the canvas.
     * @param {number} x the x position of the ellipse.
     * @param {number} y the y position of the ellipse.
     * @param {number} rx the radius of the ellipse along the x axis.
     * @param {number} [ry=rx] the radius of the ellipse along the y axis. 
     * @param {number} rotation the rotation of the ellipse in radians.
     */
    ellipse(x:number, y:number, rx:number, ry:number=rx, rotation?:number){
        this.arc(x,y,rx,ry,rotation||0,0,Math.PI*2);
    }
    /**
     * Draws an ellipse on the canvas.
     * @param {Vector2d} v the position of the rectangle. 
     * @param {number} rx it's radius along the x axis.
     * @param {number} ry it's radius along the y axis.
     * @param {number} rotation the rotation of the ellipse in radians.
     */
    vectorEllipse(v:Vector2d, rx:number, ry:number=rx, rotation?:number){
        this.ellipse(v.x,v.y,rx,ry,rotation||0);
    }
    /**
     * Fills the current path
     */
    fill(){
        this.instruct("fill();");
    }
    /**
     * Strokes the current path
     */
    stroke(){
        this.instruct("stroke();");
    }
    beginPath(){
        this.instruct("beginPath();")
    }
    closePath(){
        this.instruct("closePath();")
    }
}