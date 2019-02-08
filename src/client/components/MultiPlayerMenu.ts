import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { Menu } from '../scenes/Menu'
import * as HTMLUtils from '../utils/HTMLUtils'
import { createMenuElement } from '../utils/Utils'

export class MultiPlayerMenu extends Phaser.GameObjects.Container {
    private multiMenu: Phaser.GameObjects.Container
    private playersList: Phaser.GameObjects.Container
    private menu: Menu

    constructor(scene: Menu) {
        super(scene)

        this.menu = scene
        this.multiMenu = this.createMultiMenu(scene)
        this.playersList = new Phaser.GameObjects.Container(scene).setVisible(false)
        this.add([this.multiMenu, this.playersList])
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
        HTMLUtils.showNameInput()
    }

    showMultiOptions() {
        HTMLUtils.hideNameInput()
        this.multiMenu.setVisible(true)
    }

    showPlayerList() {
        this.playersList.setVisible(true)
        this.multiMenu.setVisible(false)
    }

    updatePlayerList(names: string[]) {
        this.playersList.removeAll()
        names.forEach((name, index) => {
            const pos = new Phaser.Geom.Point(20, 50 + 40 * index)
            this.playersList.add(
                createMenuElement(this.scene, name, pos, this.onSelectedPlayerClicked.bind(this, name)))
        })
    }

    createName(name: string): void {
        this.add(new Phaser.GameObjects.Text(this.scene, 200, 0, name, {
            fontSize: 20
        }))
    }

    private addHTMLListener(scene: Menu): void {
        const startBtn: HTMLElement | null = document.getElementById('startBtn')
        const acceptDuelInvite: HTMLElement | null = document.getElementById('duelInvite-yes')
        const rejectDuelInvite: HTMLElement | null = document.getElementById('duelInvite-no')
        if (!startBtn || !acceptDuelInvite || !rejectDuelInvite) {
            return
        }
        startBtn.onmousedown = () => {
            const name = HTMLUtils.getNameInputValue()
            localStorage.setItem('name', name)
            HTMLUtils.hideNameInput()
            scene.openWebSocket(name)
            this.multiMenu.setVisible(true)
        }
        acceptDuelInvite.onmousedown = () => {
            scene.duelAccepted()
            HTMLUtils.hideDuelInvite()
        }
        rejectDuelInvite.onmousedown = () => {
            scene.duelRejected()
            HTMLUtils.hideDuelInvite()
        }
    }

    private onSelectedPlayerClicked(name: string): void {
        const menu = this.menu
        this.menu.sendMsg({ type: MessageTypes.CONNECT_WITH_PLAYER, payload: name })
        HTMLUtils.showWaiting(() => {
            HTMLUtils.hideWaiting()
            menu.duelRejected()
        })
    }
}
