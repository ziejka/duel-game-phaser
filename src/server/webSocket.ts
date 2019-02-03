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
        const query = req.url ? url.parse(req.url, true).query : { name: "Player " + Math.floor(Math.random() * 100) }
        const name: string = query.name as string
        const id: string = v1()
        const guid: GUID = {
            id,
            name: `${name}#${id.substring(4, 8)}`
        }
        userList.addUser(ws, guid)
    })

    return wss
}
