import { app } from "electron";
import { EventEmitter } from "events";
import Window from "./window";

let previousTick = Date.now();
let actualTicks = 0;

declare interface Engine {
    on(event: "ready", listener: () => void): this;
    on(event: "frame", listener: (frame: number) => void): this;
    on(event: "close", listener: () => void): this;
}

class Engine extends EventEmitter {
    windows: { [key: number]: Window };
    frameCount: number;
    closed: boolean;
    fps: number;
    _id = 0;
    constructor() {
        super();
        /** @typedef object the windows opened by the engine */
        this.windows = {};
        /** @typedef number the number of elapsed frames */
        this.frameCount = 0;
        /** @typedef boolean whether or not the engine is closed */
        this.closed = false;
        /** @typedef number the frames per second the engine will run at */
        this.fps = 30;
    }
    /**
     * Create a window then add it to the engine
     */
    createWindow() {
        const id = this._id++;
        const window = new Window(id);
        this.windows[id] = window;
        return window;
    }
    /**
     * Update the engine
     */
    async update() {
        if (this.closed) return;
        this.emit("frame", this.frameCount++);
        for (const id in this.windows) await this.windows[id].update();
    }
}

const engine = new Engine();

app.on("ready", () => {
    engine.emit("ready");
    frame();
});

app.on("before-quit", () => {
    engine.closed = true;
    engine.emit("close");
});

async function frame() {
    const now = Date.now();
    actualTicks++;
    if (previousTick + 1000 / engine.fps <= now) {
        const delta = (now - previousTick) / 1000;
        previousTick = now;
        await engine.update();
        actualTicks = 0;
    }
    if (!engine.closed) {
        if (Date.now() - previousTick < 1000 / engine.fps - 16) {
            setTimeout(frame);
        } else {
            setImmediate(frame);
        }
    }
}

export default engine;
