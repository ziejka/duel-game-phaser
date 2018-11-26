import { Room } from './Room'

export interface RoomsCallbacks {
    closeRoomRequest: (room: Room) => void
    onPlayerRemoved: () => void
}
