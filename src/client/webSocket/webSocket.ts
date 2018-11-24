import { Message } from '../../shared/types'

const SERVER = 'ws://localhost:3000'
let ws: WebSocket

const onMessage = (msg: any) => {
    // tslint:disable-next-line:no-console
    console.log(msg.data)
}

export const openWebSoket = () => {
    // const idQuery: string = '/?id=myAwesomeId'
    ws = new WebSocket(SERVER)
    ws.onmessage = onMessage
}

export const sendMsg = (msg: Message): void => {
    ws.send(JSON.stringify(msg))
}
