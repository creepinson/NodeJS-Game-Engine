import Element from "./element";
import {options} from "./element";
import Graphics from "./canvas/graphics";

interface CanvasOptions extends options {
    width?:number;
    height?:number;
}

export default class Canvas extends Element {
    width?:number;
    height?:number;
    constructor(options:CanvasOptions={}) {
        super("canvas",options);
        this.width=options.width;
        this.height=options.height;
    }
}