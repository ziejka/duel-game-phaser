import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { MainSceneData, Message, PlayerInfo } from '../../shared/types/types'
import { ButtonText } from '../components/ButtonText'
import { MultiPlayerMenu } from '../components/MultiPlayerMenu'
import { RoundMenu } from '../components/RoundMenu'
import { Images } from '../config/images'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import { hideDuelInvite, hideWaiting, showDuelInvite } from '../utils/HTMLUtils'
import { Scenes } from './scenes'
import { SinglePlayerService } from './SinglePlayerService'
import { WebSocketService } from './WebSocketService'

export class Menu extends Phaser.Scene {
    private centerX!: number
    private centerY!: number
    private mainMenu!: Phaser.GameObjects.Container
    private multiMenu!: MultiPlayerMenu

    constructor() {
        super(Scenes.Menu)
    }

    create() {
        this.cameras.main.backgroundColor.setTo(42, 65, 82)
        this.centerX = Math.floor(this.sys.canvas.width / 2)
        this.centerY = Math.floor(this.sys.canvas.height / 2)
        this.add.sprite(this.centerX, this.centerY, Images.Splash)
        this.mainMenu = this.createMainMenu()
        this.multiMenu = this.add.existing(new MultiPlayerMenu(this)) as MultiPlayerMenu
        this.add.existing(new RoundMenu(this))

        this.setupEvents()
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService

        if (webSocketService.isConnected()) {
            this.mainMenu.setVisible(false)
            this.multiMenu.show(true)
            this.onConnected()
        }

    }

    createPosition(yOffset: number): Phaser.Geom.Point {
        return new Phaser.Geom.Point(this.centerX - 70, this.centerY + yOffset)
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

    private onMenuClick() {
        this.mainMenu.setVisible(true)
        this.multiMenu.hide()
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
        this.sendMsg({ type: MessageTypes.GET_LIST_OF_PLAYERS })
    }

    private onDuelRejected(): void {
        hideWaiting()
        hideDuelInvite()
    }

    private onDuelAccepted(): void {
        hideWaiting()
        const mainSceneData: MainSceneData = { communicationServiceName: Scenes.WebSocketService }
        this.scene.start(Scenes.Main, mainSceneData)
    }

    private onAvailablePlayersResponse(playerList: PlayerInfo[]) {
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

    private onSingleClick(): void {
        this.mainMenu.setVisible(false)
        const spService: SinglePlayerService = this.scene.get(Scenes.SinglePlayerService) as SinglePlayerService
        spService.open("")
        const mainSceneData: MainSceneData = { communicationServiceName: Scenes.SinglePlayerService }
        this.scene.start(Scenes.Main, mainSceneData)
    }

    private createMainMenu(): Phaser.GameObjects.Container {
        const container = this.add.container(0, 0),
            multi = new ButtonText(this, 'Play multi', this.createPosition(-70), this.onMultiClick),
            single = new ButtonText(this, 'Play single', this.createPosition(10), this.onSingleClick)

        container.add([multi, single])

        return container
    }
}
