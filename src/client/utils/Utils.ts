const config = {
    width: 540,
    height: 960
}

const R: number = (config.width as integer) / (config.height as integer)
export const resizeCanvas = () => {
    const canvas = document.getElementById("canvas")
    const overlay = document.getElementById("overlay")
    if (!canvas) {
        return
    }
    let width: number = config.width as integer,
        height: number = config.height as integer

    const ratio = window.innerWidth / window.innerHeight

    if (ratio < R) {
        height = height * window.innerWidth / width
        width = window.innerWidth
    } else {
        height = window.innerHeight
        width = width * window.innerHeight / height
    }

    const scale = Math.min(height / (config.height as number))

    const transformValue = `translate(-50%, -50%) scale(${scale})`
    canvas.style.transform = transformValue
    canvas.style.webkitTransform = transformValue
    if (!overlay) {
        return
    }
    overlay.style.transform = transformValue
    overlay.style.webkitTransform = transformValue
    // tslint:disable-next-line: no-console
    console.log('res', transformValue, Date.now())
}

// DEBUG ONLY
declare global {
    interface Window { log: any }
}
window.log = window.log || {}
