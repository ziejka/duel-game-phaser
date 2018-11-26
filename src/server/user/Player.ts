import { v1 } from 'uuid'
import * as WebSocket from 'ws'
import { MessageTypes } from '../../shared/types/messageTypes'
import { GUID, Message } from '../../shared/types/types'

export class Player {
    isPlayerReady: boolean = false
    isInRoom: boolean = false
    removePlayerFromRoom!: (player: Player) => void
    private ID: string
    private ws: WebSocket
    private findRandomRoomRequest: (player: Player) => void

    constructor(ws: WebSocket,
                removeUser: (user: Player) => void,
                findRandomRoomRequest: (player: Player) => void,
                guid?: GUID) {

        const onMessage = this.onMessage.bind(this)
        const onConnectionClose = this.onConnectionClose.bind(this)

        this.ID = guid ? guid.id : v1()
        this.ws = ws
        this.findRandomRoomRequest = findRandomRoomRequest

        this.ws.on('error', () => {
            removeUser(this)
        })
        this.ws.on('message', onMessage)
        // tslint:disable-next-line:no-console
        this.ws.on('close', () => onConnectionClose)
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
            this.removePlayerFromRoom(this)
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
        if (!this.isInRoom && msg.type === MessageTypes.NEW_GAME) {
            this.findRandomRoomRequest(this)
            this.isInRoom = true
        }
        if (msg.type === MessageTypes.PLAYER_READY) {
            this.isPlayerReady = true
        }
    }
}
