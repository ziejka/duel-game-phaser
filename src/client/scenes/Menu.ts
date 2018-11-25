import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { createMenuElement } from '../utils/Utils'
import { openWebSoket, sendMsg } from '../webSocket/webSocket'
import { GameScenes } from './scenes'

export class Menu extends Phaser.Scene {
    private centerX!: number
    private centerY!: number
    private mainMenu!: Phaser.GameObjects.Container
    private multiMenu!: Phaser.GameObjects.Container

    constructor() {
        super(GameScenes.Menu)
    }

    create() {
        this.add.text(15, 15, "MENU SCENE")
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.mainMenu = this.createMainMenu()
        this.multiMenu = this.createMultiMenu()
    }

    private onPlayRandomClicked() {
        sendMsg({ type: MessageTypes.NEW_GAME })
        this.scene.start(GameScenes.Main)
    }

    private createMultiMenu() {
        const container = this.add.container(0, 0),
            playWithRanom = createMenuElement(this, 'Find oponent', this.createPosition(-25),
                this.onPlayRandomClicked.bind(this)),
            playWithFriend = createMenuElement(this, 'Play with friend', this.createPosition(0))

        container.add([playWithRanom, playWithFriend])
        container.visible = false
        return container
    }

    private onMultClick(): void {
        this.mainMenu.visible = false
        openWebSoket(this.events.emit.bind(this.events))
        this.multiMenu.visible = true
    }

    private createMainMenu(): Phaser.GameObjects.Container {
        const container = this.add.container(0, 0),
            multi = createMenuElement(this, 'Play multi', this.createPosition(-50), this.onMultClick.bind(this)),
            single = createMenuElement(this, 'Play single', this.createPosition(-25))

        container.add([multi, single])

        return container
    }

    private createPosition(yOffset: number): Phaser.Geom.Point {
        return new Phaser.Geom.Point(this.centerX, this.centerY + yOffset)
    }
}
