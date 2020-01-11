import * as Phaser from 'phaser'
export class ButtonText extends Phaser.GameObjects.Text {
    constructor(
        scene: Phaser.Scene,
        text: string,
        position: Phaser.Geom.Point,
        onClickCallback: () => void = () => { },
        context: any = scene
    ) {
        super(scene, position.x, position.y, text, { fontFamily: 'Lobster' })
        this.setFontSize(30)
        this.setStroke('#000000', 4)
        this.setInteractive({ useHandCursor: true })
        this.on('pointerdown', onClickCallback, context)
        this.on('pointerup', this.clearTint, this)
        this.on('pointerover', this.onOver, this)
        this.on('pointerout', this.clearTint, this)
    }
    onOver(): void {
        this.setTint(0x1a9980, 0x1a9980, 0x1a9980, 0x1a9980)
    }
}
