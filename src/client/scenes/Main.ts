import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { RoundStartPayload } from '../../shared/types/types'
import { Aim } from '../componenets/Aim'
import { Player, PlayerAnims } from '../componenets/Player'
import { RoundMenu } from '../componenets/RoundMenu'
import { Images } from '../config/images'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import { Scenes } from './scenes'
import { WebScoketService } from './WebScoketService'

interface Callbacks {
    onMenuClick: () => void
    onBeginDuelClicked: () => void
    onAimClicked: () => void
}

export class Main extends Phaser.Scene {
    callbacks: Callbacks
    player!: Player
    private shouldUpdateReward: boolean = false
    private gameMenu!: RoundMenu
    private centerX!: number
    private centerY!: number
    private score!: Phaser.GameObjects.Text
    private reward: number = 0
    private aim!: Aim

    constructor() {
        super(Scenes.Main)

        this.callbacks = {
            onMenuClick: this.onMenuClick,
            onBeginDuelClicked: this.onBeginDuelClicked,
            onAimClicked: this.onAimClicked
        }
    }

    create() {
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.add.sprite(this.centerX, this.centerY, Images.Bg).setScale(1.5)

        this.gameMenu = this.add.existing(new RoundMenu(this)) as RoundMenu
        this.player = this.add.existing(new Player(this, this.centerX, this.centerY)) as Player
        this.score = this.createScore()
        this.aim = this.add.existing(new Aim(this)) as Aim

        this.setUpEvents()

        this.gameMenu.beginDuelBtn.visible = this.registry.get(RegistryFields.StartGameVisible)
    }

    update() {
        if (this.shouldUpdateReward) {
            this.reward++
            this.score.setText('Reward ' + this.reward)
        }
    }

    private createScore(): Phaser.GameObjects.Text {
        const score = this.add.text(400, 525, 'Reward 0')
        score.visible = false
        this.registry.set(RegistryFields.Reward, this.reward)
        return score
    }

    private onAimClicked() {
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.aimClicked()
        this.aim.hide()
    }

    private stopCounting() {
        if (this.shouldUpdateReward) {
            const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
            webScoketService.stopCounting()
        }
    }

    private setUpEvents() {
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.events.on(GameEvents.START_ROUND, this.startRound, this)
        webScoketService.events.on(GameEvents.ROND_LOST, this.roundLost, this)
        webScoketService.events.on(GameEvents.ROND_WON, this.roundWon, this)

        this.registry.events.on('changedata', this.updateData, this)
        this.input.on('pointerdown', this.stopCounting, this)
    }

    private roundWon() {
        this.player.anims.play(PlayerAnims.shoot)
    }

    private roundLost() {
        this.player.anims.play(PlayerAnims.dead)
    }

    private updateData(parent: Phaser.Scene, key: string, data: any): void {
        if (key === RegistryFields.StartGameVisible) {
            this.gameMenu.beginDuelBtn.visible = data
        }
        if (key === RegistryFields.Reward) {
            this.activateAim()
            this.reward = data.reward
        }
    }

    private activateAim() {
        this.shouldUpdateReward = false
        this.score.setText('Reward ' + this.reward)
        const x = Math.random() * (this.sys.canvas.width - 100) + 100
        const y = Math.random() * (this.sys.canvas.height - 100) + 100
        this.aim.show(x, y)
        this.player.anims.play(PlayerAnims.ready)
    }

    private startRound(payload: RoundStartPayload) {
        this.add.text(300, 0, `ROUND ${payload.roundNumber}`)
        this.score.visible = true
        this.shouldUpdateReward = true
    }

    private onBeginDuelClicked(): void {
        const webScoketService: WebScoketService = this.scene.get(Scenes.WebScoketService) as WebScoketService
        webScoketService.send({ type: MessageTypes.PLAYER_READY })
        this.gameMenu.beginDuelBtn.visible = false
        this.player.play(PlayerAnims.idle)
    }

    private onMenuClick(): void {
        this.scene.start(Scenes.Menu)
    }
}
