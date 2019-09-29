import * as Phaser from 'phaser'
import { BASE_GAME_CONFIG } from '../../shared/gameConfigs'
import { Main } from '../scenes/Main'
import { RegistryFields } from '../state/state'

const START_AMOUNT: number = BASE_GAME_CONFIG.initialPlayerAmount

const textStyle = {
    color: '#FFFFFF',
    stroke: '#000000',
    fontSize: 24,
    strokeThickness: 3
}

export class Wallet extends Phaser.GameObjects.Container {
    scene: Main
    private reward: number = 0
    private score: Phaser.GameObjects.Text
    private amount: number = START_AMOUNT
    private roundStartAmount: number = START_AMOUNT
    private walletAmount: Phaser.GameObjects.Text
    private barsGraphic: Phaser.GameObjects.Graphics
    private countingStartTime: number = 0

    constructor(scene: Main) {
        super(scene)
        this.scene = scene
        this.score = this.createScore(scene)
        this.walletAmount = this.createWalletAmount(scene)
        this.barsGraphic = scene.add.graphics()

        this.add([this.score, this.walletAmount, this.barsGraphic])
        scene.registry.set(RegistryFields.Reward, this.reward)
        this.updateWallet()
    }

    destroy() {
        this.scene.registry.remove(RegistryFields.Reward)
        super.destroy()
    }

    setWallet(amount: number): any {
        this.amount = amount
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
        const newAmount = this.roundStartAmount - (reward / 2)
        this.amount = newAmount < 0 ? 0 : newAmount
        this.updateWallet()
    }

    increaseReward() {
        this.reward = Math.floor((Date.now() - this.countingStartTime) / BASE_GAME_CONFIG.counterSpeed)
        let newAmount = this.roundStartAmount - (this.reward / 2)
        if (newAmount <= 0) {
            newAmount = 0
            this.scene.stopCounting()
        }

        this.amount = newAmount
        this.updateWallet()
    }

    private updateWallet() {
        this.score.setText(`Reward: $${this.reward.toFixed()}`)
        this.walletAmount.setText(`Wallet: $${this.amount.toFixed()}`)
        this.drawBars()
    }

    private drawBars() {
        const maxHeight = 500,
            radius = 6,
            width = 50,
            xOffset = 10,
            yBarPos = this.scene.centerY - maxHeight / 2,
            xEnemy = this.scene.sys.canvas.width - xOffset - width,
            xPlayer = xOffset,
            enemyAmount = START_AMOUNT * 2 - this.amount - this.reward,
            playerHeight = this.getBarHeight(this.amount, maxHeight),
            enemyHeight = this.getBarHeight(enemyAmount, maxHeight),
            yPlayer = yBarPos - 2 + (maxHeight - playerHeight),
            yEnemy = yBarPos - 2 + (maxHeight - enemyHeight)

        this.barsGraphic.clear()
        this.barsGraphic.fillStyle(0x000000)
        this.barsGraphic.fillRoundedRect(xPlayer, yBarPos, width, maxHeight, radius)
        this.barsGraphic.fillRoundedRect(xEnemy, yBarPos, width, maxHeight, radius)
        this.barsGraphic.fillStyle(0xFFFFFF)
        this.barsGraphic.fillRoundedRect(xPlayer + 2, yPlayer, width - 4, playerHeight, radius)
        this.barsGraphic.fillRoundedRect(xEnemy + 2, yEnemy, width - 4, enemyHeight, radius)
    }

    private getBarHeight(amount: number, maxHeight: number): number {
        const height = Math.floor((amount * maxHeight) / (START_AMOUNT * 2)) - 4
        return height < 0 ? 0 : height
    }

    private createScore(scene: Main): Phaser.GameObjects.Text {
        const score = scene.add.text(10, 80, 'Reward: $0', textStyle)
        return score
    }

    private createWalletAmount(scene: Main): Phaser.GameObjects.Text {
        return scene.add.text(10, 50, `Wallet: $${this.amount}`, textStyle)
    }
}
