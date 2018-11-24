import { Message, MessageTypes } from '../../shared/types'
import { Events } from '../state/events'
import { States } from '../state/state'

const SERVER = 'ws://localhost:3000'
let ws: WebSocket

const onMessage = (emit: (event: string | symbol, ...args: any[]) => boolean) => (msg: any) => {
    const message: Message = JSON.parse(msg.data)
    if (message.type === MessageTypes.START_REQUEST) {
        // tslint:disable-next-line:no-console
        console.log(JSON.parse(msg.data))
        emit(Events.UPDATE_STATE, States.READY)
    }
}

export const openWebSoket = (emit: (event: string | symbol, ...args: any[]) => boolean) => {
    // const idQuery: string = '/?id=myAwesomeId'
    ws = new WebSocket(SERVER)
    ws.onmessage = onMessage(emit)
}

export const sendMsg = (msg: Message): void => {
    ws.send(JSON.stringify(msg))
}
