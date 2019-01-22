import { Player } from './Player'

export interface PlayerListApi {
    getAvailablePlayers: () => string[]
    findRandomPlayer: (player: Player) => string
    removeUser: (player: Player) => Player
}
