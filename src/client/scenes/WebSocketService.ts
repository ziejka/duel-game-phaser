import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import {
    CountDownNewDuel, InitResponse,
    Message,
    PlayerInfo, RoundResultPayload, RoundStartPayload
} from '../../shared/types/types'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import { CommunicationService } from './CommunicationService'
import { Scenes } from './scenes'

const SERVER = window.location.href.replace('http', 'ws')

export class WebSocketService extends Phaser.Scene implements CommunicationService {
    private msgCallbacks: { [key: string]: any }
    private onMessage: (msg: any) => void
    private ws!: WebSocket

    constructor() {
        super(Scenes.WebSocketService)
        this.onMessage = this._onMessage.bind(this)
        this.msgCallbacks = this.createOnMsgCallback()
    }

    isConnected(): boolean {
        return this.ws && this.ws.readyState === this.ws.OPEN
    }

    send(msg: Message) {
        const message = JSON.stringify(msg)
        this.ws.send(message)
    }

    open(playerName: string) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return
        }
        this.close()
        this.ws = new WebSocket(`${SERVER}?name=${playerName}`)
        this.ws.onmessage = this.onMessage
        this.ws.onopen = this.onOpen.bind(this)
        this.registry.set(RegistryFields.UserData, {})
        this.registry.set(RegistryFields.EnemyName, '')
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

    leaveDuel() {
        const msg: Message = {
            type: MessageTypes.LEFT_DUEL
        }
        this.send(msg)
    }

    private onOpen() {
        this.events.emit(GameEvents.CONNECTED)
    }

    private _onMessage(msg: any): void {
        const message: Message = JSON.parse(msg.data)
        try {
            this.msgCallbacks[message.type](message.payload)
        } catch { }
    }

    private createOnMsgCallback(): { [key: string]: any } {
        return {
            [MessageTypes.INIT_RESPONSE]: this.onInitResponse.bind(this),
            [MessageTypes.START_REQUEST]: this.onStartRequestMsg.bind(this),
            [MessageTypes.COUNT_DOWN]: this.onCountDownNewDuel.bind(this),
            [MessageTypes.START_ROUND]: this.startRound.bind(this),
            [MessageTypes.COUNTING_STOPPED]: this.onCountingStopped.bind(this),
            [MessageTypes.ROUND_LOST]: this.onRoundEnd(false).bind(this),
            [MessageTypes.ROUND_WON]: this.onRoundEnd(true).bind(this),
            [MessageTypes.WAITING_PLAYERS_LIST]: this.onWaitingPlayerListResponse.bind(this),
            [MessageTypes.DUEL_REQUEST]: this.duelRequest.bind(this),
            [MessageTypes.DUEL_REJECT]: this.onDuelReject.bind(this),
            [MessageTypes.DUEL_FINISHED]: this.onDuelFinished.bind(this),
            [MessageTypes.DUEL_STOPPED]: this.onDuelStopped.bind(this),
        }
    }

    private onDuelStopped() {
        this.events.emit(GameEvents.DUEL_STOPPED)
    }

    private onCountDownNewDuel({ secondsLeft }: CountDownNewDuel) {
        this.events.emit(GameEvents.COUNT_DOWN, secondsLeft)
    }

    private onDuelFinished(hasWon: boolean) {
        this.events.emit(GameEvents.DUEL_FINISHED, hasWon)
    }

    private onDuelReject() {
        this.events.emit(GameEvents.DUEL_REJECTED)
    }

    private duelRequest(enemyName: string) {
        this.registry.set(RegistryFields.EnemyName, enemyName)
    }

    private onInitResponse(initResponse: InitResponse) {
        this.registry.set(RegistryFields.UserData, initResponse)
    }

    private onWaitingPlayerListResponse(payload: PlayerInfo[]) {
        this.events.emit(GameEvents.AVAILABLE_PLAYER_RESPONSE, payload)
    }

    private onRoundEnd(isRoundWon: boolean) {
        const event = isRoundWon ? GameEvents.ROUND_WON : GameEvents.ROUND_LOST
        return (payload: RoundResultPayload) => {
            this.events.emit(event, payload.wallet)
        }
    }

    private onCountingStopped(reward: number) {
        this.events.emit(GameEvents.UPDATE_REWARD, reward)
    }

    private startRound(payload: RoundStartPayload) {
        this.events.emit(GameEvents.START_ROUND, payload)
    }

    private onStartRequestMsg() {
        this.events.emit(GameEvents.DUEL_ACCEPTED)
    }

    private close() {
        if (this.ws) {
            this.ws.close()
        }
    }
}
