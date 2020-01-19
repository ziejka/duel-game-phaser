import * as Phaser from 'phaser'
import { Images } from '../config/images'
import { Main } from '../scenes/Main'

export class RoundMenu extends Phaser.GameObjects.Container {
    scene!: Main

    private roundNumber: Phaser.GameObjects.Text
    private menuButton: Phaser.GameObjects.Sprite

    constructor(scene: Main) {
        super(scene)

        this.menuButton = scene.add.sprite(0, 0, Images.Menu)
        this.menuButton.setPosition(scene.sys.canvas.width - this.menuButton.width + 20, this.menuButton.height / 2 + 7)
        this.menuButton.setInteractive()
        this.menuButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.onMenuClick, this)

        this.roundNumber = scene.add.text(250, 0, `ROUND`, {
            color: '#FFFFFF',
            stroke: "#000000",
            strokeThickness: 3,
            fontFamily: 'Lobster'
        })
        this.roundNumber.visible = false

        this.add([this.roundNumber])
    }

    onMenuClick() {
        this.menuButton.disableInteractive()
        this.scene.onMenuClick()
        this.scene.tweens.add({
            targets: this.menuButton,
            scale: 0.9,
            yoyo: true,
            duration: 100,
            ease: 'Power2',
            onComplete: () => this.menuButton.setInteractive()
        })
    }

    showRoundNumber(roundNumber: number) {
        this.roundNumber.visible = true
        this.roundNumber.setText(`ROUND ${roundNumber}`)
    }

}
