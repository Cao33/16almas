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

        this.npcType=type; //Hay varios tipos de NPC: base, giver,checker, mission y final
        this.dialogBox=null; //guardamos referencia al cuadro de dialogo
        this.personality=null; //Puede ser personalidad completa o un componente específico
        this.numDialogue=num; //para poder personalizar mejor el juego se da un numero de dialogo
    }

    openDialogue(){
        //creamos un cuadro de dialogo sea el NPC que sea        
        this.dialogBox = new Dialog(this.scene, this.scene.cameras.main.scrollX,this.scene.cameras.main.scrollY + this.scene.sys.game.config.height - 50);
        
        //NPCs que solo dan texto y nada más
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

        //El NPC final es Ed mismo
        else if(this.npcType=='final'){
            this.result=this.scene.Ed.numPersonalities;
            if(this.result<8){ //si Ed tiene menos de 8 personalidades obtenidas se sigue jugando
                this.dialogBox.showDialog('¡¿QUÉ?! ¿Solo tienes ' + this.result + ' personalidades? Piérdete y no vuelvas hasta que no tengas la mitad como mínimo');
            }
            else if(this.result>=8 && this.result<15){//si ha conseguido más de la mitad pero no 15
                this.dialogBox.showDialog('No está mal chico, te queda un poco de camino por recorrer pero valoro tu esfuerzo. ¡Buena vida chico!');
            }
            else{ //si ha conseguido 15 hay un easter egg donde te da la personalidad del CAMPEÓN
                this.dialogBox.showDialog('Enhorabuena, solo te falta la personalidad del campeón, toma. Ahora eres libre de ser como tú quieras ser. Disfruta de la vida chico.\n*Has obtenido: ENFP*');
            }
        }

        //NPCs que te regalan personalidades
        else if(this.npcType=='giver'){
            this.tempText=null; //un string temporal que almacena el primer dialogo del NPC
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
            this.dialogBox.showDialog(this.tempText + '\n*Has recibido: ' + this.personality + '*'); //un showDialog general que añade un primer dialogo y la recompensa    
            this.scene.Ed.getPersonality(this.personality); //Damos la personalidad a Ed         
        }

        //NPCs que te dan mision y luego chequean si la has cumplido
        else if(this.npcType=='mission'){
            if(this.numDialogue==0){ //mision del vino
                if(!this.scene.Ed.hasWine){
                    this.dialogBox.showDialog('He perdido mi vino. ¿Podrías ayudarme?');
                    this.scene.Ed.seeAbility('Vino');
                }
                else{
                    this.dialogBox.showDialog('MIL GRACIAS\nToma esta personalidad como recompensa: ' + this.personality);
                    this.scene.Ed.getPersonality(this.personality);
                }
            }
            else if(this.numDialogue==1){
                if(!this.scene.Ed.hasShield){
                    this.dialogBox.showDialog('He perdido mi escudo. ¡EL COMANDANTE ME VA A MATAR!');
                    this.scene.Ed.seeAbility('Escudo');
                }
                else{
                    this.dialogBox.showDialog('Esto será nuestro secreto, el comandante no lo puede saber nunca\nToma esta personalidad como recompensa: ' + this.personality);
                    this.scene.Ed.getPersonality(this.personality);
                }
            }
            else if(this.numDialogue==2){
                if(!this.scene.Ed.hasGummies){
                    this.dialogBox.showDialog('Tengo ganas de comer golosinas...');
                    this.scene.Ed.seeAbility('Golosinas');
                }
                else{
                    this.dialogBox.showDialog('¡WOW! Me las voy a comer ahora mismo.\nToma esta personalidad como recompensa: ' + this.personality);
                    this.scene.Ed.getPersonality(this.personality);
                }
            }
            else if(this.numDialogue==3){
                if(this.scene.Ed.goldCount<5){
                    this.dialogBox.showDialog('Por 5 monedas te vendo una personalidad.');
                    this.scene.Ed.seeAbility('Monedas');
                }
                else{
                    this.dialogBox.showDialog('¡Vendida!\nHas comprado: ' + this.personality);
                    this.scene.Ed.getPersonality(this.personality);
                }
            }
        }

        //NPCs que dan pistas solo si tienes activa ciertas personalidades
        else if(this.npcType=='checker'){
            if(this.scene.Ed.personalityActive==null){ //el caso de que no haya personalidad seleccionada indica al player que debe seleccionar una
                this.dialogBox.showDialog('Quita bicho raro. Ten un poco de personalidad...');
            }
            else{
                this.check=false;
                for(let i=0; i<4; i++){
                    if(this.scene.Ed.personalityActive[i]==this.personality){
                        this.check=true;
                        if(this.numDialogue==0){ //el 0 es para la Racionalidad (Pista: primer set de plataformas aereas)
                            this.dialogBox.showDialog('Una vez vi a un hombre ascender por el cielo, me dijo que era todo cosa de la PERCEPCIÓN de la realidad');
                        }
                        else if(this.numDialogue==1){ //el 1 es para Extroversion (Pista: la subida al cielo)
                            this.dialogBox.showDialog('Solo un verdadero AVENTURERO podrá llegar a lo más alto');
                        }
                    }
                }
                if(!this.check){//si no es la personalidad deseada
                    this.dialogBox.showDialog('No me gusta tu personalidad');
                }
            }
        }
        this.closeDialogue(); //llamos al cierre independientemente de qué NPC haya sido
    }

    closeDialogue(){
        this.scene.time.delayedCall(3000, () => { //damsos 3 segundos de lectura
            this.dialogBox.hideDialog();
            this.scene.Ed.moveAbility(true);
            if(this.npcType=='final'&&this.result>=8){ //si el NPC era el final y Ed tiene más de 8 personalidades se pasa el juego
                this.scene.endGame();
            }
        });
    }

    whatPersonality(name){ //le decimos al NPC qué personalidad debe dar y si no se llamase a este método this.personality era null en la cosntructora
        this.personality=name;
    }

    preUpdate(t,dt){
        super.preUpdate(t,dt);
    }
}