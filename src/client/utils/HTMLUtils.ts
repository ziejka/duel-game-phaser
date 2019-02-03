type Display = 'none' | 'block'
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

export const showNameInput = (): void => {
    setVisible('nameWrapper', 'block')
    setInputsAvailable('all')
}

export const hideNameInput = (): void => {
    setVisible('nameWrapper', 'none')
    setInputsAvailable('none')
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
    const name: string = localStorage.getItem('name') || ''
    element.value = name
}
