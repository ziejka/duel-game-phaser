import { Player } from '../user'
import { Room } from './Room'

export interface RoomsRoomApi {
    closeRoomRequest: (room: Room) => void
    onPlayerRemoved: () => void
}

export interface RoomsPlayerApi {
    findRandomRoomRequest: (player: Player) => string
}

export interface RoomApi {
    removePlayerFromRoom: (player: Player) => void
    onPlayerReady: () => void
    stopCounting: () => void
    endRound: (player: Player) => void

}
