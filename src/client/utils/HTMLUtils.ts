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

function showElement(elementName: string, display: Display) {
    setVisible(elementName, display)
    setInputsAvailable('all')
}

function hideElement(elementName: string) {
    setVisible(elementName, 'none')
    setInputsAvailable('none')
}

export const showNameInput = (): void => showElement('nameWrapper', 'block')
export const hideNameInput = (): void => hideElement('nameWrapper')
export const hideWaiting = (): void => hideElement('waiting')
export const showDuelInvite = (enemyName: string): void => {
    const element: HTMLElement | null = window.document.getElementById('duelInvite-msg')
    if (!element) { return }
    element.innerHTML = `${enemyName.slice(0, -5)} challenge you to a duel`
    showElement('duelInvite', 'flex')
}
export const hideDuelInvite = (): void => hideElement('duelInvite')
export const showWaiting = (cancelCallback: () => void): void => {
    showElement('waiting', 'flex')
    const element: HTMLElement | null = window.document.getElementById('waiting-cancel')
    if (!element) {
        return
    }
    element.onmousedown = cancelCallback
}
export const showOutcome = (hasWon: boolean): void => {
    const element: HTMLElement | null = window.document.getElementById('outcome-msg')
    if (!element) {
        return
    }
    element.innerText = `YOU ${hasWon ? 'WON' : 'LOST'}!`
    showElement('outcome', 'block')
}
export const hideOutcome = () => hideElement('outcome')

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
    const name: string = localStorage.getItem('name') || "Player"
    element.value = name
}
