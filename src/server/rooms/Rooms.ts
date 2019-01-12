import { Player } from '../user'
import { RoomsPlayerApi, RoomsRoomApi } from './interfaces'
import { Room } from './Room'

export class Rooms {
    playerApi: RoomsPlayerApi
    private allRooms: Room[] = []
    private openRooms: Room[] = []
    private roomApi: RoomsRoomApi

    constructor() {
        this.roomApi = {
            closeRoomRequest: this.closeRoomRequest.bind(this),
            onPlayerRemoved: this.onPlayerRemoved.bind(this)
        }
        this.playerApi = {
            findRandomRoomRequest: this.findRandomRoomRequest.bind(this),
            getListOfWaitingPlayers: this.getListOfWaitingPlayers.bind(this)
        }
    }
    private getListOfWaitingPlayers(): Player[] {
        return this.openRooms.reduce((prev, curr) => prev.concat(curr.players), [])
    }

    private findRandomRoomRequest(player: Player): void {
        const randomRoomIndex: number = Math.floor(Math.random() * this.openRooms.length)
        let room: Room = this.openRooms[randomRoomIndex]

        if (!room) {
            room = this.createRoom()
            this.openRooms.push(room)
        }
        room.addPlayer(player)
        player.roomApi = room.callbacks
        this.clearRoms()
    }

    private createRoom(): Room {
        const room: Room = new Room(this.roomApi)
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
