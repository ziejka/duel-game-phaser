import 'phaser'
import { MessageTypes } from '../../shared/types'
import { Events } from '../state/events'
import { States } from '../state/state'
import { openWebSoket, sendMsg } from '../webSocket/webSocket'

export class Main extends Phaser.Scene {
    private start!: Phaser.GameObjects.Text

    constructor() {
        super("main")
    }

    create() {
        const multiplayer = this.add.text(15, 15, "Multiplayer")
        const random = this.add.text(15, 45, "Random")

        multiplayer.setInteractive()
        random.setInteractive()

        this.start = this.add.text(15, 60, "Start")
        this.start.visible = false

        multiplayer.on('pointerdown', () => {
            this.tint(multiplayer)
            openWebSoket(this.events.emit.bind(this.events))
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

        this.events.on(Events.UPDATE_STATE, this.onUpdateState, this)
    }

    onUpdateState(newState: States) {
        if (newState === States.READY) {
            this.showStart()
        }
    }

    private showStart() {
        this.start.visible = true
        this.start.setInteractive()
        this.start.on('pointerdown', () => {
            this.tint(this.start)
            sendMsg({ type: MessageTypes.PLAYER_READY })
        })
    }

    private tint(gameObject: Phaser.GameObjects.Text) {
        gameObject.setTint(0xff0000, 0xff0000, 0xffff00, 0xff00ff)
    }
}
