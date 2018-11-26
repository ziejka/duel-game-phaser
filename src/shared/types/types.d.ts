import { MessageTypes } from './messageTypes'

export interface Message {
    type: MessageTypes,
    payload?: any
}

export interface GUID {
    id: string
}

export interface RoundStartPayload {
    roundNumber: number
}
