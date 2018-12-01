import { Round } from '../../shared/core/round'
import { MessageTypes } from '../../shared/types/messageTypes'
import { CountingStopped, Message } from '../../shared/types/types'
import { RoundStartPayload } from '../../shared/types/types'
import { Player } from '../user'
import { RoomCallbacks, RoomsCallbacks } from './interfaces'

export class Room {
    callbacs: RoomCallbacks
    private onPlayerRemoved: () => void
    private closeRoomRequest: (room: Room) => void
    private round: Round = new Round()
    private players: Player[] = []
    private noRound: number = 0

    constructor(roomsCallbacs: RoomsCallbacks) {
        this.closeRoomRequest = roomsCallbacs.closeRoomRequest
        this.onPlayerRemoved = roomsCallbacs.onPlayerRemoved
        this.callbacs = {
            removePlayerFromRoom: this.removePlayerFromRoom.bind(this),
            onPlayerReady: this.onPlayerReady.bind(this),
            stopCounting: this.stopCounting.bind(this),
            playerWon: this.playerWon.bind(this)
        }
    }

    addPlayer(player: Player) {
        this.players.push(player)
        if (this.players.length === 2) {
            this.closeRoomRequest(this)
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
        this.noRound = 0
        this.onPlayerRemoved()
    }

    private playerWon(player: Player) {
        const lostPlayer = this.players.find(p => p !== player)
        lostPlayer.result(false)
        player.result(true)
    }

    private stopCounting() {
        const reward = this.round.end(Date.now())
        const payload: CountingStopped = { reward }
        this.sendToAll({
            type: MessageTypes.COUNTING_STOPPED,
            payload
        })
    }

    private requestToStart() {
        this.sendToAll({ type: MessageTypes.START_REQUEST })
    }

    private sendToAll(msg: Message) {
        const message: string = JSON.stringify(msg)
        this.players.forEach(player => {
            player.sendMsg(message)
        })
    }

    private onPlayerReady() {
        if (this.players.every(p => p.isReady)) {
            this.round.start(Date.now())
            this.noRound++
            const payload: RoundStartPayload = { roundNumber: this.noRound }
            this.sendToAll({
                type: MessageTypes.START_ROUND,
                payload
            })
        }
    }

}
