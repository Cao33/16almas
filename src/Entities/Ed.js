import Personalities from './Personalities.js';
import Dialog from '../Components/Dialog.js';

export default class Ed extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y)
    {
        super(scene,x,y);
        //Añadimos a escena y en profundidad adecuada
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDepth(1);

        //Añadimos los inputs de teclado
        this.a = this.scene.input.keyboard.addKey('A');
        this.d = this.scene.input.keyboard.addKey('D');
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.e = this.scene.input.keyboard.addKey('E');
        this.e.on('down', this.interact, this); //Tecla especial para que solo se detecte cuando se pulsa la tecla y no si se mantiene
        this.i = this.scene.input.keyboard.addKey('I');
        this.i.on('down', this.manageInv, this); //Tecla especial para que solo se detecte cuando se pulsa la tecla y no si se mantiene

        //Variables de movimiento
        this.maxFall=1000; //velocidad de caida máxima para no atravesar los tiles
        this.speedX = 0;
		this.speedY = 0;
        this.seconds = 0; //segundos para usar en el mrua de la gravedad
        this.canMove=true;
        this.firstDialogue=false; //Si estamos en el primer dialogo lo tenemos en cuenta porque debemos pulsar la E
        this.dialogBox=null; //guardamos la referencia para usarlo en startGame e Interact

        //Inventario y personalidades
        this.activeInventory = false; //si tenemos abierto el inventario
        this.inventory = this.scene.add.image(0,0,'InventoryPNG'); //imagen del inventario
        this.inventory.setDepth(1); //depth para que se vea por encima del player
        this.inventory.setVisible(false); //de primeras lo ponemos invisible
        this.personalitiesArray=[]; //array donde guardamos las referencias a todas las personalidades
        this.personalitiesTraits=['ENFJ','ENFP','ENTJ','ENTP','ESFJ','ESFP','ESTJ','ESTP','INFJ','INFP','INTJ','INTP','ISFJ','ISFP','ISTJ','ISTP']; //componentes para facilitar el startGame
        this.personalityActive=null; //al principio no tenemos ninguna personalidad seleccionada
        this.numPersonalities=0; //Numero de personalidades obtenidas hasta el momento

        //Camara para facilitar las referencias
        this.camera = this.scene.cameras.main;

        //Interacciones
        this.overlappingNPC = null; //pointer al NPC con el que hagamos overlap
        this.canTalk=false; //si tenemos algun NPC con el que hablar 
        this.overlappingChest=null; //pointer al Chest con el que hagamos overlap
        this.canOpenChest=false; //si tenemos un chest cerca
        this.overlappingCollectible=null; //pointer al coleccionable con el que hagamos overlap
        this.canCollect=false; //si tenemos un collectible cerca

        //Misiones
        this.hasWine=false; //si hemos recogido el vino
        this.hasShield=false; //si hemos recogido el escudo
        this.hasGummies=false; //si hemos recogido las gominolas
        this.goldCount=0; //el numero de monedas que hemos cogido

        //Creamos las animaciones y hacemos play de una de ellas desde un inicio
        this.scene.anims.create({
			key: 'EdIdleAnim',
			frames: scene.anims.generateFrameNumbers('EdIdle', { start: 0, end: 3}),
			frameRate: 10,
			repeat: -1
		});

        this.scene.anims.create({
			key: 'EdRightAnim',
			frames: scene.anims.generateFrameNumbers('EdRight', { start: 0, end: 5}),
			frameRate: 10,
			repeat: -1
		});

        this.scene.anims.create({
			key: 'EdLeftAnim',
			frames: scene.anims.generateFrameNumbers('EdLeft', { start: 0, end: 5}),
			frameRate: 10,
			repeat: -1
		});
        this.play('EdIdleAnim');
    }

    manageInv(){
        if(this.activeInventory){ //si el inventario estaba abierto
            this.inventory.setVisible(false);
            this.activeInventory=false;
            this.canMove=true; //el player se puede volver a mover
            for(let i=0;i<16;i++){
                this.personalitiesArray[i].setVisible(false); //ponemos todas las personalidades ocultas
            }
        }
        else{ //si el inventario esta cerrado
            this.moveAbility(false); //llamamos al que gestiona los cambios de movimiento así
            this.inventory.setPosition(this.camera.scrollX+this.camera.width/2, this.camera.scrollY+this.camera.height/2); //ajustamos el inventario en el centro de la pantalla
            this.inventory.setVisible(true);
            for(let i=0;i<16;i++){
                this.personalitiesArray[i].setPosition((this.inventory.x-this.inventory.width/2) + 100 +200*(i%4), (this.inventory.y-this.inventory.height/2) + 125 + 100*((i/4)|0));
                        this.personalitiesArray[i].setVisible(true);
            }
            this.activeInventory=true;
        }
    }

    inputLogic() //aqui solo tenemos en cuenta el movimiento
    {
        if(this.canMove){ //si se puede mover el player
            if(this.d.isDown && this.x<(this.scene.map.widthInPixels-this.width/2)){
                this.speedX=200;
                if(this.anims.currentAnim.key!='EdRightAnim'){                    
                    this.play('EdRightAnim');
                }

            }
            else if(this.a.isDown && this.x>0+this.width/2){
                this.speedX=-200;
                if(this.anims.currentAnim.key!='EdLeftAnim'){
                    this.play('EdLeftAnim');
                }
            }
            else {
                this.speedX=0;
                if(this.anims.currentAnim.key!='EdIdleAnim'){
                    this.play('EdIdleAnim');
                }

            }    

            if(this.body.blocked.down){
                if(this.spaceKey.isDown){
                    this.seconds=0;
                    this.speedY = -450;
                }
                else{ //si está en el suelo
                    this.seconds=0; 
                    this.speedY=200; //si fuera 0 pasaria de ser body blocked a body embeded, es 200 para dar una velocidad incial de caida
                }
            }
            else{ //lógica de caida
                if(this.speedY<this.maxFall){//sin pasarse de la velocidad máxima
                    this.speedY+=40*this.seconds; //una formula de un m.r.u.a. básica
                }
            }
        }
    }

    checkInteract() { //controlamos las overlap del player
        this.overlappingNPC = null; // Reiniciar el NPC con el que se está superponiendo
        this.overlappingChest= null; //reiniciar el chest con el que hay overlap
        this.overlappingCollectible=null; //reiniciar el collectible con el que hay overlap

        this.scene.npcArray.forEach(npc => {
            if (this.scene.physics.overlap(this, npc)) {
                this.overlappingNPC = npc; // Almacenar el NPC con el que se está superponiendo
                this.canTalk=true; //damos el true a que el player pueda hablar con alguien
            }
        });
        if(this.overlappingNPC==null){//si despues del forEach no detecta nada
            this.canTalk=false;
        }

        this.scene.chestArray.forEach(chest => {
            if (this.scene.physics.overlap(this, chest)) {
                this.overlappingChest = chest; // Almacenar el chest con el que se está superponiendo
                this.canOpenChest=true;//damos el true a que el player pueda abrir un cofre
            }
        });
        if(this.overlappingChest==null){//si despues del forEach no detecta nada
            this.canOpenChest=false;
        }

        this.scene.collectiblesArray.forEach(collect => {
            if (this.scene.physics.overlap(this, collect)) {
                this.overlappingCollectible = collect; // Almacenar el collectible con el que se está superponiendo
                this.canCollect=true;//damos el true a que el player recoger un objeto
            }
        });
        if(this.overlappingCollectible==null){//si despues del forEach no detecta nada
            this.canCollect=false;
        }
    }

    interact(){ //logica de interaccion con el entorno, tecla E.onDown
        if(this.firstDialogue){ //si estamos en el primer dialogo lo ocultamos
            this.dialogBox.hideDialog();
            this.dialogBox=null;
            this.firstDialogue=false;
            this.moveAbility(true);
        }

        if(this.canTalk && this.canMove){//doble comprobacion para que cuando Ed ya está hablando con alguien, no se repita este if si se pulsa la E de nuevo
            this.moveAbility(false);
            this.overlappingNPC.openDialogue();
        }

        if(this.canOpenChest && this.overlappingChest.closed){ //si el cofre que tenemos cerca está cerrado podemos abrirlo
            this.moveAbility(false);
            this.overlappingChest.open();
        }

        if(this.canCollect && this.overlappingCollectible.visible){ //comprobamos si además el collectible está visible para evitar dar objetos antes de tiempo
            this.moveAbility(false);
            this.overlappingCollectible.onCollect();
        }
    }

    selectPersonality(name){ //logica al seleccionar una personalidad
        this.personalityActive=name;
        if(name[3]=='P'){ //si tiene Percepcion podrá ver ciertas partes del mapa
            this.scene.airLayer.setVisible(true);
        }
        else{
            this.scene.airLayer.setVisible(false);
        }

        if(name=='ISFP'){//si es la personalidad de Aventurero podrá ver ciertas partes del mapa
            this.scene.adventureLayer.setVisible(true);
            this.scene.adventureNOCOLLayer.setVisible(true);
        }
        else{
            this.scene.adventureLayer.setVisible(false);
            this.scene.adventureNOCOLLayer.setVisible(false);
        }
    }

    getPersonality(name){//recibe una personalidad que desbloquear
        for(let i = 0; i<16;i++){
            if(this.personalitiesArray[i].newTexture==name){
                this.personalitiesArray[i].addPersonality();    
            }
        }
        this.numPersonalities++;
    }

    startGame(){ //logica para iniciar el juego
        for(let i=0;i<16;i++){ //creamos las 16 personalidades desde el inicio pero bloqueadas
            this.personalitiesArray.push(new Personalities(this.scene, 0, 0, 'Block', this.personalitiesTraits[i]));
            this.personalitiesArray[i].setVisible(false);
            this.scene.add.existing(this.personalitiesArray[i]);
        }
        this.getPersonality('ENFJ');//Le damos la personalidad del Protagonista desde el incio

        //Dialogo inicial donde explica el juego
        this.dialogBox = new Dialog(this.scene, this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY + this.scene.sys.game.config.height - 120);
        this.dialogBox.showDialog('Bienvenido al mundo Ed. Siento decirte que ahora mismo eres un ente sin personalidad pero hay noticias:\
¡Puedes conseguir hasta 16 personalidades! ¿Cómo conseguirlas? Explora el mundo, abre cofres y habla con los aldeanos. Cada personalidad se compone de\
4 componentes: Extraversión(E) vs Introversión(I), Intuición(N) vs Sensación(S), Pensamiento(T) vs Sentimiento(F) y Racionalidad(J) vs Percepción(P).\
Ten esto en cuenta para determinadas ocasiones. Cuando quieras ver qué has conseguido hasta el momento solo pulsa la I, podrás seleccionar la que más\
te guste pero cuidado, habrá momentos que solo algunas personalidades te servirán para seguir avanzando. Mucha suerte y disfruta del camino. (Pulsa E para cerrar)');
        this.firstDialogue=true;
        this.canMove=false;

        //establecemos que hay ciertas capas que no puede ver de momento
        this.scene.airLayer.setVisible(false);
        this.scene.adventureLayer.setVisible(false);
        this.scene.adventureNOCOLLayer.setVisible(false);
    }

    hasCollected(item){ //cuando recoge un collectible
        if(item=='Vino'){this.hasWine=true;}
        else if(item=='Escudo'){this.hasShield=true;}
        else if(item=='Golosinas'){this.hasGummies=true;}
        else if(item=='Monedas'){this.goldCount++;}
    }

    moveAbility(able){ //facilitamos la parada de movimiento del personaje para tambien cambiar la animacion
        if(!able){
            this.speedX=0;
            this.canMove=false;
            this.play('EdIdle');
        }
        else {this.canMove=true;}
    }

    seeAbility(item){ //después de recibir una misión podremos ver el objeto en cuestión para no completar misiones al azar
        this.scene.collectiblesArray.forEach(collect => {
            if (collect.name==item) {
                collect.setVisible(true);
            }
        });
    }

    preUpdate(t,dt)
    {
        this.seconds+=dt/1000;
        this.inputLogic();
        this.body.setVelocity(this.speedX, this.speedY);
        this.checkInteract();
        super.preUpdate(t,dt);
    }
}