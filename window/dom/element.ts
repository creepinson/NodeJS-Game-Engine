export default class Element {
    tag:string;
    id:number|undefined;
    style:style;
    instructions:string;
    constructor(tag:string,options:options={}) {
        /** @typedef string the tag of element */
        this.tag=tag;
        /** @typedef object an object holding css properties */
        this.style=options.style??{};
        /** @typedef string a string of js code to be interpreted by the window which is cleared each frame */
        this.instructions="";
    }
}

export interface style {
    width?:string;
    height?:string;
}

export interface options {
    style?:style;
}