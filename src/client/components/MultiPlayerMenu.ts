import * as Phaser from 'phaser'
import { Menu } from '../scenes/Menu'
import { getNameInputValue, hideNameInput, showNameInput } from '../utils/HTMLUtils'
import { createMenuElement } from '../utils/Utils'

export class MultiPlayerMenu extends Phaser.GameObjects.Container {
    private multiMenu: Phaser.GameObjects.Container

    constructor(scene: Menu) {
        super(scene)

        this.multiMenu = this.createMultiMenu(scene)
        this.add(this.multiMenu)
        this.setVisible(false)
        this.addHTMLListener(scene)
    }

    createMultiMenu(scene: Menu): Phaser.GameObjects.Container {
        const container = new Phaser.GameObjects.Container(scene)

        const playWithRandom = createMenuElement(scene, 'Find opponent', scene.createPosition(-50),
            scene.onPlayRandomClicked)
        const playWithFriend = createMenuElement(scene, 'Play with friend', scene.createPosition(0),
            scene.onPlayWithFriendClicked)

        container.add([playWithRandom, playWithFriend])
        container.setVisible(false)
        return container
    }

    showName(): void {
        this.setVisible(true)
        showNameInput()
    }

    showMultiOptions() {
        hideNameInput()
        this.multiMenu.setVisible(true)
    }

    private addHTMLListener(scene: Menu): void {
        const startBtn: HTMLElement | null = document.getElementById('startBtn')
        if (!startBtn) {
            return
        }
        startBtn.addEventListener('pointerdown', (ev: PointerEvent) => {
            const name = getNameInputValue()
            localStorage.setItem('name', name)
            hideNameInput()
            scene.openWebSocket(name)
            this.multiMenu.setVisible(true)
        })

    }
}
