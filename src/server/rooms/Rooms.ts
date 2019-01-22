import { Player } from '../user'
import { RoomsPlayerApi, RoomsRoomApi } from './interfaces'
import { Room } from './Room'

export class Rooms implements RoomsPlayerApi, RoomsRoomApi {
    private allRooms: Room[] = []
    private openRooms: Room[] = []

    getListOfWaitingPlayers(): Player[] {
        return this.openRooms.reduce((prev, curr) => prev.concat(curr.players), [] as Player[])
    }

    findRandomRoomRequest(player: Player): string {
        const randomRoomIndex: number = Math.floor(Math.random() * this.openRooms.length)
        let room: Room = this.openRooms[randomRoomIndex]

        if (!room) {
            room = this.createRoom()
            this.openRooms.push(room)
        }
        room.addPlayer(player)
        player.room = room
        this.clearRoms()
        return room.id
    }

    onPlayerRemoved() {
        this.clearRoms()
    }

    closeRoomRequest(room: Room): void {
        this.openRooms = this.openRooms.filter(r => r !== room)
    }

    private createRoom(): Room {
        const room: Room = new Room(this)
        this.allRooms.push(room)
        return room
    }

    private clearRoms() {
        this.allRooms = this.allRooms.filter(r => r.hasAnyPlayers())
        this.openRooms = this.allRooms.filter(r => r.isOpen())
    }
}
