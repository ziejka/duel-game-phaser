import { Round } from '../../shared/core/round'
import { MessageTypes } from '../../shared/types/messageTypes'
import { CountDownNewDuel, CountingStopped, Message, RoundStartPayload } from '../../shared/types/types'
import { Player } from '../user'

const ROUND_START_DELAY: number = 1000

export class Room {
    players: Player[] = []
    private round: Round = new Round()
    private isCounting = false

    addPlayer(player: Player) {
        this.players.push(player)
    }

    isOpen(): boolean {
        return this.players.length === 1
    }

    hasAnyPlayers(): boolean {
        return this.players.length > 0
    }

    removePlayerFromRoom(player: Player) {
        this.players = this.players.filter(p => p !== player)
    }

    endRound(player: Player) {
        const lostPlayer = this.players.find(p => p !== player)
        if (lostPlayer) {
            lostPlayer.result(false, this.round.reward / 2)
        }
        player.result(true, this.round.reward / 2)
        if (player.wonDuel) {
            setTimeout(this.endDuel.bind(this), ROUND_START_DELAY)
            return
        }
        setTimeout(this.startNewRound.bind(this), ROUND_START_DELAY)
    }

    stopCounting() {
        if (!this.isCounting) { return }
        this.isCounting = false
        const reward = this.round.end(Date.now())
        const payload: CountingStopped = { reward }
        this.sendToAll({
            type: MessageTypes.COUNTING_STOPPED,
            payload
        })
    }

    onPlayerReady() {
        if (this.players.every(p => p.isReady)) {
            this.countDownNewDuel(3)
        }
    }

    requestToStart() {
        this.sendToAll({ type: MessageTypes.START_REQUEST })
    }

    duelReject() {
        this.sendToAll({ type: MessageTypes.DUEL_REJECT })
        this.clearRoom()
    }

    private endDuel() {
        this.players.forEach(player => {
            player.finishDuel()
        })
        this.clearRoom()
    }

    private clearRoom() {
        this.players.forEach(p => {
            p.room = null
            p.isWaiting = true
        })
    }

    private sendToAll(msg: Message) {
        this.players.forEach(player => {
            player.sendMsg(msg)
        })
    }

    private countDownNewDuel(secondsLeft: number) {
        if (secondsLeft < 1) {
            this.startNewRound()
            return
        }
        const payload: CountDownNewDuel = { secondsLeft }
        this.sendToAll({
            type: MessageTypes.COUNT_DOWN,
            payload
        })
        setTimeout(() => {
            this.countDownNewDuel(--secondsLeft)
        }, 1000)
    }

    private startNewRound() {
        this.isCounting = true
        this.round.newRound()
        this.round.start(Date.now())
        const payload: RoundStartPayload = { roundNumber: this.round.roundNumber }
        this.sendToAll({
            type: MessageTypes.START_ROUND,
            payload
        })
    }

}
