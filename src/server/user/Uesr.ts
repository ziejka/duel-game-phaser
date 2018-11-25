import { v1 } from 'uuid'
import * as WebSocket from 'ws'
import { MessageTypes } from '../../shared/types/messageTypes'
import { Player } from '../../shared/types/player'
import { GUID, Message } from '../../shared/types/types'

export class User implements Player {
    isPlayerReady: boolean = false
    private ID: string
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
        if (msg.type === MessageTypes.NEW_GAME) {
            this.findRandomRoomRequest(this)
        }
        if (msg.type === MessageTypes.PLAYER_READY) {
            this.isPlayerReady = true
        }
    }
}
