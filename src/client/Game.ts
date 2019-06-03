import "phaser"
import { Main } from './scenes/Main'
import { Menu } from './scenes/Menu'
import { Preloader } from './scenes/Preloader'
import { WebSocketService } from './scenes/WebSocketService'
import { retrieveNameFromStorage } from './utils/HTMLUtils'
import { resizeCanvas } from "./utils/Utils"

export const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: "canvas",
    width: 650,
    height: 960,
    scene: [
        new Preloader(),
        new WebSocketService(),
        new Menu(),
        new Main()
    ]
}

const game = new Phaser.Game(config)
retrieveNameFromStorage()
game.events.once('ready', resizeCanvas)
