import { Scene } from "phaser"
import { Message } from "../../shared/types/types"

export interface ComunicationService extends Scene {
    send: (msg: Message) => void
    open: (playerName: string) => void
    stopCounting: () => void
    aimClicked: () => void
}
