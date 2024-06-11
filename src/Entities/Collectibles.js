import Dialog from "../Components/Dialog.js";

export default class Collectibles extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,tex){
        super(scene,x,y,tex);
        this.name=tex;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setVisible(false);
    }

    onCollect(){
        this.dialogBox=new Dialog(this.scene, this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY + this.scene.sys.game.config.height - 50);
        this.dialogBox.showDialog('Has recogido: '+ this.name);
        this.scene.Ed.hasCollected(this.name); //pasar por aqui es una tonteria como el inventario
        this.setVisible(false);
        this.scene.time.delayedCall(3000, () => {
            this.dialogBox.hideDialog();
            this.scene.Ed.moveAbility(true);
            this.destroy();
        });
    }
}