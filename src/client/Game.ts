import "phaser"
import { Main } from './scenes/Main'
import { Menu } from './scenes/Menu'
import { Preloader } from './scenes/Preloader'
import { WebScoketService } from './scenes/WebScoketService'

const config: GameConfig = {
    type: Phaser.AUTO,
    parent: "canvas",
    width: 960,
    height: 540,
    scene: [
        Preloader,
        WebScoketService,
        Menu,
        Main
    ]
}

const game = new Phaser.Game(config)
