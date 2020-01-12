import { Round } from "../../shared/core/round"
import { Message } from "../../shared/types/types"
import { GameEvents } from "../state/events"
import { RegistryFields } from "../state/state"
import { CommunicationService } from "./CommunicationService"
import { Scenes } from "./scenes"

export class SinglePlayerService extends Phaser.Scene implements CommunicationService {
    private round: Round
    constructor() {
        super(Scenes.SinglePlayerService)
        this.round = new Round()
    }

    send(msg: Message): void {

    }

    open(playerName: string): void {
        setTimeout(() => {
            this.events.emit(GameEvents.DUEL_ACCEPTED)
        }, 1000)
    }

    stopCounting() { }
    aimClicked() {
    }
}
