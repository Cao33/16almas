import Button from "../Components/Buttons.js";

export default class MainMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'MainMenu' });
	}

    create() {        
        const startButton = new Button(this, this.sys.game.config.width/2, 300, 200, 50, 'Start Game', () => {
            this.scene.stop();
            this.scene.run('PlayState'); //esto se debe cambiar cuando se haga un clean de la escena previa
        });

        const settingsButton = new Button(this, this.sys.game.config.width/2, 400, 200, 50, 'Resume Game', () => {
            this.scene.stop();
            this.scene.run('PlayState');
        });

        const creditsButton = new Button(this, this.sys.game.config.width/2, 500, 200, 50, 'Saved Game', () => {
            // Aqui para añadir un guardado local
        });
    }
}

