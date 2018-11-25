import { Round } from '../../shared/core/round'
import { MessageTypes } from '../../shared/types/messageTypes'
import { Message } from '../../shared/types/types'
import { User } from '../user'

export class Room {
    private closeRoomRequest: (room: Room) => void
    private round: Round = new Round()
    private players: User[] = []

    constructor(player: User, closeRoomRequest: (room: Room) => void) {
        this.connectPlayer(player)
        this.closeRoomRequest = closeRoomRequest
    }

    addPlayer(player: User) {
        this.connectPlayer(player)
    }

    private connectPlayer(player: User) {
        this.players.push(player)
        if (this.players.length === 2) {
            this.closeRoomRequest(this)
            this.requestToStart()
        }
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
