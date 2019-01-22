import * as WebSocket from 'ws'
import { GUID } from '../../shared/types/types'
import { RoomsPlayerApi } from '../rooms/interfaces'
import { Player } from './Player'
import { PlayerListApi } from './PlayerListApi'

export class PlayersList implements PlayerListApi {
    private userList: Player[] = []
    private roomsPlayerApi: RoomsPlayerApi

    constructor(roomsPlayerApi: RoomsPlayerApi) {
        this.roomsPlayerApi = roomsPlayerApi
    }

    addUser(ws: WebSocket, guid: GUID): Player {
        const user = new Player(guid, ws, this)
        this.userList.push(user)
        return user
    }

    removeUser(user: Player): Player {
        this.userList = this.userList.filter(u => u !== user)
        return user
    }

    getAvailablePlayers = (): string[] =>
        this.userList.reduce((result: string[], { name, isWaiting }) => [...result, ...isWaiting ? [name] : []], [])

    findRandomPlayer = (player: Player) => this.roomsPlayerApi.findRandomRoomRequest(player)

}
