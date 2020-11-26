import Graphics from './graphics'
import { World, Body, CircleBody, RectBody, PolygonBody } from './physics/index'
import { DOM, Button } from './dom'
import { Vector } from '@throw-out-error/throw-out-utils'

let win: any,
	started: boolean = false,
	setup: Function | undefined,
	loop: Function | undefined,
	mousePressed: Function | undefined,
	winClosed: boolean = false

const G: Graphics = new Graphics(),
	W: World = new World(G),
	D: DOM = new DOM()

const errIfNotStart = (): void => {
	if (!started) throw new Error("Can't call this method before the app starts")
}

const send = (channel: string, data?: any): void => {
	errIfNotStart()
	if (winClosed) return
	win.webContents.send(channel, data)
}

const Window = {
	width: 0,
	height: 0,
	/**
     * Resize the window.
     * @param {number} w the window's new width.
     * @param {number} h the window's new height.
     * @returns {void}
     */
	size(w: number, h: number) {
		errIfNotStart()
		if (winClosed) return
		win.setSize(w, h)
		send('resize')
		this.width = w
		this.height = h
	},
	/**
     * Reposition the window
     * @param {number} x
     * @param y
     */
	position(x: number, y: number) {
		errIfNotStart()
		if (winClosed) return
		win.setPosition(x, y)
	},
	/**
     * Centers the window in the middle of the screen
     * @returns {void}
     */
	center() {
		errIfNotStart()
		if (winClosed) return
		win.center()
	},
	/**
     * Maximize the size of the window
     * @returns {void}
     */
	maximize() {
		errIfNotStart()
		if (winClosed) return
		win.maximize()
		send('resize')
		let bounds = win.webContents.getOwnerBrowserWindow().getBounds()
		this.width = bounds.width
		this.height = bounds.height
	},
}

const Keyboard = {
	/**@typedef object an object containing booleans representitive of whether or not the key corrsponding to the index is pressed down */
	keys: {} as { [key: string]: boolean },
	/**
     * Returns true if the key is down otherwise false
     * @param {(string|number)} code the ascii value or name of the key
     * @returns {boolean}
     */
	isKeyDown(code: string | number): boolean {
		return !!this.keys[code]
	},
}

const Mouse = new class Mouse extends Vector {
	constructor() {
		super()
	}
}()

function start(): void {
	const { app, BrowserWindow, ipcMain } = require('electron')
	app.on('ready', () => {
		win = new BrowserWindow({
			frame: false,
			webPreferences: {
				nodeIntegration: true,
			},
		})
		win.loadFile(`${__dirname}/../render/index.html`)
		win.on('closed', () => (winClosed = true))
		let size = win.getSize()
		Window.width = size[0]
		Window.height = size[1]
		ipcMain.on('ready', () => {
			started = true
			if (setup instanceof Function) setup()
			frame()
		})
		ipcMain.on('keyboard', (e: any, data: { code: number; state: boolean }) => {
			Keyboard.keys[data.code] = data.state
			if (data.code >= 65 && data.code <= 90)
				Keyboard.keys[String.fromCharCode(data.code).toLowerCase()] = data.state
		})
		ipcMain.on('mousemove', (e: any, data: { x: number; y: number }) => {
			Mouse.x = data.x
			Mouse.y = data.y
		})
		ipcMain.on('mousedown', (e: any, data: { button: number }) => {
			if (mousePressed instanceof Function) mousePressed(data.button)
		})
		ipcMain.on('element-click', (e: any, data: { id: number }) => {
			let click = D.elements[data.id].events.click
			if (click instanceof Function) click()
		})
	})
}

async function frame() {
	if (winClosed) return
	if (loop instanceof Function) loop()
	D.update()
	await win.webContents.executeJavaScript(`${G.instructions.join('\n')}\n${D.instructions.join('\n')}`)
	G.instructions = []
	D.instructions = []
	setTimeout(frame, 1000 / 30)
}

/**
 * Run the game engine.
 * @param {object} options the configuration of the game.
 * @param {Function} options.setup a function that's called when the game starts.
 * @param {Function} options.loop a function that's called each frame.
 */
export function run(options: { setup?: Function; loop?: Function; mousePressed?: (button: number) => void }) {
	if (started) throw new Error('The app has already started')
	start()
	setup = options.setup
	loop = options.loop
	mousePressed = options.mousePressed
	return {
		Keyboard,
		Window,
		Mouse,
		Graphics: G,
		World: W,
		DOM: D,
	}
}

export { Vector, Body, CircleBody, PolygonBody, RectBody, Button, World, Graphics }
