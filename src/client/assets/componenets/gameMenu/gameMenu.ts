import * as Phaser from 'phaser'
import { Main } from '../../../scenes/Main'
import { createMenuElement } from '../../../utils/Utils'

export class GameMenu extends Phaser.GameObjects.Container {
    beginDuelBtn: Phaser.GameObjects.Text
    backBtn: Phaser.GameObjects.Text
    private title: Phaser.GameObjects.Text

    constructor(scene: Main) {
        super(scene)

        const { onMenuClick, onBeginDuelClicked } = scene.callbacks
        this.title = scene.add.text(15, 15, "MAIN SCENE")

        let pos = new Phaser.Geom.Point(800, 15)
        this.backBtn = createMenuElement(scene, 'BACK TO MENU', pos, onMenuClick)

        pos = new Phaser.Geom.Point(322, 300)
        this.beginDuelBtn = createMenuElement(scene, 'BEGIN DUEL!!!', pos, onBeginDuelClicked)

        this.add([this.title, this.backBtn, this.beginDuelBtn])
    }

    hide() {
        this.visible = false
    }

}
