export interface GameConfig {
    initialPlayerTotalAmount: number
    initialPlayerAmount: number
    counterSpeed: number
}

export const BASE_GAME_CONFIG: GameConfig = {
    initialPlayerTotalAmount: 10000,
    initialPlayerAmount: 1000,
    counterSpeed: 2
}
