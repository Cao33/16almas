import Button from "../Components/Buttons.js";

export default class MainMenu extends Phaser.Scene {
	constructor() {
		super({ key: 'MainMenu' });
	}

    create() {        
        //Botón para jugar
        const settingsButton = new Button(this, this.sys.game.config.width/2, 400, 200, 50, 'Play Game', () => {
            this.scene.stop();
            this.scene.run('PlayState'); //se hace un run para mantener el progreso del player en vez de hacer start y reiniciar partida
        });
    }
}

