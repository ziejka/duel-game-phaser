import * as Phaser from 'phaser'
import { MessageTypes } from '../../shared/types/messageTypes'
import { PlayerInfo } from '../../shared/types/types'
import { Menu } from '../scenes/Menu'
import * as HTMLUtils from '../utils/HTMLUtils'
import { ButtonText } from './ButtonText'

export class MultiPlayerMenu extends Phaser.GameObjects.Container {
    private playersList: Phaser.GameObjects.Container
    private menu: Menu
    private randomEnemyBtn: Phaser.GameObjects.Text

    constructor(scene: Menu) {
        super(scene)

        this.randomEnemyBtn = new ButtonText(scene, '[ RANDOM ]', new Phaser.Geom.Point(350, 20),
            this.onPlayRandomClicked, this).setVisible(false)

        this.menu = scene
        this.playersList = new Phaser.GameObjects.Container(scene)
        this.setVisible(false)
        this.addHTMLListener(scene)
        this.add([this.randomEnemyBtn, this.playersList])
    }

    show(nameSet: boolean = false): void {
        this.setVisible(true)
        if (!nameSet) {
            HTMLUtils.showNameInput()
        }
    }

    updatePlayerList(playersList: PlayerInfo[]) {
        this.playersList.removeAll()
        playersList.forEach((player, index) => {
            const pos = new Phaser.Geom.Point(20, 50 + 60 * index)
            this.playersList.add(
                new ButtonText(this.scene, `${player.position}. ${player.name.slice(0, -5)}     $${player.totalAmount}`,
                    pos, this.onSelectedPlayerClicked.bind(this, player.name)))
        })
        this.randomEnemyBtn.visible = playersList.length > 0
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

    private onPlayRandomClicked() {
        const players = this.playersList.list
        if (players.length < 1) { return }
        const enemy = players[Math.floor(Math.random() * players.length)] as ButtonText
        enemy.emit('pointerdown')
    }
}
