import { v1 } from 'uuid'
import * as WebSocket from 'ws'
import { Player } from '../../shared/player'
import { GUID, Message, MessageTypes } from '../../shared/types'

export class User implements Player {
    public ID: string
    private ws: WebSocket
    private findRandomRoomRequest: (player: User) => void

    constructor(ws: WebSocket,
                removeUser: (user: User) => void,
                findRandomRoomRequest: (player: User) => void,
                guid?: GUID, ) {

        const onMessage = this.onMessage.bind(this)

        this.ID = guid.id || v1()
        this.ws = ws
        this.findRandomRoomRequest = findRandomRoomRequest

        this.ws.on('error', () => {
            removeUser(this)
        })
        this.ws.on('message', onMessage)
        this.sendMsg(`User connected: ${this.ID}`)
    }

    sendMsg(msg: string): void {
        try {
            this.ws.send(msg)
        } catch (e) { }

    }

    isConnected(): boolean {
        return this.ws.readyState === WebSocket.OPEN
    }

    private onMessage(message: string): void {
        const msg: Message = JSON.parse(message)
        if (msg.type === MessageTypes.NEW_GAME) {
            this.findRandomRoomRequest(this)
        }
    }
}
