import { v1 } from 'uuid'
import * as WebSocket from 'ws'

export class User {
    public get ID(): string {
        return this._ID
    }
    private _ID: string
    private _ws: WebSocket

    constructor(ws: WebSocket) {
        this._ID = v1()
        this._ws = ws
    }

    sendMsg(msg: string): void {
        this._ws.send(msg)
    }
}
