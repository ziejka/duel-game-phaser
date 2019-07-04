import * as WebSocket from 'ws'
import { BASE_GAME_CONFIG } from '../../shared/gameConfigs'
import { MessageTypes } from '../../shared/types/messageTypes'
import { GUID, InitResponse, Message, RoundResultPayload } from '../../shared/types/types'
import { Room } from '../rooms/Room'
import { PlayersList } from './PlayersList'

export class Player {
    isReady: boolean = false
    isWaiting: boolean = true
    room!: Room | null
    name: string
    wonDuel: boolean = false
    private ID: string
    private ws: WebSocket
    private msgCallbacks: { [key: string]: any }
    private wallet: number = BASE_GAME_CONFIG.initialPlayerAmount
    private maxWalletAmount = BASE_GAME_CONFIG.initialPlayerAmount * 2
    private playerList: PlayersList

    constructor(guid: GUID, ws: WebSocket, playerList: PlayersList) {
        this.ID = guid.id
        this.playerList = playerList
        this.name = guid.name
        this.ws = ws

        const onMessage = this.onMessage.bind(this)
        const onConnectionClose = this.onConnectionClose.bind(this)
        this.msgCallbacks = this.createOnMsgCallbacks()

        this.ws.on('error', playerList.removePlayer.bind(playerList, this))
        this.ws.on('message', onMessage)
        this.ws.on('close', onConnectionClose)
        this.sayHi()
    }

    finishDuel() {
        this.sendMsg({
            type: MessageTypes.DUEL_FINISHED,
            payload: this.wonDuel
        }, this.resetState.bind(this))
    }

    sendMsg(msg: Message, callback?: () => void): void {
        try {
            this.ws.send(JSON.stringify(msg), callback)
        } catch (e) { }

    }

    isConnected(): boolean {
        return this.ws.readyState === WebSocket.OPEN
    }

    result(playerWon: boolean, amount: number) {
        this.wallet += playerWon ? amount : -amount
        if (this.wallet < 0) {
            this.wallet = 0
        }
        if (this.wallet > this.maxWalletAmount) {
            this.wallet = this.maxWalletAmount
            this.wonDuel = true
        }
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

    connectToRoom(room: Room) {
        this.wallet = BASE_GAME_CONFIG.initialPlayerAmount
        this.room = room
        this.isWaiting = false
    }

    sendListOfPLayers(): void {
        const playersNames: string[] = this.playerList.getAvailablePlayers(this)
        const msg: Message = {
            type: MessageTypes.WAITING_PLAYERS_LIST,
            payload: playersNames
        }
        this.sendMsg(msg)
    }

    private resetState() {
        this.wallet = BASE_GAME_CONFIG.initialPlayerAmount
        this.isReady = false
        this.isWaiting = true
        this.wonDuel = false
    }

    private onConnectionClose() {
        try {
            this.playerList.removePlayer(this)
        } catch { }
    }

    private sayHi() {
        const payload: InitResponse = {
            id: this.ID,
            name: this.name,
            wallet: this.wallet
        }
        const msg: Message = {
            type: MessageTypes.INIT_RESPONSE,
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

    private createOnMsgCallbacks(): { [key: string]: any } {
        return {
            [MessageTypes.PLAYER_READY]: this.onPlayerReadyMsg.bind(this),
            [MessageTypes.STOP_COUNTING]: this.onStopCountingRequest.bind(this),
            [MessageTypes.AIM_CLICKED]: this.aimClicked.bind(this),
            [MessageTypes.GET_LIST_OF_PLAYERS]: this.sendListOfPLayers.bind(this),
            [MessageTypes.CONNECT_WITH_PLAYER]: this.connectWithPlayer.bind(this),
            [MessageTypes.DUEL_ACCEPTED]: this.duelInviteResponse.bind(this, true),
            [MessageTypes.DUEL_REJECTED]: this.duelInviteResponse.bind(this, false)
        }
    }

    private duelInviteResponse(isAccepted: boolean): void {
        if (!this.room) { return }
        if (isAccepted) {
            this.room.requestToStart()
            return
        }
        this.room.duelReject()
        this.playerList.notifyPlayerListUpdate()
    }

    private connectWithPlayer(playerName?: string): void {
        let enemyName = playerName
        if (!this.isWaiting) { return }
        if (!enemyName) {
            enemyName = this.getRandomPlayer()
            if (enemyName === '') {
                this.sendMsg({ type: MessageTypes.NO_PLAYERS })
                return
            }
        }
        this.playerList.sendDuelInvite(this, enemyName)
    }

    private getRandomPlayer(): string {
        const availablePlayers: string[] = this.playerList.getAvailablePlayers(this)
        const listLength = availablePlayers.length
        if (listLength > 0) {
            return availablePlayers[Math.floor(Math.random() * listLength)]
        }
        return ''
    }

    private aimClicked(): void {
        if (!this.room) { return }
        this.room.endRound(this)
    }

    private onStopCountingRequest(): void {
        if (!this.room) {
            return
        }
        this.room.stopCounting()
    }

    private onPlayerReadyMsg(): void {
        if (this.isReady) { return }
        if (!this.room) { return }
        this.isReady = true
        this.room.onPlayerReady()
    }
}
