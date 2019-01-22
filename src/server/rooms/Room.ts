import { v1 } from 'uuid'
import { Round } from '../../shared/core/round'
import { MessageTypes } from '../../shared/types/messageTypes'
import { CountingStopped, Message } from '../../shared/types/types'
import { RoundStartPayload } from '../../shared/types/types'
import { Player } from '../user'
import { RoomApi, RoomsRoomApi } from './interfaces'

const ROUND_START_DELAY: number = 3000

export class Room implements RoomApi {
    id: string
    players: Player[] = []
    private round: Round = new Round()
    private rooms: RoomsRoomApi

    constructor(rooms: RoomsRoomApi) {
        this.id = v1()
        this.rooms = rooms
    }

    addPlayer(player: Player) {
        this.players.push(player)
        if (this.players.length === 2) {
            this.rooms.closeRoomRequest(this)
            this.requestToStart()
        }
    }

    isOpen(): boolean {
        return this.players.length === 1
    }

    hasAnyPlayers(): boolean {
        return this.players.length > 0
    }

    removePlayerFromRoom(player: Player) {
        this.players = this.players.filter(p => p !== player)
        this.rooms.onPlayerRemoved()
    }

    endRound(player: Player) {
        const lostPlayer = this.players.find(p => p !== player)
        if (lostPlayer) {
            lostPlayer.result(false, this.round.reward / 2)
        }
        player.result(true, this.round.reward / 2)
        setTimeout(this.startNewRound.bind(this), ROUND_START_DELAY)
    }

    stopCounting() {
        const reward = this.round.end(Date.now())
        const payload: CountingStopped = { reward }
        this.sendToAll({
            type: MessageTypes.COUNTING_STOPPED,
            payload
        })
    }

    onPlayerReady() {
        if (this.players.every(p => p.isReady)) {
            this.startNewRound()
        }
    }

    private requestToStart() {
        this.sendToAll({ type: MessageTypes.START_REQUEST })
    }

    private sendToAll(msg: Message) {
        this.players.forEach(player => {
            player.sendMsg(msg)
        })
    }

    private startNewRound() {
        this.round.newRound()
        this.round.start(Date.now())
        const payload: RoundStartPayload = { roundNumber: this.round.roundNumber }
        this.sendToAll({
            type: MessageTypes.START_ROUND,
            payload
        })
    }

}
