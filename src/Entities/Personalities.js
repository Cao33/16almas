export default class Personalities extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, nameTex) {
        super(scene, x, y, texture);
        this.newTexture = nameTex;
        this.setScale(0.75,0.5);
        this.setInteractive();
        this.on('pointerdown', this.onSelect, this);
        this.active=false;
        this.setDepth(3);
    }

    onSelect() {
        if(this.active){
            for(let i = 0; i<16;i++){
                this.scene.Ed.personalitiesArray[i].setAlpha(1);
            }
            this.scene.Ed.selectPersonality(this.newTexture);
            this.setAlpha(0.5);
        }
    }

    addPersonality(){
        this.active=true;
        this.setTexture(this.newTexture);
    }
}
