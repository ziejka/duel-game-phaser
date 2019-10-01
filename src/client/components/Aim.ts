
import { GameObjects } from 'phaser'
import { Main } from '../scenes/Main'

export class Aim extends GameObjects.Container {
    scene: Main
    private rewardBolb: GameObjects.Sprite

    constructor(scene: Main) {
        super(scene)
        this.scene = scene
        this.rewardBolb = this.createRewardBolb()
    }

    scaleReward(reward: number) {
        const scale = this.easeOutQuad(reward / 2000) + .2
        this.rewardBolb.setScale(scale)
    }

    enable() {
        this.rewardBolb.setInteractive()
    }

    disable() {
        this.rewardBolb.disableInteractive()
    }

    private easeOutQuad(t: number) { return t * (2 - t) }

    private createRewardBolb(): GameObjects.Sprite {
        const gx = new GameObjects.Graphics(this.scene),
            radius = 50
        gx.clear()
        gx.fillStyle(0xfdfdfd)
        gx.fillCircle(radius, radius, radius)
        gx.generateTexture("rewardBolb", radius * 2, radius * 2)
        const s = this.scene.add.sprite(this.scene.centerX, this.scene.centerY, "rewardBolb")
        s.on('pointerdown', this.scene.onAimClicked, this.scene)
        s.setInteractive()
        this.add(s)
        return s
    }
}
