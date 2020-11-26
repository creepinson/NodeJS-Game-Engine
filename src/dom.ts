import { Vector2d } from "./vector";

export class DOM {
    uid: number = 0;
    instructions: Array<string> = [];
    elements: { [key: number]: Element } = {};

    instruct(instruction: string) {
        this.instructions.push(instruction);
    }

    createElement(keys: Array<string>, ...values: Array<any>) {
        let options: { [key: string]: string } = {};
        values.forEach((v: any, i: number) => {
            options[keys[i].replace(/\s/g, "")] = v as string;
        });
        let id = this.uid++;
        let e: Element;
        switch (options.tag) {
            case "button":
                e = new Button(options);
                break;
            default:
                e = new Element(options);
        }
        e.id = id;
        this.elements[id] = e;
        this.instruct(`createElement(${JSON.stringify(e)});`);
        return e;
    }

    update() {
        for (let id in this.elements) {
            let e = this.elements[id];
            this.instruct(`updateElement(${e.id},${JSON.stringify(e)});`);
        }
    }
}

interface DOMOptions {
    pos?: Vector2d;
    innerText?: string;
    rotation?: number;
    width?: number;
    height?: number;
    borderRadius?: number;
}

interface ElementOptions extends DOMOptions {
    tag?: string;
}

class Element {
    id: number = -1;
    pos: Vector2d;
    tag: string;
    events: { [key: string]: Function } = {};
    innerText: string;
    rotation: number;
    width: number;
    height: number;
    borderRadius: number;

    constructor(options: ElementOptions) {
        this.pos = options.pos ?? new Vector2d();
        this.tag = options.tag ?? "";
        this.innerText = options.innerText ?? "";
        this.rotation = options.rotation ?? 0;
        this.width = options.width ?? 50;
        this.height = options.height ?? 50;
        this.borderRadius = options.borderRadius ?? 0;
    }
}

interface ButtonOptions extends DOMOptions {
    click?: Function;
}

export class Button extends Element {
    constructor(options: ButtonOptions) {
        super({ ...options, ...{ tag: "button" } });
        this.events["click"] = options.click ?? (() => {});
    }
}
