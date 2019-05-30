import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { RoundStartPayload } from '../../shared/types/types'
import { Aim } from '../components/Aim'
import { Player, PlayerAnims } from '../components/Player'
import { RoundMenu } from '../components/RoundMenu'
import { Wallet } from '../components/Wallet'
import { Images } from '../config/images'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import { Scenes } from './scenes'
import { WebSocketService } from './WebSocketService'

export class Main extends Phaser.Scene {
    player!: Player
    centerX!: number
    centerY!: number
    private isCountingFaze: boolean = false
    private roundMenu!: RoundMenu
    private wallet!: Wallet
    private aim!: Aim

    constructor() {
        super(Scenes.Main)
    }

    create() {
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.add.sprite(this.centerX, this.centerY, Images.Bg).setScale(1.2)

        this.roundMenu = this.add.existing(new RoundMenu(this)) as RoundMenu
        this.player = this.add.existing(new Player(this, this.centerX, this.centerY + 100)) as Player
        this.wallet = this.add.existing(new Wallet(this)) as Wallet
        this.aim = this.add.existing(new Aim(this)) as Aim

        this.setUpEvents()

        this.roundMenu.beginDuelBtn.visible = this.registry.get(RegistryFields.StartGameVisible)
    }

    update() {
        if (this.isCountingFaze) {
            this.wallet.increaseReward()
        }
    }

    onAimClicked() {
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        webSocketService.aimClicked()
    }

    onBeginDuelClicked(): void {
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        webSocketService.send({ type: MessageTypes.PLAYER_READY })
        this.roundMenu.beginDuelBtn.visible = false
        this.player.play(PlayerAnims.idle)
    }

    onMenuClick(): void {
        this.scene.start(Scenes.Menu)
    }

    stopCounting() {
        if (this.isCountingFaze) {
            const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
            webSocketService.stopCounting()
            this.isCountingFaze = false
        }
    }

    private setUpEvents() {
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        webSocketService.events.on(GameEvents.START_ROUND, this.startRound, this)
        webSocketService.events.on(GameEvents.ROUND_LOST, this.roundEnd(false), this)
        webSocketService.events.on(GameEvents.ROUND_WON, this.roundEnd(true), this)
        webSocketService.events.on(GameEvents.DUEL_FINISHED, this.duelFinished, this)

        this.registry.events.on('changedata', this.updateData, this)
        this.input.on('pointerdown', this.stopCounting, this)
    }

    private duelFinished() {
        this.children.each(c => c.destroy())
        this.scene.start(Scenes.Menu, { asd: true })
    }

    private updateData(parent: Phaser.Scene, key: string, data: any): void {
        if (key === RegistryFields.StartGameVisible) {
            this.roundMenu.beginDuelBtn.visible = data
        }
        if (key === RegistryFields.Reward) {
            this.isCountingFaze = false
            this.activateAim()
            this.wallet.setReward(data.reward)
        }
    }

    private activateAim() {
        this.aim.show()
        this.player.anims.play(PlayerAnims.ready)
    }

    private startRound(payload: RoundStartPayload) {
        this.roundMenu.showRoundNumber(payload.roundNumber)
        this.wallet.startRound()
        this.player.play(PlayerAnims.idle)
        this.isCountingFaze = true
    }

    private roundEnd(isWonRound: boolean): (walletAmount: number) => void {
        const anim = isWonRound ? PlayerAnims.won : PlayerAnims.dead
        return (walletAmount: number) => {
            this.aim.hide()
            this.player.anims.play(anim)
            this.wallet.setWallet(walletAmount)
        }
    }
}
