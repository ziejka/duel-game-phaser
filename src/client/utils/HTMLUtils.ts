type Display = 'none' | 'block' | 'flex'
type PointerEvents = 'all' | 'none'

function setVisible(id: string, display: Display): void {
    const element: HTMLElement | null = window.document.getElementById(id)
    if (!element) {
        return
    }
    element.style.display = display
}

function setInputsAvailable(pointerEvents: PointerEvents): void {
    const element: HTMLElement | null = window.document.getElementById('overlay')
    if (!element) {
        return
    }
    element.style.pointerEvents = pointerEvents
}

function setCanvasOpacity(opacity: number): void {
    const element: HTMLElement | null = window.document.querySelector('canvas')
    if (!element) {
        return
    }
    element.style.opacity = opacity.toString()
}

export const showNameInput = (): void => {
    setVisible('nameWrapper', 'block')
    setInputsAvailable('all')
}

export const hideNameInput = (): void => {
    setVisible('nameWrapper', 'none')
    setInputsAvailable('none')
}

export const showDuelInvite = (enemyName: string): void => {
    const element: HTMLElement | null = window.document.getElementById('duelInvite-msg')
    if (!element) { return }
    element.innerHTML = `${enemyName.slice(0, -5)} challenge you to a duel`
    setVisible('duelInvite', 'flex')
    setInputsAvailable('all')
    setCanvasOpacity(0.5)
}

export const getNameInputValue = (): string => {
    const element: HTMLInputElement | null = window.document.getElementById('name') as HTMLInputElement
    if (!element) {
        return ''
    }
    return element.value
}

export const retrieveNameFromStorage = (): void => {
    const element: HTMLInputElement | null = window.document.getElementById('name') as HTMLInputElement
    if (!element) {
        return
    }
    const name: string = localStorage.getItem('name') || "Player " + Math.floor(Math.random() * 10000)
    element.value = name
}
