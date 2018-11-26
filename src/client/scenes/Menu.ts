import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { createMenuElement } from '../utils/Utils'
import { Scenes } from './scenes'
import { WebScoketService } from './WebScoketService'

export class Menu extends Phaser.Scene {
    private centerX!: number
    private centerY!: number
    private mainMenu!: Phaser.GameObjects.Container
    private multiMenu!: Phaser.GameObjects.Container

    constructor() {
        super(Scenes.Menu)
    }

    create() {
        this.add.text(15, 15, "MENU SCENE")
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.mainMenu = this.createMainMenu()
        this.multiMenu = this.createMultiMenu()
    }

    private onPlayRandomClicked() {
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.send({ type: MessageTypes.NEW_GAME })
        this.scene.start(Scenes.Main)
    }

    private onMultClick(): void {
        this.mainMenu.visible = false
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.open()
        this.multiMenu.visible = true
    }

    private createMultiMenu() {
        const container = this.add.container(0, 0),
            playWithRanom = createMenuElement(this, 'Find oponent', this.createPosition(-25),
                this.onPlayRandomClicked),
            playWithFriend = createMenuElement(this, 'Play with friend', this.createPosition(0))

        container.add([playWithRanom, playWithFriend])
        container.visible = false
        return container
    }

    private createMainMenu(): Phaser.GameObjects.Container {
        const container = this.add.container(0, 0),
            multi = createMenuElement(this, 'Play multi', this.createPosition(-50), this.onMultClick),
            single = createMenuElement(this, 'Play single', this.createPosition(-25))

        container.add([multi, single])

        return container
    }

    private createPosition(yOffset: number): Phaser.Geom.Point {
        return new Phaser.Geom.Point(this.centerX, this.centerY + yOffset)
    }
}
