import Dialog from '../Components/Dialog.js';

export default class NPC extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y, npcFile, type, num)
    {
        super(scene,x,y);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.scene.anims.create({
            key: npcFile,
            frames: scene.anims.generateFrameNumbers(npcFile, { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.play(npcFile);
        this.npcType=type;
        this.dialogBox=null;
        this.givePersonality=null; //mal nombre, puede ser personalidad completa o un componente específico
        this.numDialogue=num; //me lo puedo quitar haciendo un aleatorio en los base y un chequeo de letra en checker
    }

    openDialogue(){
        //voy a hacer una pool de dialogos para poder ajustar quién dice qué
        this.dialogBox = new Dialog(this.scene, this.scene.cameras.main.scrollX,this.scene.cameras.main.scrollY + this.scene.sys.game.config.height - 50);
        if(this.npcType=='base'){
            if(this.numDialogue==0){
                this.dialogBox.showDialog('Hola');
            }
            else if(this.numDialogue==0){
                this.dialogBox.showDialog('¡Un viajero!');
            }
            else if(this.numDialogue==1){
                this.dialogBox.showDialog('El mundo es más extenso de lo que parece');
            }
            else if(this.numDialogue==2){
                this.dialogBox.showDialog('¿Pero tú no estabas en la cima del monte?');
            }
            else if(this.numDialogue==3){
                this.dialogBox.showDialog('Bienvenido a estas tierras chico.');
            }
        }
        else if(this.npcType=='final'){
            this.result=this.scene.Ed.numPersonalities;
            if(this.result<8){
                this.dialogBox.showDialog('¡¿QUÉ?! ¿Solo tienes ' + this.result + ' personalidades? Piérdete y no vuelvas hasta que no tengas la mitad como mínimo');
            }
            else if(this.result>=8 && this.result<15){
                this.dialogBox.showDialog('No está mal chico, te queda un poco de camino por recorrer pero valoro tu esfuerzo. ¡Buena vida chico!');
            }
            else{ //es un poco easter egg
                this.dialogBox.showDialog('Enhorabuena, solo te falta la personalidad del campeón, toma. Ahora eres libre de ser como tú quieras ser. Disfruta de la vida chico.\n*Has obtenido: ENFP*');
            }
        }
        else if(this.npcType=='giver'){
            this.tempText=null;
            if(this.numDialogue==0){
                this.tempText= 'Yo soy el comandante del pueblo, ven y aprende de mi.';
            }
            else if(this.numDialogue==1){
                this.tempText='Quería montar una casa pero solo he hecho la puerta. No sé si voy bien...';
            }
            else if(this.numDialogue==2){
                this.tempText='Ya estoy viejo para ser el artesano del pueblo.';
            }
            else if(this.numDialogue==3){
                this.tempText='Bienvenido a la zona imaginaria, será mejor que no mires para abajo.';
            }
            this.dialogBox.showDialog(this.tempText + '\n*Has recibido: ' + this.givePersonality + '*');       
            this.scene.Ed.getPersonality(this.givePersonality);            
        }
        else if(this.npcType=='mission'){
            if(this.numDialogue==0){ //mision del vino
                if(!this.scene.Ed.hasWine){
                    this.dialogBox.showDialog('He perdido mi vino. ¿Podrías ayudarme?');
                    this.scene.Ed.seeAbility('Vino');
                }
                else{
                    this.dialogBox.showDialog('MIL GRACIAS\nToma esta personalidad como recompensa: ' + this.givePersonality);
                    this.scene.Ed.getPersonality(this.givePersonality);
                }
            }
            else if(this.numDialogue==1){
                if(!this.scene.Ed.hasShield){
                    this.dialogBox.showDialog('He perdido mi escudo. ¡EL COMANDANTE ME VA A MATAR!');
                    this.scene.Ed.seeAbility('Escudo');
                }
                else{
                    this.dialogBox.showDialog('Esto será nuestro secreto, el comandante no lo puede saber nunca\nToma esta personalidad como recompensa: ' + this.givePersonality);
                    this.scene.Ed.getPersonality(this.givePersonality);
                }
            }
            else if(this.numDialogue==2){
                if(!this.scene.Ed.hasGummies){
                    this.dialogBox.showDialog('Tengo ganas de comer golosinas...');
                    this.scene.Ed.seeAbility('Golosinas');
                }
                else{
                    this.dialogBox.showDialog('¡WOW! Me las voy a comer ahora mismo.\nToma esta personalidad como recompensa: ' + this.givePersonality);
                    this.scene.Ed.getPersonality(this.givePersonality);
                }
            }
            else if(this.numDialogue==3){
                if(this.scene.Ed.goldCount<5){
                    this.dialogBox.showDialog('Por 5 monedas te vendo una personalidad.');
                    this.scene.Ed.seeAbility('Monedas');
                }
                else{
                    this.dialogBox.showDialog('¡Vendida!\nHas comprado: ' + this.givePersonality);
                    this.scene.Ed.getPersonality(this.givePersonality);
                }
            }
        }
        else if(this.npcType=='checker'){
            if(this.scene.Ed.personalityActive==null){
                this.dialogBox.showDialog('Quita bicho raro. Ten un poco de personalidad...');
            }
            else{
                this.check=false;
                for(let i=0; i<4; i++){
                    if(this.scene.Ed.personalityActive[i]==this.givePersonality){
                        this.check=true;
                        if(this.numDialogue==0){ //el 0 es para la Racionalidad
                            this.dialogBox.showDialog('Una vez vi a un hombre ascender por el cielo, me dijo que era todo cosa de la PERCEPCIÓN de la realidad');
                        }
                        else if(this.numDialogue==1){ //el 1 es para extroversion de la subida al cielo
                            this.dialogBox.showDialog('Solo un verdadero AVENTURERO podrá llegar a lo más alto');
                        }
                    }
                }
                if(!this.check){
                    this.dialogBox.showDialog('No me gusta tu personalidad');
                }
            }
        }
        this.closeDialogue();
    }

    closeDialogue(){
        this.scene.time.delayedCall(3000, () => {
            this.dialogBox.hideDialog();
            this.scene.Ed.moveAbility(true);
            if(this.npcType=='final'&&this.result>=8){
                this.scene.endGame();
            }
        });
    }

    whatPersonality(name){
        this.givePersonality=name;
    }

    preUpdate(t,dt){
        super.preUpdate(t,dt);
    }
}