import * as WebSocket from 'ws'
import { GUID } from '../../shared/types/types'
import { RoomsPlayerApi } from '../rooms/interfaces'
import { Player } from './Player'
import { PlayerListApi } from './PlayerListApi'

export class PlayersList implements PlayerListApi {
    private playersList: Player[] = []
    private roomsPlayerApi: RoomsPlayerApi

    constructor(roomsPlayerApi: RoomsPlayerApi) {
        this.roomsPlayerApi = roomsPlayerApi
    }

    addUser(ws: WebSocket, guid: GUID): Player {
        const user = new Player(guid, ws, this)
        this.playersList.push(user)
        return user
    }

    removeUser(user: Player): Player {
        this.playersList = this.playersList.filter(u => u !== user)
        return user
    }

    getAvailablePlayers = (player: Player): string[] =>
        this.playersList.reduce((result: string[], p) =>
            [...result, ...p.isWaiting && p !== player ? [p.name] : []], [])

    findRandomPlayer = (player: Player) => this.roomsPlayerApi.findRandomRoomRequest(player)

}
