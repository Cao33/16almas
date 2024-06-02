export default class PauseState extends Phaser.Scene {
	constructor() {
		super({ key: 'PauseState' });
	}

    create() {
        this.debugText = this.add.text(10, 10, 'PauseState', {
            font: '16px Arial',
            fill: '#ffffff'
        });
        
        this.startButton = this.add.text(100, 100, 'Go Play', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setInteractive();

        this.startButton.on('pointerdown', () => {
            this.scene.start('PlayState');
        });

        this.menuButton = this.add.text(200, 200, 'Go Menu', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setInteractive();

        this.menuButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}

