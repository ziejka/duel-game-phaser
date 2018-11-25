import { MessageTypes } from '../../shared/types/messageTypes'
import { Message } from '../../shared/types/types'
import { Events } from '../state/events'
import { GameState } from '../state/state'

const SERVER = 'ws://localhost:3000'
let ws: WebSocket

const onMessage = (emit: (event: string | symbol, ...args: any[]) => boolean) => (msg: any) => {
    const message: Message = JSON.parse(msg.data)
    if (message.type === MessageTypes.START_REQUEST) {
        emit(Events.UPDATE_STATE, GameState.READY)
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
