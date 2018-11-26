import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { RoundStartPayload } from '../../shared/types/types'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import { createMenuElement } from '../utils/Utils'
import { Scenes } from './scenes'
import { WebScoketService } from './WebScoketService'

export class Main extends Phaser.Scene {
    private beginDuelBtn!: Phaser.GameObjects.Text

    constructor() {
        super(Scenes.Main)
    }

    create() {
        this.createMenuButtons()
        this.setUpEvents()

    }

    private setUpEvents() {
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.events.on(GameEvents.START_ROUND, this.startRound, this)

        this.registry.events.on('changedata', this.updateData, this)
    }

    private createMenuButtons() {
        this.add.text(15, 15, "MAIN SCENE")

        let pos = new Phaser.Geom.Point(700, 15)
        this.add.existing(createMenuElement(this, 'BACK TO MENU', pos, this.onMenuClick))

        pos = new Phaser.Geom.Point(322, 300)
        this.beginDuelBtn = this.add.existing(
            createMenuElement(this, 'BEGIN DUEL!!!', pos, this.onBeginDuelClicked)) as Phaser.GameObjects.Text
        this.beginDuelBtn.visible = this.registry.get(RegistryFields.sStartGameVisible)
    }

    private updateData(parent: Phaser.Scene, key: string, data: any): void {
        if (key === RegistryFields.sStartGameVisible) {
            this.beginDuelBtn.visible = data
        }
    }

    private startRound(payload: RoundStartPayload) {
        this.add.text(300, 300, `ROUND ${payload.roundNumber} STARTED ! ! !`)
    }

    private onBeginDuelClicked(): void {
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.send({ type: MessageTypes.PLAYER_READY })
        this.beginDuelBtn.visible = false
    }

    private onMenuClick(): void {
        this.scene.start(Scenes.Menu)
    }
}
