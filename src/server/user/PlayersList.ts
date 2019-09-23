import * as WebSocket from 'ws'
import { MessageTypes } from '../../shared/types/messageTypes'
import { GUID, PlayerInfo } from '../../shared/types/types'
import { Rooms } from '../rooms/Rooms'
import { Player } from './Player'

export class PlayersList {
    private playersList: Player[] = []
    private roomsPlayerApi: Rooms

    constructor(roomsPlayerApi: Rooms) {
        this.roomsPlayerApi = roomsPlayerApi
    }

    addUser(ws: WebSocket, guid: GUID): Player {
        const user = new Player(guid, ws, this)
        this.playersList.push(user)
        this.notifyPlayerListUpdate()
        return user
    }

    removePlayer(player: Player): Player {
        this.playersList = this.playersList.filter(u => u !== player)
        this.notifyPlayerListUpdate()
        return player
    }

    getAvailablePlayers = (player: Player): PlayerInfo[] => this.playersList.reduce((result: PlayerInfo[], p) =>
        [...result, ...p.isWaiting && p !== player ? [p.getPlayerInfo()] : []], [])
        .sort((a, b) => a.totalAmount = b.totalAmount)

    sendDuelInvite(player: Player, enemyName: string): void {
        const enemy = this.playersList.find(p => p.name === enemyName)
        if (!enemy || !enemy.isWaiting) { return }

        enemy.sendMsg({ type: MessageTypes.DUEL_REQUEST, payload: player.name })
        this.roomsPlayerApi.connectPlayers([player, enemy])
        this.notifyPlayerListUpdate()
    }

    notifyPlayerListUpdate(): void {
        this.playersList.filter(p => p.isWaiting).forEach(p => {
            p.sendListOfPLayers()
        })
    }

}
