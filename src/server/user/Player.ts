import { v1 } from 'uuid'
import * as WebSocket from 'ws'
import { MessageTypes } from '../../shared/types/messageTypes'
import { GUID, Message } from '../../shared/types/types'
import { RoomCallbacks } from '../rooms/interfaces'

export class Player {
    isPlayerReady: boolean = false
    isInRoom: boolean = false
    roomCallbacks!: RoomCallbacks
    private ID: string
    private ws: WebSocket
    private findRandomRoomRequest: (player: Player) => void
    private msgCallbacks: { [key: string]: any }

    constructor(ws: WebSocket,
                removeUser: (user: Player) => void,
                findRandomRoomRequest: (player: Player) => void,
                guid: GUID) {

        this.msgCallbacks = this.createMsgCallbacks()
        const onMessage = this.onMessage.bind(this)
        const onConnectionClose = this.onConnectionClose.bind(this)

        this.ID = guid.id || v1()
        this.ws = ws
        this.findRandomRoomRequest = findRandomRoomRequest

        this.ws.on('error', () => {
            removeUser(this)
        })
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

    private onConnectionClose() {
        try {
            this.roomCallbacks.removePlayerFromRoom(this)
        } catch { }
    }

    private sayHi() {
        const msg: Message = {
            type: MessageTypes.USAER_DATA,
            payload: {
                ID: this.ID
            }
        }
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
            [MessageTypes.PLAYER_READY]: this.onPlayerReadyMsg.bind(this)
        }
    }

    private onNewGameMsg() {
        if (!this.isInRoom) {
            this.findRandomRoomRequest(this)
            this.isInRoom = true
        }
    }

    private onPlayerReadyMsg() {
        this.isPlayerReady = true
    }
}
