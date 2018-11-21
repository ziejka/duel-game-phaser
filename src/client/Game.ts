import "phaser"
import { Main } from './scenes/Main'
import { Preloader } from './scenes/Preloader'

const config: GameConfig = {
    type: Phaser.AUTO,
    parent: "canvas",
    width: 960,
    height: 540,
    scene: [
        Preloader,
        Main
    ]
}

const game = new Phaser.Game(config)
