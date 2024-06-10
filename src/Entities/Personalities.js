export default class Personalities extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, nameTex) {
        super(scene, x, y, texture);
        this.newTexture = nameTex;
        this.setScale(0.75,0.5);
        this.setInteractive();
        this.on('pointerdown', this.onSelect, this);
    }

    onSelect() {
        console.log(`Carta seleccionada: `+ this.newTexture);
        this.setTexture(this.newTexture);
    }

}
