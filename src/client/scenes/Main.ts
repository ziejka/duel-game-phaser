import * as Phaser from 'phaser'
import { Events } from '../state/events'
import { GameState } from '../state/state'
import { createMenuElement } from '../utils/Utils'
import { Scenes } from './scenes'
import { WebScoketService } from './WebScoketService'

export class Main extends Phaser.Scene {
    private startGameBtn!: Phaser.GameObjects.Text

    constructor() {
        super(Scenes.Main)
    }

    create() {
        this.add.text(15, 15, "MAIN SCENE")

        let pos = new Phaser.Geom.Point(700, 15)
        this.add.existing(createMenuElement(this, 'BACK TO MENU', pos, this.onMenuClick))

        pos = new Phaser.Geom.Point(322, 300)
        this.startGameBtn = this.add.existing(createMenuElement(this, 'START GAME!!!', pos)) as Phaser.GameObjects.Text
        this.setStartVisibility()
        this.startGameBtn.visible = this.registry.get('startRequest')

        this.registry.events.on('changedata', this.updateData, this)

        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.events.on(Events.UPDATE_STATE, this.onUpdateState, this)
    }

    onUpdateState(newState: GameState): void {
        if (newState === GameState.READY) {
            this.setStartVisibility()
        }
    }

    private updateData(parent: Phaser.Scene, key: string, data: any): void {
        if (key === 'startRequest') {
            this.startGameBtn.visible = data
        }
    }

    private setStartVisibility() {
    }

    private onMenuClick(): void {
        this.scene.start(Scenes.Menu)
    }
}
