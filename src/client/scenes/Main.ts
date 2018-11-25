import * as Phaser from 'phaser'
import { Events } from '../state/events'
import { GameState } from '../state/state'
import { createMenuElement } from '../utils/Utils'
import { GameScenes } from './scenes'

export class Main extends Phaser.Scene {
    private startGameBtn!: Phaser.GameObjects.Text

    constructor() {
        super(GameScenes.Main)
    }

    create() {
        this.add.text(15, 15, "MAIN SCENE")

        let pos = new Phaser.Geom.Point(700, 15)
        this.add.existing(createMenuElement(this, 'BACK TO MENU', pos, this.onMenuClick))

        pos = new Phaser.Geom.Point(322, 300)
        this.startGameBtn = this.add.existing(createMenuElement(this, 'START GAME!!!', pos)) as Phaser.GameObjects.Text
        this.startGameBtn.visible = false

        const menuScene = this.scene.get(GameScenes.Menu)

        menuScene.events.on(Events.UPDATE_STATE, this.onUpdateState, this)
    }

    onUpdateState(newState: GameState) {
        if (newState === GameState.READY) {
            this.startGameBtn.visible = true
        }
    }

    private onMenuClick(): void {
        this.scene.start(GameScenes.Menu)
    }
}
