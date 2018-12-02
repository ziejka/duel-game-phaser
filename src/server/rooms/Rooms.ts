import { Player } from '../user'
import { RoomsCallbacks } from './interfaces'
import { Room } from './Room'

export class Rooms {
    private allRooms: Room[] = []
    private openRooms: Room[] = []
    private callbacks: RoomsCallbacks

    constructor() {
        this.callbacks = {
            closeRoomRequest: this.closeRoomRequest.bind(this),
            onPlayerRemoved: this.onPlayerRemoved.bind(this)
        }
    }

    findRandomRoomRequest(player: Player): void {
        const randomroomIndex: number = Math.floor(Math.random() * this.openRooms.length)
        let room: Room = this.openRooms[randomroomIndex]

        if (!room) {
            room = this.createRoom()
            this.openRooms.push(room)
        }
        room.addPlayer(player)
        player.roomCallbacks = room.callbacs
        this.clearRoms()
    }

    private createRoom(): Room {
        const room: Room = new Room(this.callbacks)
        this.allRooms.push(room)
        return room
    }

    private onPlayerRemoved() {
        this.clearRoms()
    }

    private clearRoms() {
        this.allRooms = this.allRooms.filter(r => r.hasAnyPlayers())
        this.openRooms = this.allRooms.filter(r => r.isOpen())
    }

    private closeRoomRequest(room: Room): void {
        this.openRooms = this.openRooms.filter(r => r !== room)
    }
}
