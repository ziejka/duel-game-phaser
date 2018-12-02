export class Round {
    roundNumber: number = 0
    reward: number = 0
    private startTime: number = 0

    start(startTime: number): void {
        this.startTime = startTime
        this.reward = 0
    }

    end(endTime: number): number {
        this.reward = Math.floor((endTime - this.startTime) / 8)
        return this.reward
    }

    newRound() {
        this.roundNumber++
    }

    resetRoundNumber() {
        this.roundNumber = 0
    }
}
