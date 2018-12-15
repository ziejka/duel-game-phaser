import * as Phaser from 'phaser'
import { Main } from 'scenes/Main'
import { RegistryFields } from '../state/state'

const START_AMOUNT: number = 1000

const textStyle = {
    color: '#FFFFFF',
    stroke: '#000000',
    fontSize: 24,
    strokeThickness: 3
}

export class Wallet extends Phaser.GameObjects.Container {
    private reward: number = 0
    private score: Phaser.GameObjects.Text
    private amount: number = START_AMOUNT
    private roundStartAmount: number = START_AMOUNT
    private walletAmount: Phaser.GameObjects.Text
    private barsGraphic: Phaser.GameObjects.Graphics
    private countingStartTime: number = 0

    constructor(scene: Main) {
        super(scene)
        this.score = this.createScore(scene)
        this.walletAmount = this.createWalletAmount(scene)
        this.barsGraphic = scene.add.graphics()

        this.add([this.score, this.walletAmount, this.barsGraphic])
    }

    setWallet(walletAmount: number): any {
        this.amount = walletAmount
        this.reward = 0
        this.updateWallet()
    }

    startRound(): any {
        this.reward = 0
        this.roundStartAmount = this.amount
        this.countingStartTime = Date.now()
    }

    setReward(reward: number): any {
        this.reward = reward
        this.amount = this.roundStartAmount - (reward / 2)
        this.updateWallet()
    }

    increaseReward() {
        const rewardAmount = Math.floor((Date.now() - this.countingStartTime) / 8)
        this.reward = rewardAmount
        this.amount = this.roundStartAmount - (rewardAmount / 2)
        this.updateWallet()
    }

    private updateWallet() {
        this.score.setText(`Reward: $${this.reward.toFixed()}`)
        this.walletAmount.setText(`Wallet: $${this.amount.toFixed()}`)
        this.drawBars()
    }

    private drawBars() {
        const maxWidth = 200
        const enemyWallet = START_AMOUNT * 2 - this.amount - this.reward
        const playerWidth = Math.floor((this.amount * maxWidth) / (START_AMOUNT * 2))
        const enemyWidth = Math.floor((enemyWallet * maxWidth) / (START_AMOUNT * 2))
        this.barsGraphic.clear()
        this.barsGraphic.fillStyle(0x000000)
        this.barsGraphic.fillRect(10, 38, maxWidth, 9)
        this.barsGraphic.fillRect(320, 38, maxWidth, 9)
        this.barsGraphic.fillStyle(0xFFFFFF)
        this.barsGraphic.fillRect(12, 40, playerWidth, 5)
        this.barsGraphic.fillRect(322, 40, enemyWidth, 5)
    }

    private createScore(scene: Main): Phaser.GameObjects.Text {
        const score = scene.add.text(10, 80, 'Reward: $0', textStyle)
        scene.registry.set(RegistryFields.Reward, this.reward)
        return score
    }

    private createWalletAmount(scene: Main): Phaser.GameObjects.Text {
        return scene.add.text(10, 50, `Wallet: $${this.amount}`, textStyle)
    }
}
