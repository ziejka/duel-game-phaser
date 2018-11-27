export class Round {
    private startTime: number = 0

    start(startTime: number): void {
        this.startTime = startTime
    }

    end(endTime: number): number {
        return endTime - this.startTime
    }
}
