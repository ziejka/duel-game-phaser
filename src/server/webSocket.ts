import * as http from 'http'
import * as url from 'url'
import { v1 } from 'uuid'
import * as WebSocket from 'ws'
import { GUID } from '../shared/types/types'
import { Rooms } from './rooms/Rooms'
import { PlayersList } from './user'

const rooms: Rooms = new Rooms()
const userList: PlayersList = new PlayersList(rooms)

export const createWebSocket = (server: http.Server): WebSocket.Server => {
    const wss = new WebSocket.Server({ server })

    wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
        const query = url.parse(req.url, true).query
        const name: string = query.name as string // "Player " + Math.floor(Math.random() * 100)
        const id: string = v1()
        const guid = {
            id,
            name
        }
        userList.addUser(ws, guid)
    })

    return wss
}
