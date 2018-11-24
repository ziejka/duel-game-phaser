export enum MessageTypes {
    NEW_GAME,
    START_REQUEST,
    USAER_DATA,
    PLAYER_READY
}

export interface Message {
    type: MessageTypes,
    payload?: any
}

export interface GUID {
    id: string
}
