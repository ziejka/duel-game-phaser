import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { MainSceneData, RoundStartPayload } from '../../shared/types/types'
import { Aim } from '../components/Aim'
import { RoundMenu } from '../components/RoundMenu'
import { Wallet } from '../components/Wallet'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import * as HTMLUtils from '../utils/HTMLUtils'
import { CommunicationService } from './CommunicationService'
import { Scenes } from './scenes'
import { Images, Spine } from '../config/images'

export class Main extends Phaser.Scene {
    centerX!: number
    centerY!: number
    aim!: Aim
    private isCountingFaze: boolean = false
    private roundMenu!: RoundMenu
    private wallet!: Wallet
    private communicationServiceName!: Scenes.SinglePlayerService | Scenes.WebSocketService

    constructor() {
        super(Scenes.Main)
    }

    create({ communicationServiceName }: MainSceneData) {
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.cameras.main.backgroundColor.setTo(42, 65, 82)

        this.communicationServiceName = communicationServiceName

        this.add.sprite(600, 500, Images.Bg);
        // @ts-ignore
        const zomb = this.add.spine(this.centerX, this.centerY, Spine.zombie, 'animation_idle', true)
        zomb.setSkinByName('zombie2')
        // @ts-ignore
        window.zomb = zomb
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
        const webSocketService: CommunicationService = this.scene.get(this.communicationServiceName) as CommunicationService
        webSocketService.aimClicked()
    }

    onBeginDuelClicked(): void {
        const webSocketService: CommunicationService = this.scene.get(this.communicationServiceName) as CommunicationService
        webSocketService.send({ type: MessageTypes.PLAYER_READY })
        this.roundMenu.beginDuelBtn.visible = false
    }

    onMenuClick(): void {
        this.scene.start(Scenes.Menu)
    }

    stopCounting() {
        if (this.isCountingFaze) {
            const webSocketService: CommunicationService = this.scene.get(this.communicationServiceName) as CommunicationService
            webSocketService.stopCounting()
            this.isCountingFaze = false
        }
    }

    private setUpEvents() {
        const webSocketService: CommunicationService = this.scene.get(this.communicationServiceName) as CommunicationService
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
        this.aim.resetAim()
    }

    private roundEnd(isWonRound: boolean): (walletAmount: number) => void {
        return (walletAmount: number) => {
            this.wallet.setWallet(walletAmount)
        }
    }
}
