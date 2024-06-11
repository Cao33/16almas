import Button from "../Components/Buttons.js";

export default class PauseState extends Phaser.Scene {
	constructor() {
		super({ key: 'PauseState' });
	}

    create() {
        const startButton = new Button(this, this.sys.game.config.width/2, 300, 200, 50, 'Resume Game', () => {
            this.scene.stop();
            this.scene.run('PlayState');
        });

        const settingsButton = new Button(this, this.sys.game.config.width/2, 400, 200, 50, 'Back to menu', () => {
            this.scene.stop();
            this.scene.run('MainMenu');
        });

        const creditsButton = new Button(this, this.sys.game.config.width/2, 500, 200, 50, 'Save', () => {
            // Además de un autoguardado se puede añadir esto
        });
    }
}

