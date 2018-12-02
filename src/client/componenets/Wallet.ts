import * as Phaser from 'phaser'
import { RegistryFields } from '../state/state'

export class Wallet extends Phaser.GameObjects.Container {
    private reward: number = 0
    private score: Phaser.GameObjects.Text
    private amount: number = 10000
    private walletAmount: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene) {
        super(scene)
        this.score = this.createScore(scene)
        this.walletAmount = this.createWalletAmount(scene)

        this.add([this.score, this.walletAmount])
    }

    setWallet(walletAmount: number): any {
        this.amount = walletAmount
        this.updateWallet()
    }

    startRound(): any {
        this.reward = 0
    }

    setReward(reward: number): any {
        this.reward = reward
        this.amount -= (reward / 2)
        this.updateWallet()
    }

    increaseReward() {
        this.reward += 2
        this.amount--
        this.updateWallet()

    }

    private updateWallet() {
        this.score.setText(`Reward $${this.reward}`)
        this.walletAmount.setText(`Wallet: $${this.amount}`)
    }

    private createScore(scene: Phaser.Scene): Phaser.GameObjects.Text {
        const score = scene.add.text(400, 525, 'Reward $0')
        scene.registry.set(RegistryFields.Reward, this.reward)
        return score
    }

    private createWalletAmount(scene: Phaser.Scene): Phaser.GameObjects.Text {
        return scene.add.text(200, 525, `Wallet: $${this.amount}`)
    }
}
