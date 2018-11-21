import { on } from 'cluster'
import * as http from 'http'
import * as WebSocket from 'ws'

export const createWebSocket = (server: http.Server): void => {
    const wss = new WebSocket.Server({ server })

    wss.on('connection', (ws: WebSocket) => {
        // tslint:disable-next-line:no-console
        console.log('Connected bith')

        ws.on('message', (message: string) => {
            ws.send(`Thank you for msg ${message}`)
        })
    })
}
