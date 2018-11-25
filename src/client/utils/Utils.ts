import * as Phaser from 'phaser'

const onOver = (object: Phaser.GameObjects.Text) => () => {
    object.setTint(0x4286f4, 0x4286f4, 0x4286f4, 0x4286f4)
}

export const createMenuElement = (scene: Phaser.Scene,
                                  text: string,
                                  position: Phaser.Geom.Point,
                                  onClickCallback: () => void = () => { }): Phaser.GameObjects.Text => {
    const btn = new Phaser.GameObjects.Text(scene, position.x, position.y, text, {})
    btn.setInteractive()
    btn.on('pointerdown', onClickCallback, scene)
    btn.on('pointerup', btn.clearTint, btn)
    btn.on('pointerover', onOver(btn))
    btn.on('pointerout', btn.clearTint, btn)
    return btn
}
