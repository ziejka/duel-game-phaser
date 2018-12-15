import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import * as TextStyles from '../config/textStyles'
import { createMenuElement } from '../utils/Utils'
import { Scenes } from './scenes'
import { WebSocketService } from './WebSocketService'

export class Menu extends Phaser.Scene {
    private centerX!: number
    private centerY!: number
    private mainMenu!: Phaser.GameObjects.Container
    private multiMenu!: Phaser.GameObjects.Container

    constructor() {
        super(Scenes.Menu)
    }

    create() {
        this.add.text(15, 15, "MENU SCENE", TextStyles.menuText)
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.mainMenu = this.createMainMenu()
        this.multiMenu = this.createMultiMenu()
    }

    private onPlayRandomClicked() {
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        webSocketService.send({ type: MessageTypes.NEW_GAME })
        this.scene.start(Scenes.Main)
    }

    private onMultiClick(): void {
        this.mainMenu.visible = false
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        webSocketService.open()
        this.multiMenu.visible = true
    }

    private createMultiMenu() {
        const container = this.add.container(0, 0),
            playWithRandom = createMenuElement(this, 'Find opponent', this.createPosition(-50),
                this.onPlayRandomClicked),
            playWithFriend = createMenuElement(this, 'Play with friend', this.createPosition(0))

        container.add([playWithRandom, playWithFriend])
        container.visible = false
        return container
    }

    private createMainMenu(): Phaser.GameObjects.Container {
        const container = this.add.container(0, 0),
            multi = createMenuElement(this, 'Play multi', this.createPosition(-50), this.onMultiClick),
            single = createMenuElement(this, 'Play single', this.createPosition(25))

        container.add([multi, single])

        return container
    }

    private createPosition(yOffset: number): Phaser.Geom.Point {
        return new Phaser.Geom.Point(this.centerX - 70, this.centerY + yOffset)
    }
}
