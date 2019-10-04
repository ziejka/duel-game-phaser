
import { GameObjects, Geom } from 'phaser'
import { Main } from '../scenes/Main'

export class Aim extends GameObjects.Container {
    scene: Main
    private rewardBolb: GameObjects.Sprite
    private bolbX: number
    private bolbY: number

    constructor(scene: Main) {
        super(scene)
        this.scene = scene
        this.bolbX = this.scene.centerX
        this.bolbY = this.scene.centerY + 200
        this.rewardBolb = this.createRewardBolb()
    }

    scaleReward(reward: number) {
        const scale = this.easeOutQuad(reward / 2000) + .2
        this.rewardBolb.setScale(scale)
        const { x, y } = this.getRandomBolbPosition()
        this.scene.physics.moveTo(this.rewardBolb, x, y, 50 * scale)
    }

    enable() {
        const b = this.rewardBolb.body as Phaser.Physics.Arcade.Body
        const { x, y } = this.getRandomBolbPosition()
        b.reset(x, y)
        this.rewardBolb.setInteractive()
    }

    disable() {
        this.rewardBolb.disableInteractive()
    }

    private getRandomBolbPosition(): Geom.Point {
        const x = Math.floor(Math.random() * (this.scene.sys.canvas.width - 200)) + 100
        const y = Math.floor(Math.random() * (this.scene.sys.canvas.height - 400)) + 200
        return new Geom.Point(x, y)
    }

    private easeOutQuad(t: number) { return t * (2 - t) }

    private createRewardBolb(): GameObjects.Sprite {
        const gx = new GameObjects.Graphics(this.scene),
            radius = 50
        gx.clear()
        gx.fillStyle(0xfdfdfd)
        gx.fillCircle(radius, radius, radius)
        gx.generateTexture("rewardBolb", radius * 2, radius * 2)
        const s = this.scene.physics.add.sprite(this.bolbX, this.bolbY, "rewardBolb")
        s.on('pointerdown', this.scene.onAimClicked, this.scene)
        s.setInteractive()
        this.add(s)
        return s
    }
}

/***
 * TODO:
 * http://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\electric.js
 * http://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\death%20zone%20from%20arcade%20body.js
 * */
