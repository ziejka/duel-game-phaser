import { User } from '../user'
import { Room } from './Room'

export class Rooms {
    private allRooms: Room[] = []
    private openRooms: Room[] = []

    findRandomRoom(player: User): void {
        const randomroomIndex: number = Math.floor(Math.random() * this.openRooms.length)
        const room: Room = this.openRooms[randomroomIndex]

        if (!room) {
            this.openRooms.push(this.createRoom(player))
        } else {
            room.addPlayer(player)
        }
    }

    private createRoom(player: User): Room {
        const onRoomClose = this.onRoomClose.bind(this)
        const room: Room = new Room(player, onRoomClose)
        this.allRooms.push(room)
        return room
    }

    private onRoomClose(room: Room) {
        this.openRooms = this.openRooms.filter(r => r !== room)
    }
}
