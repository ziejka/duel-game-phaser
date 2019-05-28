import "phaser"
import { Main } from './scenes/Main'
import { Menu } from './scenes/Menu'
import { Preloader } from './scenes/Preloader'
import { WebSocketService } from './scenes/WebSocketService'
import { retrieveNameFromStorage } from './utils/HTMLUtils'

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "canvas",
    width: 540,
    height: 960,
    scene: [
        new Preloader(),
        new WebSocketService(),
        new Menu(),
        new Main()
    ]
}

const R: number = (config.width as integer) / (config.height as integer)
const resize = () => {
    const canvas = document.querySelector("canvas")
    const overlay = document.getElementById("overlay")
    if (!canvas) {
        return
    }
    let width: number = config.width as integer,
        height: number = config.height as integer

    const ratio = window.innerWidth / window.innerHeight

    if (ratio < R) {
        height = height * window.innerWidth / width
        width = window.innerWidth
    } else {
        height = window.innerHeight
        width = width * window.innerHeight / height
    }

    const scale = Math.min(height / (config.height as number))

    const transformValue = `translate(-50%, -50%) scale(${scale})`
    canvas.style.transform = transformValue
    canvas.style.webkitTransform = transformValue
    if (!overlay) {
        return
    }
    overlay.style.transform = transformValue
    overlay.style.webkitTransform = transformValue
}

const game = new Phaser.Game(config)
window.addEventListener('resize', resize)
game.events.once('ready', resize)
retrieveNameFromStorage()

// DEBUG ONLY
declare global {
    interface Window { log: any }
}
window.log = window.log || {}
