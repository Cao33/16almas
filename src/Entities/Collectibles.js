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
        //creamos un dialogo nuevo y lo ajustamos usando la camara y la game config
        this.dialogBox=new Dialog(this.scene, this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY + this.scene.sys.game.config.height - 50);
        this.dialogBox.showDialog('Has recogido: '+ this.name);
        this.scene.Ed.hasCollected(this.name); //Avisamos a Ed de qué ha recogido
        this.setVisible(false); //primero lo hacemos invisible porque si lo destruimos no puede seguir el código y salta un error
        this.scene.time.delayedCall(3000, () => {//esperamos 3 segundos para que se pueda leer el dialogo primero
            this.dialogBox.hideDialog();
            this.scene.Ed.moveAbility(true);
            this.destroy();//por último lo destruimos
        });
    }
}