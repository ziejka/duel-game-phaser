import * as Phaser from 'phaser'
import { Images } from '../config/images'

const FRAME_RATE = 15
export enum PlayerAnims {
    idle = 'idle',
    ready = 'ready',
    shoot = 'shoot',
    dead = 'dead',
    won = 'won'
}

export class Player extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, centerX: number, centerY: number) {
        super(scene, centerX, centerY + 100, Images.Player)
        this.createAnimations()
        this.setupEvents()
    }

    private setupEvents() {
        this.scene.events.on('animationcomplete_shoot', () => { this.anims.play(PlayerAnims.won) }, this)
    }

    private createAnimations() {
        this.scene.anims.create({
            key: PlayerAnims.idle,
            frames: this.scene.anims.generateFrameNames(Images.Player, { start: 0, end: 4 }),
            repeat: -1,
            frameRate: FRAME_RATE
        })
        this.scene.anims.create({
            key: PlayerAnims.ready,
            frames: this.scene.anims.generateFrameNames(Images.Player, { start: 5, end: 7 }),
            frameRate: FRAME_RATE
        })
        this.scene.anims.create({
            key: PlayerAnims.shoot,
            frames: this.scene.anims.generateFrameNames(Images.Player, { start: 13, end: 15 }),
            frameRate: FRAME_RATE
        })
        this.scene.anims.create({
            key: PlayerAnims.dead,
            frames: this.scene.anims.generateFrameNames(Images.Player, { start: 31, end: 37 }),
            frameRate: FRAME_RATE
        })
        this.scene.anims.create({
            key: PlayerAnims.won,
            frames: this.scene.anims.generateFrameNames(Images.Player, { start: 16, end: 29 }),
            repeat: -1,
            frameRate: FRAME_RATE
        })
        this.anims.play(PlayerAnims.idle)
        this.on('animationcomplete', this.onAnimationComplete, this)
    }

    private onAnimationComplete(anim: Phaser.Animations.Animation, frame: any) {
        this.scene.events.emit('animationcomplete_' + anim.key, anim, frame)
    }
}
