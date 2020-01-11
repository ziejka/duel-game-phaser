
import { BlendModes, GameObjects, Geom } from 'phaser'
import { Images } from '../config/images'
import { Main } from '../scenes/Main'

export class Aim extends GameObjects.Container {
    scene: Main
    private aim: GameObjects.Sprite

    constructor(scene: Main) {
        super(scene)
        this.scene = scene
        this.aim = scene.add.sprite(0, 0, Images.Aim)
        this.aim.on('pointerdown', scene.onAimClicked, scene)
        this.aim.setAlpha(0)
        this.add(this.aim)
    }

    enable({ x, y }: Phaser.Geom.Point): void {
        this.scene.tweens.add({
            targets: this.aim,
            alpha: 1,
            duration: 200,
            ease: 'Power1'
        })
        this.aim.setPosition(x, y)
        this.aim.setInteractive()
    }

    disable() {
        this.scene.tweens.add({
            targets: this.aim,
            alpha: 0,
            duration: 200,
            ease: 'Power1'
        })
        this.aim.disableInteractive()
    }

    private easeOutQuad(t: number) { return t * (2 - t) }
}
