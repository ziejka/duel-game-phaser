import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { Message } from '../../shared/types/types'
import { MultiPlayerMenu } from '../components/MultiPlayerMenu'
import { menuText } from '../config/textStyles'
import { RegistryFields } from '../state/state'
import { createMenuElement } from '../utils/Utils'
import { Scenes } from './scenes'
import { WebSocketService } from './WebSocketService'

export class Menu extends Phaser.Scene {
    private centerX!: number
    private centerY!: number
    private mainMenu!: Phaser.GameObjects.Container
    private multiMenu!: MultiPlayerMenu
    private playersList!: Phaser.GameObjects.Container

    constructor() {
        super(Scenes.Menu)
    }

    create() {
        this.add.text(15, 15, "MENU SCENE", menuText)
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.mainMenu = this.createMainMenu()
        this.multiMenu = this.add.existing(new MultiPlayerMenu(this)) as MultiPlayerMenu
        this.playersList = this.createPlayerList()
        this.setupEvents()
    }

    createPosition(yOffset: number): Phaser.Geom.Point {
        return new Phaser.Geom.Point(this.centerX - 100, this.centerY + yOffset)
    }

    onPlayRandomClicked(): void {
        this.sendMsg({ type: MessageTypes.NEW_GAME })
        this.scene.start(Scenes.Main)
    }

    onPlayWithFriendClicked(): void {
        this.sendMsg({ type: MessageTypes.GET_LIST_OF_PLAYERS })
    }

    onStartMultiClick(): void {
        this.multiMenu.showMultiOptions()
    }

    openWebSocket(playerName: string): void {
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        webSocketService.open(playerName)
    }

    private setupEvents() {
        this.registry.events.on('changedata', this.updateData, this)
    }

    private updateData(parent: Phaser.Scene, key: string, data: any): void {
        if (key === RegistryFields.WaitingPlayersList) {
            this.updatePlayerList(data)
            this.mainMenu.visible = false
            this.multiMenu.visible = false
        }
    }

    private updatePlayerList(names: string[]) {
        names.forEach((name, index) => {
            const pos = new Phaser.Geom.Point(20, 100 + 20 * index)
            this.playersList.add(createMenuElement(this, name, pos, this.onSelectedPlayerClicked.bind(this, name)))
        })
        this.playersList.visible = true
    }

    private onSelectedPlayerClicked(name: string): void {
        this.sendMsg({ type: MessageTypes.GET_LIST_OF_PLAYERS, payload: name })
    }

    private sendMsg(msg: Message): void {
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        webSocketService.send(msg)
    }

    private onMultiClick(): void {
        this.mainMenu.visible = false
        this.multiMenu.showName()
    }

    private createMainMenu(): Phaser.GameObjects.Container {
        const container = this.add.container(0, 0),
            multi = createMenuElement(this, 'Play multi', this.createPosition(-50), this.onMultiClick),
            single = createMenuElement(this, 'Play single', this.createPosition(25))

        container.add([multi, single])

        return container
    }

    private createPlayerList(): Phaser.GameObjects.Container {
        return this.add.container(0, 0)
    }
}
