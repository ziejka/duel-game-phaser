import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { CountingStopped, RoundStartPayload } from '../../shared/types/types'
import { GameMenu } from '../componenets/gameMenu/gameMenu'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import { Scenes } from './scenes'
import { WebScoketService } from './WebScoketService'

const FRAME_RATE = 15

interface Callbacks {
    onMenuClick: () => void
    onBeginDuelClicked: () => void
}

enum Animations {
    idle = 'idle',
    ready = 'ready',
    shoot = 'shoot',
    dead = 'dead',
    won = 'won'
}

export class Main extends Phaser.Scene {
    callbacks: Callbacks
    player!: Phaser.GameObjects.Sprite
    private shouldUpdatePrice: boolean = false
    private gameMenu!: GameMenu
    private centerX!: number
    private centerY!: number
    private score!: Phaser.GameObjects.Text
    private price: number = 0
    private hitPoint!: Phaser.GameObjects.Arc

    constructor() {
        super(Scenes.Main)

        this.callbacks = {
            onMenuClick: this.onMenuClick,
            onBeginDuelClicked: this.onBeginDuelClicked
        }
    }

    create() {
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.add.sprite(this.centerX, this.centerY, 'bg').setScale(1.5)
        this.gameMenu = new GameMenu(this)
        this.add.existing(this.gameMenu)
        this.setUpEvents()
        this.player = this.createPlayer()
        this.score = this.add.text(400, 525, 'Price: 0')
        this.registry.set(RegistryFields.Price, this.price)
        this.score.visible = false
        this.hitPoint = this.createHitPoint()

        this.input.on('pointerdown', this.stopCounting, this)

        this.gameMenu.beginDuelBtn.visible = this.registry.get(RegistryFields.StartGameVisible)
    }

    update() {
        if (this.shouldUpdatePrice) {
            this.price++
            this.score.setText('Price: ' + this.price)
        }
    }

    private createHitPoint(): Phaser.GameObjects.Arc {
        const hitPoint = this.add.circle(0, 0, 20, 0x1388e8)
        hitPoint.visible = false
        hitPoint.on('pointerdown', this.onHitPoint, this)
        hitPoint.setInteractive()
        return hitPoint
    }

    private onHitPoint() {
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.hitPointClicked()
    }

    private stopCounting() {
        if (this.shouldUpdatePrice) {
            const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
            webScoketService.stopCounting()
        }
    }

    private createPlayer(): Phaser.GameObjects.Sprite {
        const player = this.add.sprite(this.centerX, this.centerY + 100, 'player')

        this.anims.create({
            key: Animations.idle,
            frames: this.anims.generateFrameNames('player', { start: 0, end: 4 }),
            repeat: -1,
            frameRate: FRAME_RATE
        })
        this.anims.create({
            key: Animations.ready,
            frames: this.anims.generateFrameNames('player', { start: 5, end: 7 }),
            frameRate: FRAME_RATE
        })
        this.anims.create({
            key: Animations.shoot,
            frames: this.anims.generateFrameNames('player', { start: 13, end: 15 }),
            frameRate: FRAME_RATE
        })
        this.anims.create({
            key: Animations.dead,
            frames: this.anims.generateFrameNames('player', { start: 31, end: 37 }),
            frameRate: FRAME_RATE
        })
        this.anims.create({
            key: Animations.won,
            frames: this.anims.generateFrameNames('player', { start: 16, end: 29 }),
            repeat: -1,
            frameRate: FRAME_RATE
        })
        player.anims.play(Animations.idle)
        player.on('animationcomplete', this.onAnimationCompleate, this)
        return player
    }

    private onAnimationCompleate(anim: Phaser.Animations.Animation, frame: any) {
        this.events.emit('animationcomplete_' + anim.key, anim, frame)
    }

    private setUpEvents() {
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.events.on(GameEvents.START_ROUND, this.startRound, this)
        webScoketService.events.on(GameEvents.ROND_LOST, this.roundLost, this)
        webScoketService.events.on(GameEvents.ROND_WON, this.roundWon, this)

        this.events.on('animationcomplete_shoot', () => { this.player.anims.play(Animations.won) }, this)

        this.registry.events.on('changedata', this.updateData, this)
    }

    private roundWon() {
        this.player.anims.play(Animations.shoot)
    }

    private roundLost() {
        this.player.anims.play(Animations.dead)
    }

    private updateData(parent: Phaser.Scene, key: string, data: any): void {
        if (key === RegistryFields.StartGameVisible) {
            this.gameMenu.beginDuelBtn.visible = data
        }
        if (key === RegistryFields.Price) {
            this.shouldUpdatePrice = false
            this.price = data.price
            this.score.setText('Price: ' + this.price)
            this.showHitPoint()
        }
    }

    private showHitPoint() {
        const x = Math.random() * (this.sys.canvas.width - 100) + 100
        const y = Math.random() * (this.sys.canvas.height - 100) + 100
        this.hitPoint.setPosition(x, y)
        this.hitPoint.visible = true
        this.player.anims.play(Animations.ready)
    }

    private startRound(payload: RoundStartPayload) {
        this.add.text(300, 0, `ROUND ${payload.roundNumber}`)
        this.score.visible = true
        this.shouldUpdatePrice = true
    }

    private onBeginDuelClicked(): void {
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.send({ type: MessageTypes.PLAYER_READY })
        this.gameMenu.beginDuelBtn.visible = false
    }

    private onMenuClick(): void {
        this.scene.start(Scenes.Menu)
    }
}
