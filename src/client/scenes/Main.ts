import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { MainSceneData, RoundStartPayload } from '../../shared/types/types'
import { Enemy } from '../components/Enemy'
import { RoundMenu } from '../components/RoundMenu'
import { Wallet } from '../components/Wallet'
import { Images } from '../config/images'
import { GameEvents } from '../state/events'
import { RegistryFields } from '../state/state'
import * as HTMLUtils from '../utils/HTMLUtils'
import { CommunicationService } from './CommunicationService'
import { Scenes } from './scenes'

export class Main extends Phaser.Scene {
    centerX!: number
    centerY!: number
    enemy!: Enemy
    private isCountingFaze: boolean = false
    private roundMenu!: RoundMenu
    private wallet!: Wallet
    private communicationServiceName!: Scenes.SinglePlayerService | Scenes.WebSocketService
    private roundText!: Phaser.GameObjects.Text
    private stopButton!: Phaser.GameObjects.Sprite
    private stain!: Phaser.GameObjects.Sprite

    constructor() {
        super(Scenes.Main)
    }

    create({ communicationServiceName }: MainSceneData) {
        this.centerX = this.sys.canvas.width / 2
        this.centerY = this.sys.canvas.height / 2
        this.cameras.main.backgroundColor.setTo(42, 65, 82)
        this.communicationServiceName = communicationServiceName
        this.add.sprite(this.centerX, this.centerY, Images.Bg)
        this.enemy = this.add.existing(new Enemy(this)) as Enemy
        this.wallet = this.add.existing(new Wallet(this)) as Wallet
        this.stopButton = this.add.sprite(this.centerX, this.sys.canvas.height - 120, Images.Stop)
        this.stopButton.on('pointerdown', this.stopCounting, this)

        this.stain = this.add.sprite(this.centerX, this.centerY, Images.BigStain)
        this.stain.setVisible(false)

        this.roundMenu = this.add.existing(new RoundMenu(this)) as RoundMenu
        this.roundText = this.add.text(this.centerX, this.centerY - 200, "New Duel", {
            fontFamily: "Lobster",
            fontSize: "60px",
            stroke: "#000000",
            strokeThickness: 5
        })
        this.physics.add.existing(this.enemy)

        this.setUpEvents()
        this.onBeginDuelRequest()
    }

    update() {
        if (this.isCountingFaze) {
            this.wallet.increaseReward()
        }
    }

    onAimClicked() {
        this.enemy.disable()
        const webSocketService: CommunicationService = this.scene.get(this.communicationServiceName) as CommunicationService
        webSocketService.aimClicked()
    }

    onBeginDuelRequest(): void {
        const webSocketService: CommunicationService = this.scene.get(this.communicationServiceName) as CommunicationService
        webSocketService.send({ type: MessageTypes.PLAYER_READY })
    }

    onMenuClick(): void {
        this.scene.start(Scenes.Menu)
    }

    stopCounting() {
        if (this.isCountingFaze) {
            const webSocketService: CommunicationService = this.scene.get(this.communicationServiceName) as CommunicationService
            this.isCountingFaze = false
            webSocketService.stopCounting()
        }
    }

    private setUpEvents() {
        const webSocketService: CommunicationService = this.scene.get(this.communicationServiceName) as CommunicationService
        webSocketService.events.destroy()
        webSocketService.events.on(GameEvents.START_ROUND, this.startRound, this)
        webSocketService.events.on(GameEvents.ROUND_LOST, this.roundLost, this)
        webSocketService.events.on(GameEvents.ROUND_WON, this.roundWon, this)
        webSocketService.events.on(GameEvents.DUEL_FINISHED, this.duelFinished, this)
        webSocketService.events.on(GameEvents.COUNT_DOWN, this.showCountDown, this)

        this.registry.events.on('changedata', this.updateData, this)
    }

    private showCountDown(secondsLeft: number) {
        this.tweens.killTweensOf(this.roundText)
        this.roundText.setScale(1)
        this.roundText.setText(secondsLeft.toString())
        this.tweens.add({
            targets: this.roundText,
            scale: .8,
            duration: 1000,
            onComplete: () => this.roundText.setAlpha(0)
        })
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
        if (key === RegistryFields.Reward) {
            this.stopButton.disableInteractive()
            this.tweens.add({
                targets: this.stopButton,
                alpha: .8,
                scale: .95,
                duration: 100,
                ease: "Bounce"
            })
            this.tweens.killTweensOf(this.enemy)
            this.isCountingFaze = false
            const point = this.getRandomAimPosition()
            this.moveEnemy(point, 200)
            this.enemy.enable()
            this.wallet.setReward(data.reward)
        }
    }

    private startRound(payload: RoundStartPayload) {
        this.tweens.killTweensOf(this.roundText)
        this.roundText.setAlpha(1)
        this.roundText.setScale(1)
        this.roundText.setText("GO!")
        this.tweens.add({
            targets: this.roundText,
            scale: .8,
            alpha: .5,
            duration: 400,
            onComplete: () => this.roundText.setAlpha(0)
        })
        this.stopButton.setInteractive()
        this.tweens.add({
            targets: this.stopButton,
            alpha: 1,
            scale: 1,
            duration: 100,
            ease: "Bounce"
        })
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

    private roundWon(walletAmount: number) {
        this.enemy.hit()
        this.roundEnd(walletAmount)
    }
    private roundLost(walletAmount: number) {
        this.stain.setVisible(true)
        this.stain.setAlpha(.7)
        this.tweens.add({
            targets: this.stain,
            alpha: 0,
            duration: 1000,
            ease: "Cubic.easeIn",
            onComplete: () => this.stain.setVisible(false)
        })
        this.roundEnd(walletAmount)
    }

    private roundEnd(walletAmount: number): void {
        this.enemy.disable()
        this.wallet.setWallet(walletAmount)
    }

    private getRandomAimPosition(): Phaser.Geom.Point {
        const x = Math.floor(Math.random() * (this.sys.canvas.width - 200)) + 100
        const y = Math.floor(Math.random() * (this.sys.canvas.height - 400)) + 200
        return new Phaser.Geom.Point(x, y)
    }
}
