
import { GameObjects, Geom, Game } from 'phaser'
import { Main } from '../scenes/Main'
import { Images } from '../config/images'

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
        this.createParticles()
    }

    createParticles() {
        const rect = new Phaser.Geom.Rectangle(10, 10, 300, 100)
        const particle = this.scene.add.particles(Images.Particle)
        particle.createEmitter({
            moveToX: this.aimCircle.x,
            moveToY: this.aimCircle.y,
            angle: 0,
            speed: 2000,//{ min: 2000, max: 5000 },
            scale: 0.4,
            lifespan: 1000,
            emitZone: { source: rect }
        })

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
