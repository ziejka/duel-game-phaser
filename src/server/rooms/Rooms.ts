import { Player } from '../user'
import { RoomsPlayerApi } from './interfaces'
import { Room } from './Room'

export class Rooms implements RoomsPlayerApi {
    connectPlayers(players: Player[]): void {
        const room = new Room()
        players.forEach(p => {
            room.addPlayer(p)
            p.connectToRoom(room)
        })
    }
}
