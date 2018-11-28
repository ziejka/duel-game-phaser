import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { RoundStartPayload } from '../../shared/types/types'
import { GameMenu } from '../componenets/gameMenu/gameMenu'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import { Scenes } from './scenes'
import { WebScoketService } from './WebScoketService'

interface Callbacks {
    onMenuClick: () => void
    onBeginDuelClicked: () => void
}

enum Animations {
    idle = 'idle',
    ready = 'ready',
    shoot = 'shoot',
    dead = 'dead'
}

export class Main extends Phaser.Scene {
    callbacks: Callbacks
    player!: Phaser.GameObjects.Sprite
    private gameMenu!: GameMenu
    private centerX!: number
    private centerY!: number

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

        this.gameMenu.beginDuelBtn.visible = this.registry.get(RegistryFields.sStartGameVisible)
    }

    private createPlayer(): Phaser.GameObjects.Sprite {
        const player = this.add.sprite(this.centerX, this.centerY + 100, 'player')

        this.anims.create({
            key: Animations.idle,
            frames: this.anims.generateFrameNames('player', { start: 0, end: 4 }),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: Animations.ready,
            frames: this.anims.generateFrameNames('player', { start: 5, end: 7 }),
            frameRate: 10
        })
        this.anims.create({
            key: Animations.shoot,
            frames: this.anims.generateFrameNames('player', { start: 5, end: 15 }),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: Animations.dead,
            frames: this.anims.generateFrameNames('player', { start: 31, end: 37 }),
            repeat: -1,
            frameRate: 10
        })
        player.anims.play('idle')
        return player
    }

    private setUpEvents() {
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.events.on(GameEvents.START_ROUND, this.startRound, this)

        this.registry.events.on('changedata', this.updateData, this)
    }

    private updateData(parent: Phaser.Scene, key: string, data: any): void {
        if (key === RegistryFields.sStartGameVisible) {
            this.gameMenu.beginDuelBtn.visible = data
        }
    }

    private startRound(payload: RoundStartPayload) {
        const info = this.add.text(300, 0, `ROUND ${payload.roundNumber}`)
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
