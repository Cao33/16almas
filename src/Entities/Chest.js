import Dialog from "../Components/Dialog.js";

export default class Chest extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,name, personality){
        super(scene,x,y, 'Chest');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.name=name;
        this.personality = personality;
        this.closed=true;
        this.scene.anims.create({
			key: 'Open',
			frames: scene.anims.generateFrameNumbers('Chest', { start: 0, end: 3}),
			frameRate: 10,
			repeat: 0
		});
    }

    open(){
        if(this.closed){
            this.anims.play('Open'); //animacion de apertura
            this.scene.Ed.getPersonality(this.personality);//entrega de personalidad
            this.closed=false; //lo desactivamos en vez de destruirlo para que quede constancia de su existencia pero no se pueda volver a abrir
            //Creamos el cuadro de dialogo y usamos la camara y el game config para ajustarlo a la parte inferior de la pantalla
            this.dialogBox=new Dialog(this.scene, this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY + this.scene.sys.game.config.height - 50);
            this.dialogBox.showDialog('Has obtenido: '+ this.name + ' ('+this.personality+')');
            this.scene.time.delayedCall(3000, () => { //esperamos 3 segundos antes de ejecutar el último trozo de codigo para dar tiempo a que se lea el dialogo
                this.dialogBox.hideDialog();
                this.scene.Ed.moveAbility(true);
            });            
        }
    }
}