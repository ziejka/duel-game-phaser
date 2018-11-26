import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { Message } from '../../shared/types/types'
import { Events } from '../state/events'
import { GameData, GameState } from '../state/state'
import { Scenes } from './scenes'

const SERVER = 'ws://localhost:3000'

export class WebScoketService extends Phaser.Scene {
    private msgCallbacks: { [key: string]: any }
    private onMessage: (msg: any) => void
    private ws!: WebSocket

    constructor() {
        super(Scenes.WebScoketService)
        this.onMessage = this._onMessage.bind(this)
        this.msgCallbacks = this.createMsgCallbacks()
    }

    send(msg: Message) {
        const message = JSON.stringify(msg)
        this.ws.send(message)
    }

    open() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return
        }
        this.close()
        this.ws = new WebSocket(SERVER)
        this.ws.onmessage = this.onMessage
        this.registry.set(GameData.IsStartGameVisible, false)
    }

    private _onMessage(msg: any): void {
        const message: Message = JSON.parse(msg.data)
        try {
            this.msgCallbacks[message.type](message.payload)
        } catch { }
    }

    private createMsgCallbacks(): { [key: string]: any } {
        return {
            [MessageTypes.START_REQUEST]: this.onStartRequestMsg.bind(this)
        }
    }

    private onStartRequestMsg() {
        this.registry.set(GameData.IsStartGameVisible, true)
    }

    private close() {
        if (this.ws) {
            this.ws.close()
        }
    }
}
