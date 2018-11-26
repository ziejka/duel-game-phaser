import * as WebSocket from 'ws'
import { GUID } from '../../shared/types/types'
import { Player } from './Player'

export class PlayersList {
    private userList: Player[] = []
    // private interval: NodeJS.Timeout

    constructor() {
        // this.interval = this.createInterval()
    }

    addUser(ws: WebSocket, guid: GUID, findRandomRoomRequest: (player: Player) => void): Player {
        const user = new Player(ws, this.removeUser.bind(this), findRandomRoomRequest, guid)
        this.userList.push(user)
        return user
    }

    removeUser(user: Player): Player {
        this.userList = this.userList.filter(u => u !== user)
        this.showUsers()
        return user
    }

    private createInterval(): NodeJS.Timeout {
        return setInterval(this.showUsers.bind(this), 3000)
    }

    private showUsers(): void {
    }
}
