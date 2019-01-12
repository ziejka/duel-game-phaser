import { v1 } from 'uuid'
import * as WebSocket from 'ws'
import { MessageTypes } from '../../shared/types/messageTypes'
import { GUID, InitResponse, Message, RoundResultPayload } from '../../shared/types/types'
import { RoomApi, RoomsPlayerApi } from '../rooms/interfaces'

export class Player {
    isReady: boolean = false
    isInRoom: boolean = false
    roomApi!: RoomApi
    name: string
    private ID: string
    private ws: WebSocket
    private roomsPlayerApi: RoomsPlayerApi
    private msgCallbacks: { [key: string]: any }
    private wallet: number = 1000

    constructor(
        ws: WebSocket,
        removeUser: (user: Player) => void,
        roomsPlayerApi: RoomsPlayerApi,
        guid: GUID) {

        const onMessage = this.onMessage.bind(this)
        const onConnectionClose = this.onConnectionClose.bind(this)

        this.msgCallbacks = this.createMsgCallbacks()

        this.ID = guid.id || v1()
        this.name = guid.name
        this.ws = ws
        this.roomsPlayerApi = roomsPlayerApi

        this.ws.on('error', removeUser.bind(null, this))
        this.ws.on('message', onMessage)
        this.ws.on('close', onConnectionClose)
        this.sayHi()
    }

    sendMsg(msg: Message): void {
        try {
            this.ws.send(JSON.stringify(msg))
        } catch (e) { }

    }

    isConnected(): boolean {
        return this.ws.readyState === WebSocket.OPEN
    }

    result(playerWon: boolean, amount: number) {
        this.wallet += playerWon ? amount : -amount
        const payload: RoundResultPayload = {
            wallet: this.wallet
        }
        const msg: Message = {
            type: playerWon ? MessageTypes.ROUND_WON : MessageTypes.ROUND_LOST,
            payload
        }
        this.isReady = false
        this.sendMsg(msg)
    }

    private onConnectionClose() {
        try {
            this.roomApi.removePlayerFromRoom(this)
        } catch { }
    }

    private sayHi() {
        const payload: InitResponse = {
            id: this.ID,
            name: this.name,
            wallet: this.wallet
        }
        const msg: Message = {
            type: MessageTypes.USER_DATA,
            payload
        }
        this.sendMsg(msg)
    }

    private onMessage(message: string): void {
        const msg: Message = JSON.parse(message)
        try {
            this.msgCallbacks[msg.type](msg.payload)
        } catch { }
    }

    private createMsgCallbacks(): { [key: string]: any } {
        return {
            [MessageTypes.NEW_GAME]: this.onNewGameMsg.bind(this),
            [MessageTypes.PLAYER_READY]: this.onPlayerReadyMsg.bind(this),
            [MessageTypes.STOP_COUNTING]: this.onStopCountingRequest.bind(this),
            [MessageTypes.AIM_CLICKED]: this.aimClicked.bind(this),
            [MessageTypes.GET_LIST_OF_PLAYERS]: this.getListOfPLayer.bind(this)
        }
    }

    private getListOfPLayer(): void {
        const playersNames: string[] = this.roomsPlayerApi.getListOfWaitingPlayers().map(p => p.name)
        const msg: Message = {
            type: MessageTypes.WAITING_PLAYERS_LIST,
            payload: playersNames
        }
        this.sendMsg(msg)
    }

    private aimClicked(): void {
        this.roomApi.endRound(this)
    }

    private onStopCountingRequest(): void {
        this.roomApi.stopCounting()
    }

    private onNewGameMsg(): void {
        if (this.isInRoom) { return }
        this.roomsPlayerApi.findRandomRoomRequest(this)
        this.isInRoom = true
    }

    private onPlayerReadyMsg(): void {
        if (this.isReady) { return }
        this.isReady = true
        this.roomApi.onPlayerReady()
    }
}
