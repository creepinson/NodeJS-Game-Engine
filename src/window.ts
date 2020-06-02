import { BrowserWindow } from "electron";
import path from "path";
import { EventEmitter } from "events";
import Element from "./window/dom/element";

declare interface Window {
    on(event: "ready", listener: () => void): this;
}

class Window extends EventEmitter {
    browser: BrowserWindow;
    x: number;
    y: number;
    width: number;
    height: number;
    instructions: string;
    dom: { [key: number]: Element };
    id: number;
    _id = 0;
    constructor(id: number) {
        super();
        /** @typedef BrowserWindow The Electron BrowserWindow instance */
        this.browser = new BrowserWindow({
            frame: false,
            webPreferences: {
                nodeIntegration: true,
            },
            show: false,
        });
        this.browser.loadFile(path.join(__dirname, "window", "render.html"));
        this.browser.on("ready-to-show", () => {
            this.browser.show();
        });
        const bounds = this.browser.getBounds();
        /** @typedef number the x coordinate of the top left corner of the window in pixels */
        this.x = bounds.x;
        /** @typedef number the y coordinate of the top left corner of the window in pixels */
        this.y = bounds.y;
        /** @typedef number the width of the window in pixels */
        this.width = bounds.width;
        /** @typedef number the height of the window in pixels */
        this.height = bounds.height;
        /** @typedef string a string of js code to be interpreted by the window which is cleared each frame */
        this.instructions = "";
        /** @typedef Array.<Element> the array of elements added to the window */
        this.dom = {};
        this.id = id;
    }
    /**
     * Update the window
     */
    async update() {
        this.instructions += `${Object.entries(this.dom).map(
            ([id, element]) => element.instructions
        )}`;
        await this.browser.webContents.executeJavaScript(this.instructions);
        for (const id in this.dom) this.dom[id].instructions = "";
        this.instructions = "";
    }
    /**
     * Add an element to the body of the window
     * @param element the element to be added
     */
    addElement(element: Element) {
        const id = this._id++;
        element.id = id;
        this.dom[id] = element;
        const options = {
            id,
            tag: element.tag,
            style: element.style,
            width: (<any>element).width,
            height: (<any>element).height,
        };
        this.instructions += `createElement(${JSON.stringify(options)});`;
    }
}

export default Window;
