import * as http from 'http'
import * as url from 'url'
import * as WebSocket from 'ws'
import { GUID } from '../shared/types'
import { Rooms } from './rooms/Rooms'
import { UserList } from './user'

const userList: UserList = new UserList()
const rooms: Rooms = new Rooms()
const findRandomRoomRequest = rooms.findRandomRoom.bind(rooms)

export const createWebSocket = (server: http.Server): WebSocket.Server => {
    const wss = new WebSocket.Server({ server })

    wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
        const guid = url.parse(req.url, true).query as unknown as GUID
        userList.addUser(ws, guid, findRandomRoomRequest)
    })

    return wss
}
