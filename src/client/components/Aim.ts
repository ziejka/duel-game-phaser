import * as Phaser from 'phaser'
import { Images } from '../config/images'
import { Main } from '../scenes/Main'

export class Aim extends Phaser.GameObjects.Sprite {
    constructor(scene: Main) {
        super(scene, 0, 0, Images.Aim)
        this.visible = false
        this.on('pointerdown', scene.onAimClicked, scene)
        this.setInteractive()
    }
    hide(): any {
        this.visible = false
    }

    show(): any {
        const x = Math.floor(Math.random() * (this.scene.sys.canvas.width - 200)) + 100
        const y = Math.floor(Math.random() * (this.scene.sys.canvas.height - 200)) + 100
        this.setPosition(x, y)
        this.visible = true
    }
}
