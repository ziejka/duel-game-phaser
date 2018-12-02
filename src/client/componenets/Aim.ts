import * as Phaser from 'phaser'
import { Images } from '../config/images'
import { Main } from '../scenes/Main'

export class Aim extends Phaser.GameObjects.Sprite {
    constructor(scene: Main) {
        super(scene, 0, 0, Images.Aim)
        this.visible = false
        this.on('pointerdown', scene.callbacks.onAimClicked, scene)
        this.setInteractive()
    }
    hide(): any {
        this.visible = false
    }

    show(x: number, y: number): any {
        this.setPosition(x, y)
        this.visible = true
    }
}
