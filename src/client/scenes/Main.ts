import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { GameData, GameState } from '../state/state'
import { createMenuElement } from '../utils/Utils'
import { Scenes } from './scenes'
import { WebScoketService } from './WebScoketService'

export class Main extends Phaser.Scene {
    private startGameBtn!: Phaser.GameObjects.Text

    constructor() {
        super(Scenes.Main)
    }

    create() {
        this.createMenuButtons()
        this.registry.events.on('changedata', this.updateData, this)
    }

    private createMenuButtons() {
        this.add.text(15, 15, "MAIN SCENE")

        let pos = new Phaser.Geom.Point(700, 15)
        this.add.existing(createMenuElement(this, 'BACK TO MENU', pos, this.onMenuClick))

        pos = new Phaser.Geom.Point(322, 300)
        this.startGameBtn = this.add.existing(
            createMenuElement(this, 'START GAME!!!', pos, this.startGame)) as Phaser.GameObjects.Text
        this.startGameBtn.visible = this.registry.get(GameData.IsStartGameVisible)
    }

    private updateData(parent: Phaser.Scene, key: string, data: any): void {
        if (key === GameData.IsStartGameVisible) {
            this.startGameBtn.visible = data
        }
    }

    private startGame(): void {
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.send({ type: MessageTypes.PLAYER_READY })
        this.startGameBtn.visible = false
    }

    private onMenuClick(): void {
        this.scene.start(Scenes.Menu)
    }
}
