export default class Personalities extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, newTexture, var1, var2, var3, var4, var5) {
        super(scene, x, y, texture);
        this.newTexture = newTexture;
        this.name = var1;
        this.var2 = var2;
        this.var3 = var3;
        this.var4 = var4;
        this.var5 = var5;
        this.setScale(0.75,0.75);
        this.setInteractive();
        this.on('pointerdown', this.onSelect, this);
    }

    onSelect() {
        console.log(`Carta seleccionada: `+ this.var2);
        this.setTexture(this.newTexture);
    }

}
