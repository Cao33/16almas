import Personalities from './Personalities.js';
import Dialog from '../Components/Dialog.js';

export default class Ed extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y)
    {
        super(scene,x,y);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setDepth(1);

        this.a = this.scene.input.keyboard.addKey('A');
        this.d = this.scene.input.keyboard.addKey('D');
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.e = this.scene.input.keyboard.addKey('E');
        this.e.on('down', this.interact, this);

        
        this.maxFall=1000;
        this.speedX = 0;
		this.speedY = 0;
        this.seconds = 0; //segundos para usar en el mrua de la gravedad
        
        this.activeInventory = false;

        this.overlappingNPC = null;
        this.canTalk=false;
        this.talking=false;

        this.overlappingCollectible=null;

        this.updates=0;

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

        this.camera = this.scene.cameras.main;
        this.inventory = this.scene.add.image(0,0,'InventoryPNG');
        this.inventory.setDepth(1);
        this.inventory.setVisible(false);
        this.personalitiesArray=[];
        this.personalitiesTraits=['ENFJ','ENFP','ENTJ','ENTP','ESFJ','ESFP','ESTJ','ESTP','INFJ','INFP','INTJ','INTP','ISFJ','ISFP','ISTJ','ISTP'];

        this.i = this.scene.input.keyboard.addKey('I');
        this.i.on('down', this.manageInv, this);
        this.personalityActive=null;
        this.numPersonalities=0;
        this.canOpenChest=false;
        this.overlappingChest=null;
        this.firstDialogue=false;
        this.dialogBox=null;
        this.canCollect=false;
        this.picking=false;

        this.hasWine=false;
        this.hasShield=false;
        this.hasGummies=false;

        this.canMove=true;

        this.goldCount=0;
    }

    manageInv(){
        if(this.activeInventory){
            this.inventory.setVisible(false);
            this.activeInventory=false;
            this.canMove=true;
            for(let i=0;i<16;i++){
                this.personalitiesArray[i].setVisible(false);
            }
        }
        else{
            this.moveAbility(false);
            this.inventory.setPosition(this.camera.scrollX+this.camera.width/2, this.camera.scrollY+this.camera.height/2);
            this.inventory.setVisible(true);
            for(let i=0;i<16;i++){
                this.personalitiesArray[i].setPosition((this.inventory.x-this.inventory.width/2) + 100 +200*(i%4), (this.inventory.y-this.inventory.height/2) + 125 + 100*((i/4)|0));
                        this.personalitiesArray[i].setVisible(true);
            }
            this.activeInventory=true;
        }
    }

    inputLogic()
    {
        if(this.canMove && !this.talking){
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
                    this.speedY=200; //si fuera 0 pasaria de ser body blocked a body embeded
                }
            }
            else{ //lógica de caida
                if(this.speedY<this.maxFall){
                    this.speedY+=40*this.seconds;
                }
            }
        }
    }

    checkInteract() {
        this.overlappingNPC = null; // Reiniciar el NPC con el que se está superponiendo
        this.overlappingChest= null;
        this.overlappingCollectible=null;
        this.scene.npcArray.forEach(npc => {
            if (this.scene.physics.overlap(this, npc)) {
                this.overlappingNPC = npc; // Almacenar el NPC con el que se está superponiendo
                this.canTalk=true;
            }
        });

        if(this.overlappingNPC==null){
            this.canTalk=false;
        }

        this.scene.chestArray.forEach(chest => {
            if (this.scene.physics.overlap(this, chest)) {
                this.overlappingChest = chest; // Almacenar el NPC con el que se está superponiendo
                this.canOpenChest=true;
            }
        });

        if(this.overlappingChest==null){
            this.canOpenChest=false;
        }

        this.scene.collectiblesArray.forEach(collect => {
            if (this.scene.physics.overlap(this, collect)) {
                this.overlappingCollectible = collect; // Almacenar el NPC con el que se está superponiendo
                this.canCollect=true;
            }
        });

        if(this.overlappingCollectible==null){
            this.canCollect=false;
        }
    }

    interact(){ //puedo quitarme la mayoría de delayCalls y bool si hago que se cierren con el tiempo
        if(this.firstDialogue){
            this.dialogBox.hideDialog();
            this.dialogBox=null;
            this.firstDialogue=false;
            this.moveAbility(true);
        }

        if(this.canTalk&& this.canMove){
            this.moveAbility(false);
            this.overlappingNPC.openDialogue();
        }

        if(this.canOpenChest&&this.overlappingChest.closed){
            this.moveAbility(false);
            this.overlappingChest.open();
        }

        if(this.canCollect)
            {
                this.moveAbility(false);
                this.overlappingCollectible.onCollect();
            }
    }

    createPersonalities(){
        for(let i=0;i<16;i++){
            this.personalitiesArray.push(new Personalities(this.scene, 0, 0, 'Block', this.personalitiesTraits[i]));
            this.personalitiesArray[i].setVisible(false);
            this.scene.add.existing(this.personalitiesArray[i]);
        }
    }

    selectPersonality(name){
        this.personalityActive=name;
        if(name[3]=='P'){
            this.scene.airLayer.setVisible(true);
        }
        else{
            this.scene.airLayer.setVisible(false);
        }

        if(name=='ISFP'){
            this.scene.adventureLayer.setVisible(true);
            this.scene.adventureNOCOLLayer.setVisible(true);
        }
        else{
            this.scene.adventureLayer.setVisible(false);
            this.scene.adventureNOCOLLayer.setVisible(false);
        }
    }

    getPersonality(name){
        for(let i = 0; i<16;i++){
            if(this.personalitiesArray[i].newTexture==name){
                this.personalitiesArray[i].addPersonality();    
            }
        }
        this.numPersonalities++;
    }

    startGame(){
        this.getPersonality('ENFJ');
        this.dialogBox = new Dialog(this.scene, this.scene.cameras.main.scrollX, this.scene.cameras.main.scrollY + this.scene.sys.game.config.height - 120);
        this.dialogBox.showDialog('Bienvenido al mundo Ed. Siento decirte que ahora mismo eres un ente sin personalidad pero hay noticias:\
¡Puedes conseguir hasta 16 personalidades! ¿Cómo conseguirlas? Explora el mundo, abre cofres y habla con los aldeanos. Cada personalidad se compone de\
4 componentes: Extraversión(E) vs Introversión(I), Intuición(N) vs Sensación(S), Pensamiento(T) vs Sentimiento(F) y Racionalidad(J) vs Percepción(P).\
Ten esto en cuenta para determinadas ocasiones. Cuando quieras ver qué has conseguido hasta el momento solo pulsa la I, podrás seleccionar la que más\
te guste pero cuidado, habrá momentos que solo algunas personalidades te servirán para seguir avanzando. Mucha suerte y disfruta del camino. (Pulsa E para cerrar)');
        this.firstDialogue=true;
        this.canMove=false;
        this.scene.airLayer.setVisible(false);
        this.scene.adventureLayer.setVisible(false);
        this.scene.adventureNOCOLLayer.setVisible(false);
    }

    hasCollected(item){
        if(item=='Vino'){this.hasWine=true;}
        else if(item=='Escudo'){this.hasShield=true;}
        else if(item=='Golosinas'){this.hasGummies=true;}
        else if(item=='Monedas'){this.goldCount++;console.log(this.goldCount);}
    }

    moveAbility(able){
        if(!able){
            this.speedX=0;
            this.canMove=false;
            this.play('EdIdle');
        }
        else {this.canMove=true;}
    }

    seeAbility(item){
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