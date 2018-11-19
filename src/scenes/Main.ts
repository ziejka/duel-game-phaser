import { Scene } from 'phaser';

export class Main extends Scene {
    constructor() {
        super("main");
    }

    create() {
        const logo = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'sheet1', 'phaser-logo');

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!music.isPlaying) {
                music.play();
            }

            logo.setPosition(pointer.x, pointer.y);
        });
    }
}
