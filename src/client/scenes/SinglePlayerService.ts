import { Round } from "../../shared/core/round"
import { Message, RoundStartPayload } from "../../shared/types/types"
import { GameEvents } from "../state/events"
import { RegistryFields } from "../state/state"
import { CommunicationService } from "./CommunicationService"
import { Scenes } from "./scenes"

export class SinglePlayerService extends Phaser.Scene implements CommunicationService {
    private round: Round
    private playerAmount: number = 1000
    private stopTimeout: number = 0
    private aimTimeout: number = 0

    constructor() {
        super(Scenes.SinglePlayerService)
        this.round = new Round()
    }

    send(msg: Message): void {

    }

    open(playerName: string): void {
        this.playerAmount = 1000
        setTimeout(() => {
            this.countDownNewDuel(3)
        }, 1000)
    }

    stopCounting() {
        clearTimeout(this.stopTimeout)
        this.round.end(Date.now())
        this.events.emit(GameEvents.UPDATE_REWARD, this.round.reward)
        this.aimTimeout = setTimeout(() => {
            this.playerAmount -= this.round.reward / 2
            this.events.emit(GameEvents.ROUND_LOST, this.playerAmount)
            this.endRound()
        }, Math.random() * 900 + 400)
    }

    aimClicked() {
        clearTimeout(this.aimTimeout)
        this.playerAmount += this.round.reward / 2
        this.events.emit(GameEvents.ROUND_WON, this.playerAmount)
        this.endRound()
    }

    private endRound() {
        if (this.playerAmount >= 2000) {
            this.events.emit(GameEvents.DUEL_FINISHED, true)
            return
        }
        if (this.playerAmount < 1) {
            this.events.emit(GameEvents.DUEL_FINISHED, false)
            return
        }

        setTimeout(() => {
            this.startRound()
        }, 2000)
    }

    private startRound() {
        this.round.newRound()
        this.round.start(Date.now())
        const payload: RoundStartPayload = {
            roundNumber: this.round.roundNumber
        }
        this.events.emit(GameEvents.START_ROUND, payload)
        this.stopTimeout = setTimeout(() => {
            this.stopCounting()
        }, Math.random() * 1500 + 600)
    }

    private countDownNewDuel(secondsLeft: number) {
        if (secondsLeft < 1) {
            this.startRound()
            return
        }
        this.events.emit(GameEvents.COUNT_DOWN, secondsLeft)
        setTimeout(() => {
            this.countDownNewDuel(--secondsLeft)
        }, 1000)
    }
}
