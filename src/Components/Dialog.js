export default class Dialog extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.scene = scene;
        this.width = this.scene.sys.game.config.width;
        this.height = 200;

        this.box = this.scene.add.graphics();
        this.box.fillStyle(0x000000, 0.8); 
        this.box.fillRect(0, 0, this.width, this.height);
        
        this.dialogText = this.scene.add.text(10, 10, '', {
            fontSize: '16px',
            fill: '#ffffff',
            wordWrap: { width: this.width - 20 }
        });

        this.add(this.box);
        this.add(this.dialogText);

        this.scene.add.existing(this);
        this.setDepth(10);
    }

    showDialog(text) {
        this.dialogText.setText(text);
    }

    hideDialog() {
        this.destroy();
    }
}
