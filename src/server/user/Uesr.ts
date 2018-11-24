import { v1 } from 'uuid'
import * as WebSocket from 'ws'
import { Message } from '../../shared/types'

export class User {
    private ID: string
    private ws: WebSocket

    constructor(ws: WebSocket, removeUser: (user: User) => void) {
        const onMessage = this.onMessage.bind(this)

        this.ID = v1()
        this.ws = ws
        this.ws.on('error', () => {
            removeUser(this)
        })
        this.ws.on('message', onMessage)
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
        // tslint:disable-next-line:no-console
        console.log(msg.type)
    }
}
