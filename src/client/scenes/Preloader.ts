import { Scene } from 'phaser'
import { Images, Spine } from '../config/images'
import { config } from '../config/preload'
import { Scenes } from './scenes'

export class Preloader extends Scene {
    constructor() {
        super({
            key: Scenes.Preloader
        })
    }

    preload() {
        // add the loading bar to use as a display for the loading progress of the remainder of the assets
        this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'barBg')
        const bar = this.add.sprite(this.sys.canvas.width / 2, this.sys.canvas.height / 2, 'bar')

        const mask = this.make.graphics({
            x: bar.x - (bar.width / 2),
            y: bar.y - (bar.height / 2),
            add: false
        })
        mask.fillRect(0, 0, 0, bar.height)

        bar.mask = new Phaser.Display.Masks.GeometryMask(this, mask)

        this.load.on('progress', (progress: number) => {
            mask.clear()
            mask.fillRect(0, 0, bar.width * progress, bar.height)
        })

        // load assets declared in the preload config
        this.load.image(Images.Bg, '../assets/images/bg.png')
        this.load.image(Images.Aim, '../assets/images/aim.png')
        this.load.image(Images.Particle, '../assets/images/p.png')
        this.load.spritesheet(Images.Player, '../assets/spritesheets/player.png',
            { frameHeight: 240, frameWidth: 240 })

        this.loadAudio()
        this.load.setPath('../assets/spine/')
        // @ts-ignore
        this.load.spine(Spine.zombie, 'skeleton.json', 'skeleton.atlas', true)
    }

    create() {
        this.scene.start(Scenes.Menu)
    }

    loadAudio() {
        const audioPath = config.audioPath
        const audioFiles = config.audioFiles

        this.load.setPath(audioPath)

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < audioFiles.length; i++) {
            this.load.audio(audioFiles[i].key, audioFiles[i].mp3, audioFiles[i].ogg)
        }
    }
}
