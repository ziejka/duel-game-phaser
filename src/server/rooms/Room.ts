import { Round } from '../../shared/core/round'
import { MessageTypes } from '../../shared/types/messageTypes'
import { Message } from '../../shared/types/types'
import { Player } from '../user'
import { RoomsCallbacks } from './interfaces'

export class Room {
    private onPlayerRemoved: () => void
    private closeRoomRequest: (room: Room) => void
    private round: Round = new Round()
    private players: Player[] = []

    constructor(roomsCallbacs: RoomsCallbacks) {
        this.closeRoomRequest = roomsCallbacs.closeRoomRequest
        this.onPlayerRemoved = roomsCallbacs.onPlayerRemoved
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
        this.onPlayerRemoved()
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

}
