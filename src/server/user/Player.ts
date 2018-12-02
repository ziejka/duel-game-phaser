import { v1 } from 'uuid'
import * as WebSocket from 'ws'
import { MessageTypes } from '../../shared/types/messageTypes'
import { GUID, Message, RoundResultPayload } from '../../shared/types/types'
import { RoomCallbacks } from '../rooms/interfaces'

export class Player {
    isReady: boolean = false
    isInRoom: boolean = false
    roomCallbacks!: RoomCallbacks
    private ID: string
    private ws: WebSocket
    private findRandomRoomRequest: (player: Player) => void
    private msgCallbacks: { [key: string]: any }
    private wallet: number = 10000

    constructor(ws: WebSocket,
                removeUser: (user: Player) => void,
                findRandomRoomRequest: (player: Player) => void,
                guid: GUID) {

        const onMessage = this.onMessage.bind(this)
        const onConnectionClose = this.onConnectionClose.bind(this)

        this.msgCallbacks = this.createMsgCallbacks()

        this.ID = guid.id || v1()
        this.ws = ws
        this.findRandomRoomRequest = findRandomRoomRequest

        this.ws.on('error', removeUser.bind(null, this))
        this.ws.on('message', onMessage)
        this.ws.on('close', onConnectionClose)
        this.sayHi()
    }

    sendMsg(msg: string): void {
        try {
            this.ws.send(msg)
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
        this.sendMsg(JSON.stringify(msg))
    }

    private onConnectionClose() {
        try {
            this.roomCallbacks.removePlayerFromRoom(this)
        } catch { }
    }

    private sayHi() {
        const msg: Message = {
            type: MessageTypes.USAER_DATA,
            payload: {
                ID: this.ID,
                wallet: this.wallet
            }
        }
        // tslint:disable-next-line:no-console
        console.log(`Player connected`)
        this.sendMsg(JSON.stringify(msg))
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
            [MessageTypes.AIM_CLICKED]: this.aimClicked.bind(this)
        }
    }

    private aimClicked() {
        this.roomCallbacks.endRound(this)
    }

    private onStopCountingRequest() {
        this.roomCallbacks.stopCounting()
    }

    private onNewGameMsg(): void {
        if (this.isInRoom) { return }
        this.findRandomRoomRequest(this)
        this.isInRoom = true
    }

    private onPlayerReadyMsg(): void {
        if (this.isReady) { return }
        this.isReady = true
        this.roomCallbacks.onPlayerReady()
    }
}
