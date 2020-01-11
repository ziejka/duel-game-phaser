const config = {
    width: 540,
    height: 960
}

const R: number = (config.width as integer) / (config.height as integer)
export const resizeCanvas = () => {
    const game = document.getElementById("game")
    if (!game) {
        return
    }

    const scaleX = window.innerWidth / config.width,
        scaleY = window.innerHeight / config.height

    const scale = Math.min(scaleX, scaleY)

    const transformValue = `scale(${scale})`
    game.style.transform = transformValue
    game.style.webkitTransform = transformValue
}

// DEBUG ONLY
declare global {
    interface Window { log: any }
}
window.log = window.log || {}
