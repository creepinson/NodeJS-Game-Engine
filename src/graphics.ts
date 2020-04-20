import { Vector2d } from "./vector";

export default class Graphics {
    RECTMODE:('CORNER'|'CENTER');
    doStroke:boolean=true;
    doFill:boolean=true;
    instructions:Array<string>=[];
    stack:Array<{RECTMODE:('CORNER'|"CENTER")}>;
    constructor() {
        /** @typedef ('CORNER|'CENTER') the currently selected rect mode. */
        this.RECTMODE='CORNER';
        this.stack=[];
    }
    instruct(instruction:string) {
        this.instructions.push(instruction);
    }
    /**
     * Draws a rectangle on the canvas.
     * @param {number} x the x position of the rectangle.
     * @param {number} y the y position of the rectangle.
     * @param {number} w the width of the rectangle.
     * @param {number} [h=w] the height of the rectangle.
     * @returns {void}
     */
    rect(x: number, y: number, w: number, h: number=w) {
        if(!this.doFill&&!this.doStroke)return;
        switch(this.RECTMODE) {
            case 'CORNER':
                if(this.doFill)this.instruct(`fillRect(${x}, ${y}, ${w}, ${h});`);
                if(this.doStroke)this.instruct(`strokeRect(${x},${y},${w},${h});`);
                break;
            case 'CENTER':
                if(this.doFill)this.instruct(`fillRect(${x-w/2}, ${y-h/2}, ${w}, ${h});`);
                if(this.doStroke)this.instruct(`strokeRect(${x-w/2},${y-h/2},${w},${h});`);
                break;
        }
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
        this.fillCSS(`rgba(${red},${green},${blue},${alpha})`);
    }
    /**
     * Sets the fill colour to an rgb value.
     * @param {number} red A number between 0 and 255 determining how red the colour is.
     * @param {number} green A number between 0 and 255 determining how green the colour is.
     * @param {number} blue A number between 0 and 255 determining how blue the colour is.
     * @returns {void}
     */
    fillRGB(red:number,green:number,blue:number){
        this.fillCSS(`rgb(${red},${green},${blue})`);
    }
    /**
     * Sets the fill colour to a CSS style.
     * @param {string} colour the CSS colour style.
     * @returns {void}
     */
    fillCSS(colour:string){
        this.instruct(`setFill('${colour}');`);
        this.doFill=true;
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
        this.strokeCSS(`rgba(${red},${green},${blue},${alpha})`);
    }
    /**
     * Sets the stroke colour to an rgba value.
     * @param {number} red A number between 0 and 255 determining how red the colour is.
     * @param {number} green A number between 0 and 255 determining how green the colour is.
     * @param {number} blue A number between 0 and 255 determining how blue the colour is.
     */
    strokeRGB(red:number,green:number,blue:number){
        this.strokeCSS(`rgb(${red},${green},${blue})`);
    }
    /**
     * Sets the stroke colour to a CSS style.
     * @param {string} colour the CSS colour style.
     */
    strokeCSS(colour:string){
        this.instruct(`setStroke('${colour}');`);
        this.doStroke=true;
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
    ellipticalArc(x:number, y:number, rx:number, ry:number, rotation:number, startAngle:number, endAngle:number, antiClockwise:boolean=false){
        if(!this.doFill&&!this.doStroke)return;
        this.instruct(`ellipticalArc(${x},${y},${rx},${ry},${rotation},${startAngle},${endAngle},${antiClockwise});`);
    }
    /**
     * Draws an ellipse on the canvas.
     * @param {number} x the x position of the ellipse.
     * @param {number} y the y position of the ellipse.
     * @param {number} rx the radius of the ellipse along the x axis.
     * @param {number} [ry=rx] the radius of the ellipse along the y axis. 
     */
    ellipse(x:number, y:number, rx:number, ry:number=rx){
        if(!this.doFill&&!this.doStroke)return;
        this.instruct(`ellipse(${x},${y},${rx},${ry});`);
        if(this.doFill)this.fill();
        if(this.doStroke)this.stroke();
    }
    /**
     * Draw a regular polygon on to the canvas.
     * @param {number} x the x position of the polygon's center.
     * @param {number} y the y position of the polygon's center.
     * @param {number} n the number of sides the polygon will have.
     * @param {number} r the radius of the polygon.
     */
    polygon(x:number,y:number,n:number,r:number) {
        if(!this.doFill&&!this.doStroke)return;
        this.instruct(`polygon(${x},${y},${n},${r});`);
        if(this.doFill)this.fill();
        if(this.doStroke)this.stroke();
    }
    /**
     * Draw text on to the canvas.
     * @param {string} s the text to draw.
     * @param {number} x the x position of the text.
     * @param {number} y the y position of the text. 
     */
    text(s:string,x:number,y:number) {
        if(!this.doFill&&!this.doStroke)return;
        if(this.doFill)this.instruct(`fillText('${s}',${x},${y});`);
        if(this.doStroke)this.instruct(`strokeText('${s}',${x},${y});`);
    }
    /**
     * Change the font of text.
     * @param {string} font the font to switch too.
     */
    font(font:string) {
        this.instruct(`setFont('${font}')`)
    }
    /**
     * Fills the current path
     */
    fill(){
        this.instruct("fill();");
    }
    /**
     * Remove fill from drawing.
     */
    noFill() {
        this.doFill=false;
    }
    /**
     * Strokes the current path
     */
    stroke(){
        this.instruct("stroke();");
    }
    /**
     * Remove stroke from drawing.
     */
    noStroke() {
        this.doStroke=false;
    }
    /**
     * Begin new path
     */
    beginPath(){
        this.instruct("beginPath();");
    }
    /**
     * Close current path
     */
    closePath(){
        this.instruct("closePath();");
    }
    /**
     * Add a vertex to the path.
     * @param {number} x the x position of the vertex.
     * @param {number} y the y position of the vertex.
     */
    vertex(x:number, y:number) {
        this.instruct(`vertex(${x},${y});`);
    }
    /**
     * Push current canvas sate
     */
    push() {
        this.instruct("save();");
        this.stack.push({
            RECTMODE:this.RECTMODE
        });
    }
    /**
     * Pop the top element from the canvas state stack
     */
    pop() {
        this.instruct("restore();");
        let r=this.stack.pop();
        this.RECTMODE=(r??{}).RECTMODE??this.RECTMODE;
    }
    /**
     * Translate the origin.
     * @param {number} x the x offset.
     * @param {number} y the y offset.
     */
    translate(x:number,y:number) {
        this.instruct(`translate(${x},${y});`);
    }
    /**
     * Rotate the drawing.
     * @param {number} angle the angle to rotate by.
     */
    rotate(angle:number) {
        this.instruct(`rotate(${angle});`);
    }
    /**
     * Translates and rotates according to the direction of the vector.
     */
    vectorTransform(v:Vector2d,options:{translate?:boolean,rotate?:boolean}={}) {
        if(options.translate)this.translate(v.x,v.y);
        if(options.rotate)this.rotate(v.angle());
    }
}