import * as WebSocket from 'ws'
import { GUID } from '../../shared/types'
import { User } from './Uesr'

export class UserList {
    private userList: User[] = []
    private interval: NodeJS.Timeout

    constructor() {
        this.interval = this.createInterval()
    }

    addUser(ws: WebSocket, guid: GUID, findRandomRoomRequest: (player: User) => void): User {
        const user = new User(ws, this.removeUser.bind(this), findRandomRoomRequest, guid)
        this.userList.push(user)
        this.showUsers()
        return user
    }

    removeUser(user: User): User {
        this.userList = this.userList.filter(u => u !== user)
        this.showUsers()
        return user
    }

    private createInterval(): NodeJS.Timeout {
        return setInterval(this.showUsers.bind(this), 100000000)
    }

    private showUsers(): void {
        // this.userList.forEach(user => user.sendMsg(`${this.userList.length} -> users connected ${Date.now()}`))
    }
}
