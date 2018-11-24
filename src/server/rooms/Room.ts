import { Round } from '../../shared/core/round'
import { Message } from '../../shared/types'
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

    showPlayers(): string[] {
        return this.players.map(player => player.ID)
    }

    private connectPlayer(player: User) {
        this.players.push(player)
        if (this.players.length === 2) {
            this.closeRoomRequest(this)
        }
    }

    private sendToAll(msg: Message) {
        const message: string = JSON.stringify(msg)
        this.players.forEach(player => {
            player.sendMsg(message)
        })
    }

}
