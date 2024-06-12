export default class Dialog extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene = scene;
        this.width = this.scene.sys.game.config.width;
        this.height = 200;

        //Fondo del dialogo
        this.box = this.scene.add.graphics();
        this.box.fillStyle(0x000000, 0.8); 
        this.box.fillRect(0, 0, this.width, this.height);
        
        //Texto del diálogo
        this.dialogText = this.scene.add.text(10, 10, '', {
            fontSize: '16px',
            fill: '#ffffff',
            wordWrap: { width: this.width - 20 }
        });

        //Añadimos el fondo y el texto al container
        this.add(this.box);
        this.add(this.dialogText);

        //Lo añadimos a escena en una depth superior a todo para que no haya GameObjects por delante, dificultando la lectura
        this.scene.add.existing(this);
        this.setDepth(10);
    }

    showDialog(text) {
        this.dialogText.setText(text); //el texto base que era '' le damos un texto que mostrar
    }

    hideDialog() { //hacemos un destroy porque con cada dialogo que se genera se hace un new y así no malgastamos memoria
        this.destroy();
    }
}
