import { MessageTypes } from './messageTypes'

export interface Message<P = {}> {
    type: MessageTypes,
    payload?: P
}

export interface GUID {
    id: string
    name: string
}

export interface RoundStartPayload {
    roundNumber: number
}

export interface RoundResultPayload {
    wallet: number
}

export interface CountingStopped {
    reward: number
}

export interface PlayerInfo {
    name: string
    totalAmount: number
}

export type InitResponse = GUID & RoundResultPayload