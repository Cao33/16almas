export default class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, text, callback) {
        super(scene, x, y);
        //creamos un boton genérico que no necesite de childs para cada uno de los botones si no que sea el boton que sea funcione correctamente
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.text = text;
        this.callback = callback;

        //Fondo del botón
        this.background = this.scene.add.rectangle(0, 0, width, height, 0xff0000);
        this.background.setOrigin(0.5);

        //Texto del botón
        this.buttonText = this.scene.add.text(0, 0, text, {
            fontSize: '20px',
            fill: '#ffffff'
        });
        this.buttonText.setOrigin(0.5);

        //Añadir fondo y texto al contenedor
        this.add(this.background);
        this.add(this.buttonText);

        //Añadir el contenedor a la escena
        this.scene.add.existing(this);

        //Hacer el botón interactivo
        this.background.setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.onClick());
    }

    onClick() {
        if (this.callback) {
            this.callback();
        }
    }
}
