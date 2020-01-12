import * as Phaser from 'phaser'
import { BASE_GAME_CONFIG } from '../../shared/gameConfigs'
import { Images } from "../config/images"
import { Main } from '../scenes/Main'
import { RegistryFields } from '../state/state'

const START_AMOUNT: number = BASE_GAME_CONFIG.initialPlayerAmount

const textStyle = {
    color: '#FFFFFF',
    stroke: '#000000',
    fontSize: 24,
    fontFamily: 'Lobster',
    strokeThickness: 3
}

export class Wallet extends Phaser.GameObjects.Container {
    scene: Main
    private playerBar!: Phaser.GameObjects.Sprite
    private enemyBar!: Phaser.GameObjects.Sprite
    private reward: number = 0
    private score: Phaser.GameObjects.Text
    private amount: number = START_AMOUNT
    private roundStartAmount: number = START_AMOUNT
    private walletAmount: Phaser.GameObjects.Text
    private enemyAmount!: Phaser.GameObjects.Text
    private countingStartTime: number = 0
    private rewardBar!: Phaser.GameObjects.Sprite

    constructor(scene: Main) {
        super(scene)
        this.scene = scene
        this.score = this.createScore(scene)
        this.walletAmount = this.createWalletAmount(scene)
        this.enemyAmount = this.createEnemyAmount(scene)
        const bars = this.createBars()

        this.add([this.score, this.walletAmount, ...bars])
        this.updateWallet()
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
        const enemyAmount = START_AMOUNT * 2 - this.amount - this.reward
        this.score.setText(`Reward: $${this.reward.toFixed()}`)
        this.walletAmount.setText(`$${this.amount.toFixed()}`)
        this.enemyAmount.setText(`$${enemyAmount.toFixed()}`)
        this.updateBars()
    }

    private createBars() {
        const xOffset = 30,
            playerBarBg = this.scene.add.sprite(xOffset, this.scene.centerY, Images.PlayerBarBg),
            enemyBarBg = this.scene.add.sprite(this.scene.sys.canvas.width - xOffset, this.scene.centerY, Images.PlayerBarBg),
            walletBar = this.scene.add.sprite(this.scene.centerX, this.scene.sys.canvas.height - xOffset - 30, Images.EnemyBarBg)
        this.playerBar = this.scene.add.sprite(xOffset, this.scene.centerY, Images.PlayerBar)
        this.enemyBar = this.scene.add.sprite(this.scene.sys.canvas.width - xOffset, this.scene.centerY, Images.PlayerBar)
        this.rewardBar = this.scene.add.sprite(this.scene.centerX, this.scene.sys.canvas.height - xOffset - 30, Images.EnemyBar)
        this.rewardBar.setRotation(Math.PI / 2)
        walletBar.setRotation(Math.PI / 2)
        const bars = [playerBarBg, enemyBarBg, walletBar, this.playerBar, this.enemyBar, this.rewardBar]
        bars.forEach(b => { b.setScale(.7) })

        return bars
    }

    private updateBars() {
        const barHeight = this.playerBar.height,
            enemyAmount = START_AMOUNT * 2 - this.amount - this.reward,
            playerHealth = this.getBarHeight(this.amount, barHeight),
            rewardBarLength = this.getBarHeight(this.reward, barHeight),
            enemyHealth = this.getBarHeight(enemyAmount, barHeight)

        this.playerBar.setCrop(
            0,
            barHeight - playerHealth,
            this.playerBar.width,
            playerHealth
        )
        this.enemyBar.setCrop(
            0,
            barHeight - enemyHealth,
            this.enemyBar.width,
            enemyHealth
        )
        this.rewardBar.setCrop(
            0,
            (barHeight - rewardBarLength) / 2,
            this.enemyBar.width,
            rewardBarLength
        )
    }

    private getBarHeight(amount: number, maxHeight: number): number {
        const height = Math.floor((amount * maxHeight) / (START_AMOUNT * 2)) - 4
        return height < 0 ? 0 : height
    }

    private createScore(scene: Main): Phaser.GameObjects.Text {
        const score = scene.add.text(scene.centerX - 100, scene.sys.canvas.height - 30, 'Reward: $0', textStyle)
        return score
    }

    private createWalletAmount(scene: Main): Phaser.GameObjects.Text {
        const name = localStorage.getItem('name') || "YOU#123"
        scene.add.text(2, 200, name, textStyle)
        scene.add.text(scene.sys.canvas.width - 70, 200, "Enemy", textStyle)
        return scene.add.text(2, 230, `$${this.amount}`, textStyle)
    }

    private createEnemyAmount(scene: Main): Phaser.GameObjects.Text {
        scene.add.text(scene.sys.canvas.width - 70, 200, "Enemy", textStyle)
        return scene.add.text(scene.sys.canvas.width - 70, 230, `$${this.amount}`, textStyle)
    }
}
