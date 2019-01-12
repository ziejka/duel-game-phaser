import * as WebSocket from 'ws'
import { GUID } from '../../shared/types/types'
import { RoomsPlayerApi } from '../rooms/interfaces'
import { Player } from './Player'

export class PlayersList {
    private userList: Player[] = []

    addUser(ws: WebSocket, guid: GUID, roomsPlayerApi: RoomsPlayerApi): Player {
        const user = new Player(ws, this.removeUser.bind(this), roomsPlayerApi, guid)
        this.userList.push(user)
        return user
    }

    removeUser(user: Player): Player {
        this.userList = this.userList.filter(u => u !== user)
        return user
    }

}
