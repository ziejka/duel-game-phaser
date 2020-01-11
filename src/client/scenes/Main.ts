import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { MainSceneData, RoundStartPayload } from '../../shared/types/types'
import { Aim } from '../components/Aim'
import { RoundMenu } from '../components/RoundMenu'
import { Wallet } from '../components/Wallet'
import { Images, Spine } from '../config/images'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import * as HTMLUtils from '../utils/HTMLUtils'
import { CommunicationService } from './CommunicationService'
import { Scenes } from './scenes'

export class Main extends Phaser.Scene {
    centerX!: number
    centerY!: number
    aim!: Aim
    private isCountingFaze: boolean = false
    private roundMenu!: RoundMenu
    private wallet!: Wallet
    private communicationServiceName!: Scenes.SinglePlayerService | Scenes.WebSocketService
    private enemy!: any

    constructor() {
        super(Scenes.Main)
    }

    create({ communicationServiceName }: MainSceneData) {
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.cameras.main.backgroundColor.setTo(42, 65, 82)

        this.communicationServiceName = communicationServiceName

        this.add.sprite(this.centerX, this.centerY, Images.Bg)
        // @ts-ignore
        this.enemy = this.add.spine(this.centerX, this.centerY, Spine.zombie, 'animation_idle', true)
        this.enemy.setSkinByName('zombie2')
        this.aim = this.add.existing(new Aim(this)) as Aim
        this.wallet = this.add.existing(new Wallet(this)) as Wallet
        this.roundMenu = this.add.existing(new RoundMenu(this)) as RoundMenu
        this.physics.add.existing(this.enemy)

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
        webSocketService.events.destroy()
        webSocketService.events.on(GameEvents.START_ROUND, this.startRound, this)
        webSocketService.events.on(GameEvents.ROUND_LOST, this.roundEnd, this)
        webSocketService.events.on(GameEvents.ROUND_WON, this.roundEnd, this)
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
            this.scene.start(Scenes.Menu)
            HTMLUtils.hideOutcome()
        }, 3000)
    }

    private updateData(parent: Phaser.Scene, key: string, data: any): void {
        if (key === RegistryFields.StartGameVisible) {
            this.roundMenu.beginDuelBtn.visible = data
        }
        if (key === RegistryFields.Reward) {
            this.tweens.killAll()
            this.isCountingFaze = false
            const point = this.getRandomAimPosition()
            this.aim.enable(point)
            this.wallet.setReward(data.reward)
            this.moveEnemy(point, 200)
        }
    }

    private startRound(payload: RoundStartPayload) {
        this.roundMenu.showRoundNumber(payload.roundNumber)
        this.wallet.startRound()
        this.isCountingFaze = true
        this.randomizeEnemy()
    }

    private randomizeEnemy() {
        // tslint:disable-next-line: no-unused-expression
        this.isCountingFaze && this.moveEnemy(this.getRandomAimPosition(), Math.floor(Math.random() * 1200) + 400)
    }

    private moveEnemy({ x, y }: Phaser.Geom.Point, duration: number) {
        this.tweens.add({
            targets: this.enemy,
            x,
            y,
            duration,
            ease: 'Power1',
            onComplete: this.randomizeEnemy,
            onCompleteScope: this
        })
    }

    private roundEnd(walletAmount: number): void {
        this.aim.disable()
        this.wallet.setWallet(walletAmount)
    }

    private getRandomAimPosition(): Phaser.Geom.Point {
        const x = Math.floor(Math.random() * (this.sys.canvas.width - 200)) + 100
        const y = Math.floor(Math.random() * (this.sys.canvas.height - 400)) + 200
        return new Phaser.Geom.Point(x, y)
    }
}
