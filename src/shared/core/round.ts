export class Round {
    roundNumber = 0
    private startTime: number = 0

    start(startTime: number): void {
        this.startTime = startTime
    }

    end(endTime: number): number {
        return endTime - this.startTime
    }

    newRound() {
        this.roundNumber++
    }

    resetRoundNumber() {
        this.roundNumber = 0
    }
}
