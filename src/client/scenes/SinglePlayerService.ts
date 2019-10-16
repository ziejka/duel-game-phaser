import { Round } from "../../shared/core/round"
import { Message } from "../../shared/types/types"
import { GameEvents } from "../state/events"
import { RegistryFields } from "../state/state"
import { ComunicationService } from "./ComunicationService"
import { Scenes } from "./scenes"

export class SinglePlayerService extends Phaser.Scene implements ComunicationService {
    private round: Round
    constructor() {
        super(Scenes.SinglePlayerService)
        this.round = new Round()
    }

    send(msg: Message): void {

    }

    open(playerName: string): void {
        this.registry.set(RegistryFields.StartGameVisible, false)
        setTimeout(() => {
            this.registry.set(RegistryFields.StartGameVisible, true)
            this.events.emit(GameEvents.DUEL_ACCEPTED)
        }, 1000)
    }

    stopCounting() { }
    aimClicked() {
    }
}
