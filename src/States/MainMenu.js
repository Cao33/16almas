export default class MainMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'MainMenu' });
	}

    create() {
        this.debugText = this.add.text(10, 10, 'MainMenu', {
            font: '16px Arial',
            fill: '#ffffff'
        });
        
        this.startButton = this.add.text(100, 100, 'Start Game', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setInteractive();

        this.startButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.run('PlayState');
        });
    }
}

