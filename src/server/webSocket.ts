import * as http from 'http'
import * as WebSocket from 'ws'
import { UserList } from './user'

const userList: UserList = new UserList()

export const createWebSocket = (server: http.Server): WebSocket.Server => {
    const wss = new WebSocket.Server({ server })

    wss.on('connection', (ws: WebSocket) => {
        userList.addUser(ws)
    })

    return wss
}
