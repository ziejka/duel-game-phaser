import * as Phaser from 'phaser'
import { Images } from '../config/images'
import { Main } from '../scenes/Main'

export class HitPoint extends Phaser.GameObjects.Sprite {
    constructor(scene: Main) {
        super(scene, 0, 0, Images.Aim)
        this.visible = false
        this.on('pointerdown', scene.callbacks.onHitPointClicked, scene)
        this.setInteractive()
    }

    show(x: number, y: number): any {
        this.setPosition(x, y)
        this.visible = true
    }
}
