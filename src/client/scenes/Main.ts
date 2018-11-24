import 'phaser'
import { MessageTypes } from '../../shared/types'
import { openWebSoket, sendMsg } from '../webSocket/webSocket'

export class Main extends Phaser.Scene {
    constructor() {
        super("main")
    }

    create() {
        const multiplayer = this.add.text(15, 15, "Multiplayer")
        const random = this.add.text(15, 45, "Random")
        multiplayer.setInteractive()
        random.setInteractive()

        multiplayer.on('pointerdown', () => {
            this.tint(multiplayer)
            openWebSoket()
        })

        multiplayer.on('pointerdown', () => {
            multiplayer.setTint(0xff0000, 0xff0000, 0xffff00, 0xff00ff)
        })

        random.on('pointerdown', () => {
            this.tint(random)
            sendMsg({ type: MessageTypes.NEW_GAME })
        })

        this.input.on('gameobjectout', (pointer: any, gameObject: Phaser.GameObjects.Text) => {
            gameObject.clearTint()
        })
    }

    private tint(gameObject: Phaser.GameObjects.Text) {
        gameObject.setTint(0xff0000, 0xff0000, 0xffff00, 0xff00ff)
    }
}
