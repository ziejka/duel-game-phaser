import "phaser"
import "phaser/plugins/spine/dist/SpinePlugin"
import { Main } from './scenes/Main'
import { Menu } from './scenes/Menu'
import { Preloader } from './scenes/Preloader'
import { SinglePlayerService } from './scenes/SinglePlayerService'
import { WebSocketService } from './scenes/WebSocketService'
import { retrieveNameFromStorage } from './utils/HTMLUtils'
import { resizeCanvas } from "./utils/Utils"

window.onload = () => {
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: "canvas",
        width: 650,
        height: 960,
        scene: [
            new Preloader(),
            new WebSocketService(),
            new SinglePlayerService(),
            new Menu(),
            new Main()
        ],
        plugins: {
            //@ts-ignore
            scene: [{ key: 'SpinePlugin', plugin: window.SpinePlugin, start: true, mapping: 'spine' }]
        },
        physics: {
            default: "arcade"
        }
    }

    let game = new Phaser.Game(config);
    retrieveNameFromStorage()
    // game.scale.resize(window.innerWidth, window.innerHeight);
    game.events.once('ready', resizeCanvas)
}