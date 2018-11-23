import * as WebSocket from 'ws'
import { User } from './Uesr'

export class UserList {
    private _userList: User[] = []

    public get userList(): User[] {
        return this._userList
    }

    public addUser(ws: WebSocket): void {
        const user = new User(ws)
        user.sendMsg(user.ID)
        this._userList.push(user)
    }
}
