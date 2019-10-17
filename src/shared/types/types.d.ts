import { MessageTypes } from './messageTypes'
import { Scenes } from '../../client/scenes/scenes'

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
    position: number
}

export type MainSceneData = {
    communicationServiceName: Scenes.SinglePlayerService | Scenes.WebSocketService
}


export type InitResponse = GUID & RoundResultPayload