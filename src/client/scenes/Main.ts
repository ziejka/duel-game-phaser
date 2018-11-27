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

export class Main extends Phaser.Scene {
    callbacks: Callbacks
    player!: Phaser.GameObjects.Sprite
    private gameMenu!: GameMenu

    constructor() {
        super(Scenes.Main)
        this.callbacks = {
            onMenuClick: this.onMenuClick,
            onBeginDuelClicked: this.onBeginDuelClicked
        }
    }

    create() {
        this.gameMenu = new GameMenu(this)
        this.add.existing(this.gameMenu)
        this.setUpEvents()
        this.player = this.createPlayer()

        this.gameMenu.beginDuelBtn.visible = this.registry.get(RegistryFields.sStartGameVisible)
    }

    private createPlayer(): Phaser.GameObjects.Sprite {
        const player = this.add.sprite(300, 300, 'cowboy')
        player.setScale(2)
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('cowboy', { start: 0, end: 7 }),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'shoot',
            frames: this.anims.generateFrameNames('cowboy', { start: 4, end: 7 }),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'kill',
            frames: this.anims.generateFrameNames('cowboy', { start: 27, end: 30 }),
            repeat: -1,
            frameRate: 10
        })
        player.anims.play('kill')
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
        const info = this.add.text(300, 15, `ROUND ${payload.roundNumber}`)
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
