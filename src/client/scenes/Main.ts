import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { RoundStartPayload } from '../../shared/types/types'
import { Aim } from '../components/Aim'
import { RoundMenu } from '../components/RoundMenu'
import { Wallet } from '../components/Wallet'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import * as HTMLUtils from '../utils/HTMLUtils'
import { Scenes } from './scenes'
import { WebSocketService } from './WebSocketService'

export class Main extends Phaser.Scene {
    centerX!: number
    centerY!: number
    aim!: Aim
    private isCountingFaze: boolean = false
    private roundMenu!: RoundMenu
    private wallet!: Wallet

    constructor() {
        super(Scenes.Main)
    }

    create() {
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.cameras.main.backgroundColor.setTo(42, 65, 82)

        this.wallet = this.add.existing(new Wallet(this)) as Wallet
        this.aim = this.add.existing(new Aim(this)) as Aim
        this.roundMenu = this.add.existing(new RoundMenu(this)) as RoundMenu

        this.setUpEvents()

        this.roundMenu.beginDuelBtn.visible = this.registry.get(RegistryFields.StartGameVisible)
    }

    update() {
        if (this.isCountingFaze) {
            this.wallet.increaseReward()
        }
    }

    onAimClicked() {
        this.aim.disable()
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        webSocketService.aimClicked()
    }

    onBeginDuelClicked(): void {
        const webSocketService: WebSocketService = this.scene.get(Scenes.WebSocketService) as WebSocketService
        webSocketService.send({ type: MessageTypes.PLAYER_READY })
        this.roundMenu.beginDuelBtn.visible = false
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

    private duelFinished(hasWon: boolean) {
        this.showOutcome(hasWon)
    }

    private showOutcome(hasWon: boolean) {
        HTMLUtils.showOutcome(hasWon)
        setTimeout(() => {
            this.endScene()
            HTMLUtils.hideOutcome()
        }, 3000)
    }

    private endScene() {
        this.children.each(c => c.destroy())
        this.scene.start(Scenes.Menu, { asd: true })
    }

    private updateData(parent: Phaser.Scene, key: string, data: any): void {
        if (key === RegistryFields.StartGameVisible) {
            this.roundMenu.beginDuelBtn.visible = data
        }
        if (key === RegistryFields.Reward) {
            this.isCountingFaze = false
            this.aim.enable()
            this.wallet.setReward(data.reward)
        }
    }

    private startRound(payload: RoundStartPayload) {
        this.roundMenu.showRoundNumber(payload.roundNumber)
        this.wallet.startRound()
        this.isCountingFaze = true
    }

    private roundEnd(isWonRound: boolean): (walletAmount: number) => void {
        return (walletAmount: number) => {
            this.wallet.setWallet(walletAmount)
        }
    }
}
