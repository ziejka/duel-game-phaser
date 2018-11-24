export enum MessageTypes {
    NEW_GAME
}

export interface Message {
    type: MessageTypes,
    payload?: any
}

export interface GUID {
    id: string
}
