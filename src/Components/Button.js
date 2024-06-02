export default class Button {
    constructor(scene, image, x, y, cloud) {
        this.image = image;
        this.relatedScene = scene;
        this.x = x;
        this.y = y;
        this.cloud = cloud;
    }

    create() {
        this.button = this.relatedScene.add.sprite(this.x, this.y, this.image).setInteractive();
        
        this.button.on('pointerover', () => { // Al pasar el ratón por encima del botón
            if (this.image == 'playbutton' || this.image == 'menubutton' || this.image == 'shopbutton'){
                this.button.setFrame(1);
            }
        });
        this.button.on('pointerout', () => { // Al sacar el ratón del botón
            if (this.image == 'playbutton' || this.image == 'menubutton' || this.image == 'shopbutton'){
                this.button.setFrame(0);
            }
        });
        this.button.on('pointerdown', () => { // Al clicar el botón
            this.ClickButton();
            if (this.image != 'playbutton' && this.image != 'menubutton' && this.image != 'shopbutton'){
                this.relatedScene.updateLabel();
            }
        });
    }
}