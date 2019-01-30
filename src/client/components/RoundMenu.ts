import * as Phaser from 'phaser'
import { gameText } from '../config/textStyles'
import { Main } from '../scenes/Main'
import { createMenuElement } from '../utils/Utils'

export class RoundMenu extends Phaser.GameObjects.Container {
    beginDuelBtn: Phaser.GameObjects.Text
    backBtn: Phaser.GameObjects.Text
    roundNumber: Phaser.GameObjects.Text
    private title: Phaser.GameObjects.Text

    constructor(scene: Main) {
        super(scene)

        const { onMenuClick, onBeginDuelClicked } = scene
        this.title = scene.add.text(15, 0, "MAIN SCENE", gameText)

        let pos = new Phaser.Geom.Point(400, 0)
        this.backBtn = createMenuElement(scene, 'BACK TO MENU', pos, onMenuClick)
        this.backBtn.setFontSize(16)

        pos = new Phaser.Geom.Point(scene.centerX - 100, scene.centerY - 200)
        this.beginDuelBtn = createMenuElement(scene, 'BEGIN DUEL!!!', pos, onBeginDuelClicked)

        this.roundNumber = scene.add.text(250, 0, `ROUND`, { color: '#000000' })
        this.roundNumber.visible = false

        this.add([this.title, this.backBtn, this.beginDuelBtn, this.roundNumber])
    }

    hide() {
        this.beginDuelBtn.visible = false
    }

    showRoundNumber(roundNumber: number) {
        this.roundNumber.visible = true
        this.roundNumber.setText(`ROUND ${roundNumber}`)
    }

}
