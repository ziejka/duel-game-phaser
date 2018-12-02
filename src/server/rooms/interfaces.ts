import { Player } from '../user'
import { Room } from './Room'

export interface RoomsCallbacks {
    closeRoomRequest: (room: Room) => void
    onPlayerRemoved: () => void
}

export interface RoomCallbacks {
    removePlayerFromRoom: (player: Player) => void
    onPlayerReady: () => void
    stopCounting: () => void
    endRound: (player: Player) => void

}
