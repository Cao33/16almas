import Button from "../Components/Buttons.js";

export default class PauseState extends Phaser.Scene {
	constructor() {
		super({ key: 'PauseState' });
	}

    create() {
        //creamos los botones
        const startButton = new Button(this, this.sys.game.config.width/2, 300, 200, 50, 'Resume Game', () => {
            this.scene.stop();
            this.scene.run('PlayState');//hacemos run para mantener el progreso de la partida
        });

        const settingsButton = new Button(this, this.sys.game.config.width/2, 400, 200, 50, 'Back to menu', () => {
            this.scene.stop();
            this.scene.run('MainMenu'); //Volvemos al menu inicial con un run para mantener las escenas y no crear duplicadas
        });
    }
}

