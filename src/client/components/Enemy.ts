
import { GameObjects } from 'phaser'
import { Images, Spine } from '../config/images'
import { Main } from '../scenes/Main'

export class Enemy extends GameObjects.Container {
    scene: Main
    private aim: GameObjects.Sprite
    private enemy: Phaser.GameObjects.Sprite

    constructor(scene: Main) {
        super(scene)
        this.scene = scene
        // @ts-ignore
        this.enemy = this.scene.add.spine(this.centerX, this.centerY, Spine.zombie, 'animation_idle', true)
        // @ts-ignore
        this.enemy.setSkinByName('zombie2')

        this.aim = scene.add.sprite(0, 0, Images.Aim)
        this.aim.on('pointerdown', scene.onAimClicked, scene)
        this.aim.setAlpha(0)
        this.add([this.enemy, this.aim])
        this.setPosition(this.scene.centerX, this.scene.centerY)
    }

    enable(): void {
        this.scene.tweens.add({
            targets: this.aim,
            alpha: 1,
            duration: 200,
            ease: 'Power1'
        })
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
}
