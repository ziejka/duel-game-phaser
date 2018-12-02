import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { Message, RoundResultPayload, RoundStartPayload } from '../../shared/types/types'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import { Scenes } from './scenes'

const SERVER = `ws://${window.location.host}`

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
        this.registry.set(RegistryFields.StartGameVisible, false)
    }

    stopCounting() {
        const msg: Message = {
            type: MessageTypes.STOP_COUNTING
        }
        this.send(msg)
    }

    aimClicked() {
        const msg: Message = {
            type: MessageTypes.AIM_CLICKED
        }
        this.send(msg)
    }

    private _onMessage(msg: any): void {
        const message: Message = JSON.parse(msg.data)
        try {
            this.msgCallbacks[message.type](message.payload)
        } catch { }
    }

    private createMsgCallbacks(): { [key: string]: any } {
        return {
            [MessageTypes.START_REQUEST]: this.onStartRequestMsg.bind(this),
            [MessageTypes.START_ROUND]: this.startround.bind(this),
            [MessageTypes.COUNTING_STOPPED]: this.onCountingStopped.bind(this),
            [MessageTypes.ROUND_LOST]: this.onRoundEnd(false).bind(this),
            [MessageTypes.ROUND_WON]: this.onRoundEnd(true).bind(this)
        }
    }

    private onRoundEnd(isRounWon: boolean) {
        const event = isRounWon ? GameEvents.ROND_WON : GameEvents.ROND_LOST
        return (payload: RoundResultPayload) => {
            this.events.emit(event, payload.wallet)
        }

    }

    private onCountingStopped(reward: number) {
        this.registry.set(RegistryFields.Reward, reward)
    }

    private startround(payload: RoundStartPayload) {
        this.events.emit(GameEvents.START_ROUND, payload)
    }

    private onStartRequestMsg() {
        this.registry.set(RegistryFields.StartGameVisible, true)
    }

    private close() {
        if (this.ws) {
            this.ws.close()
        }
    }
}
