import { BASE_GAME_CONFIG } from '../gameConfigs'

export class Round {
    roundNumber: number = 0
    reward: number = 0
    duelFinished: boolean = false
    private startTime: number = 0
    private maxReward: number = BASE_GAME_CONFIG.initialPlayerAmount * 2
    private counterSpeed: number = BASE_GAME_CONFIG.counterSpeed

    start(startTime: number): void {
        this.startTime = startTime
        this.reward = 0
    }

    end(endTime: number): number {
        this.reward = Math.floor((endTime - this.startTime) / this.counterSpeed)
        if (this.reward > this.maxReward) {
            this.reward = this.maxReward
            this.duelFinished = true
        }
        return this.reward
    }

    newRound() {
        this.roundNumber++
    }

    resetRoundNumber() {
        this.roundNumber = 0
    }
}
