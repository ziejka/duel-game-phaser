import { Player } from '../user'
import { Room } from './Room'

export class Rooms {
    connectPlayers(players: Player[]): void {
        const room = new Room()
        players.forEach(p => {
            room.addPlayer(p)
            p.connectToRoom(room)
        })
    }
}
