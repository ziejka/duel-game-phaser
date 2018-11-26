import { Player } from '../user'
import { Room } from './Room'

export class Rooms {
    private allRooms: Room[] = []
    private openRooms: Room[] = []

    findRandomRoomRequest(player: Player): void {
        const randomroomIndex: number = Math.floor(Math.random() * this.openRooms.length)
        const room: Room = this.openRooms[randomroomIndex]

        if (!room) {
            this.openRooms.push(this.createRoom(player))
        } else {
            room.addPlayer(player)
        }
        this.openRooms = this.openRooms.filter(r => r.isOpen())
    }

    removePlayer(player: Player) {

    }

    private createRoom(player: Player): Room {
        const closeRoomRequest = this.closeRoomRequest.bind(this)
        const room: Room = new Room(player, closeRoomRequest)
        this.allRooms.push(room)
        return room
    }

    private clearRoms() {
        this.allRooms = this.allRooms.filter(r => r.hasAnyPlayers())
    }

    private closeRoomRequest(room: Room) {
        this.openRooms = this.openRooms.filter(r => r !== room)
    }
}
