
import { BlendModes, GameObjects, Geom } from 'phaser'
import { Images } from '../config/images'
import { Main } from '../scenes/Main'

export class Aim extends GameObjects.Container {
    scene: Main
    private aimCircle: GameObjects.Sprite
    private aimX: number
    private aimY: number

    constructor(scene: Main) {
        super(scene)
        this.scene = scene
        this.aimX = this.scene.centerX
        this.aimY = this.scene.centerY + 200
        this.aimCircle = this.createAim()
        this.resetAim()
    }

    scaleReward(reward: number) {
        const scale = this.easeOutQuad(reward / 2000) + .2
        this.aimCircle.setScale(scale)
        const { x, y } = this.getRandomAimPosition()
        this.scene.physics.moveTo(this.aimCircle, x, y, 50 * scale)
    }

    enable() {
        const b = this.aimCircle.body as Phaser.Physics.Arcade.Body
        const { x, y } = this.getRandomAimPosition()
        b.reset(x, y)
        this.aimCircle.setInteractive()
    }

    disable() {
        this.aimCircle.disableInteractive()
    }

    resetAim() {
        this.aimCircle.setPosition(this.aimX, this.aimY)
        this.aimCircle.setScale(.2)
    }

    private getRandomAimPosition(): Geom.Point {
        const x = Math.floor(Math.random() * (this.scene.sys.canvas.width - 200)) + 100
        const y = Math.floor(Math.random() * (this.scene.sys.canvas.height - 400)) + 200
        return new Geom.Point(x, y)
    }

    private easeOutQuad(t: number) { return t * (2 - t) }

    private createAim(): GameObjects.Sprite {
        const gx = new GameObjects.Graphics(this.scene),
            radius = 50
        gx.clear()
        gx.fillStyle(0xfdfdfd)
        gx.fillCircle(radius, radius, radius)
        gx.generateTexture("rewardBolb", radius * 2, radius * 2)
        const s = this.scene.physics.add.sprite(this.aimX, this.aimY, "rewardBolb")
        s.on('pointerdown', this.scene.onAimClicked, this.scene)
        s.setInteractive()
        this.add(s)
        return s
    }
}
