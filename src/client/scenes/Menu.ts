import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { Message } from '../../shared/types/types'
import { ButtonText } from '../components/ButtonText'
import { MultiPlayerMenu } from '../components/MultiPlayerMenu'
import { menuText } from '../config/textStyles'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import { hideDuelInvite, hideWaiting, showDuelInvite } from '../utils/HTMLUtils'
import { Scenes } from './scenes'
import { WebSocketService } from './WebSocketService'

export class Menu extends Phaser.Scene {
    private centerX!: number
    private centerY!: number
    private mainMenu!: Phaser.GameObjects.Container
    private multiMenu!: MultiPlayerMenu
    private connected: boolean = false

    constructor() {
        super(Scenes.Menu)
    }

    create() {
        this.add.text(15, 15, "MENU SCENE", menuText)
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.mainMenu = this.createMainMenu()
        this.multiMenu = this.add.existing(new MultiPlayerMenu(this)) as MultiPlayerMenu
        this.setupEvents()
        if (this.connected) {
            this.onConnected()
            this.multiMenu.show(true)
        } else {
            this.onMultiClick()
        }
    }

    createPosition(yOffset: number): Phaser.Geom.Point {
        return new Phaser.Geom.Point(this.centerX - 100, this.centerY + yOffset)
    }

    openWebSocket(playerName: string): void {
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        webSocketService.open(playerName)
    }

    sendMsg(msg: Message): void {
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        webSocketService.send(msg)
    }

    duelAccepted(): void {
        const msg: Message = {
            type: MessageTypes.DUEL_ACCEPTED
        }
        this.sendMsg(msg)
    }

    duelRejected(): void {
        const msg: Message = {
            type: MessageTypes.DUEL_REJECTED
        }
        this.sendMsg(msg)
    }

    private setupEvents() {
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        this.registry.events.on('changedata', this.updateData, this)
        webSocketService.events.on(GameEvents.AVAILABLE_PLAYER_RESPONSE, this.onAvailablePlayersResponse, this)
        webSocketService.events.on(GameEvents.DUEL_ACCEPTED, this.onDuelAccepted, this)
        webSocketService.events.on(GameEvents.DUEL_REJECTED, this.onDuelRejected, this)
        webSocketService.events.on(GameEvents.CONNECTED, this.onConnected, this)
    }

    private onConnected() {
        this.connected = true
        this.sendMsg({ type: MessageTypes.GET_LIST_OF_PLAYERS })
    }

    private onDuelRejected(): void {
        hideWaiting()
        hideDuelInvite()
    }

    private onDuelAccepted(): void {
        hideWaiting()
        this.scene.start(Scenes.Main)
    }

    private onAvailablePlayersResponse(playerList: string[]) {
        this.mainMenu.setVisible(false)
        this.multiMenu.updatePlayerList(playerList)
    }

    private updateData(parent: Phaser.Scene, key: string, data: any): void {
        if (key === RegistryFields.UserData) {
            this.multiMenu.createName(data.name)
            return
        }
        if (key === RegistryFields.EnemyName) {
            showDuelInvite(data)
        }
    }

    private onMultiClick(): void {
        this.mainMenu.setVisible(false)
        this.multiMenu.show()
    }

    private createMainMenu(): Phaser.GameObjects.Container {
        const container = this.add.container(0, 0),
            multi = new ButtonText(this, 'Play multi', this.createPosition(-70), this.onMultiClick),
            single = new ButtonText(this, 'Play single', this.createPosition(55))

        container.add([multi, single])

        return container
    }
}
