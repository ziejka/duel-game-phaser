import { Player } from '../user'

export interface RoomsPlayerApi {
    connectPlayers: (players: Player[]) => void
}

export interface RoomApi {
    removePlayerFromRoom: (player: Player) => void
    onPlayerReady: () => void
    stopCounting: () => void
    endRound: (player: Player) => void

}
