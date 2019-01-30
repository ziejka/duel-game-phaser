import { Player } from './Player'

export interface PlayerListApi {
    getAvailablePlayers: (player: Player) => string[]
    findRandomPlayer: (player: Player) => string
    removeUser: (player: Player) => Player
}
