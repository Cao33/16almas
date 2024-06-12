import Ed from '../Entities/Ed.js';
import NPC from '../Entities/NPC.js';
import Chest from '../Entities/Chest.js';
import Collectibles from '../Entities/Collectibles.js';

export default class PlayState extends Phaser.Scene {
	constructor() {
		super({ key: 'PlayState' });
	}

    preload()
    {
        //Player
        this.load.spritesheet('EdIdle', './assets/Ed/Idle.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('EdRight', './assets/Ed/Right.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('EdLeft', './assets/Ed/Left.png', {frameWidth: 32, frameHeight: 32});
        //Mapa
        this.load.tilemapTiledJSON('map', './assets/Map/minimap.json');
        this.load.image('NatTiles', './assets/Map/Nature/Tiles.png');
        this.load.image('MedTiles', './assets/Map/Medieval/Tiles.png');
        this.load.image('NatProps', './assets/Map/Nature/Props.png');
        this.load.image('MedProps', './assets/Map/Medieval/Props.png');
        this.load.image('Sky', './assets/Map/Village/Background/Background_01.png');
        this.load.image('SwampTiles', './assets/Map/Swamp/1 Tiles/Tileset.png');
        //NPCs
        this.npcCount=0;
        this.npcArray = [];
        this.npcTextures=['OldManIdle','OldWomanIdle','ManIdle','WomanIdle','BoyIdle','GirlIdle'];
        this.load.spritesheet('OldManIdle', './assets/Villagers/OldManIdle.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('OldWomanIdle', './assets/Villagers/OldWomanIdle.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('ManIdle', './assets/Villagers/ManIdle.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('WomanIdle', './assets/Villagers/WomanIdle.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('BoyIdle', './assets/Villagers/BoyIdle.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('GirlIdle', './assets/Villagers/GirlIdle.png', {frameWidth: 48, frameHeight: 48});
        //Inventory and personalities
        this.load.image('InventoryPNG', './assets/Propios/InventorySprite.png');
        this.load.image('ENFJ', './assets/Personalidades/Reverso/ENFJ.png');
        this.load.image('ENFP', './assets/Personalidades/Reverso/ENFP.png');
        this.load.image('ENTJ', './assets/Personalidades/Reverso/ENTJ.png');
        this.load.image('ENTP', './assets/Personalidades/Reverso/ENTP.png');
        this.load.image('ESFJ', './assets/Personalidades/Reverso/ESFJ.png');
        this.load.image('ESFP', './assets/Personalidades/Reverso/ESFP.png');
        this.load.image('ESTJ', './assets/Personalidades/Reverso/ESTJ.png');
        this.load.image('ESTP', './assets/Personalidades/Reverso/ESTP.png');
        this.load.image('INFJ', './assets/Personalidades/Reverso/INFJ.png');
        this.load.image('INFP', './assets/Personalidades/Reverso/INFP.png');
        this.load.image('INTJ', './assets/Personalidades/Reverso/INTJ.png');
        this.load.image('INTP', './assets/Personalidades/Reverso/INTP.png');
        this.load.image('ISFJ', './assets/Personalidades/Reverso/ISFJ.png');
        this.load.image('ISFP', './assets/Personalidades/Reverso/ISFP.png');
        this.load.image('ISTJ', './assets/Personalidades/Reverso/ISTJ.png');
        this.load.image('ISTP', './assets/Personalidades/Reverso/ISTP.png');
        this.load.image('Block', './assets/Personalidades/Reverso/BLOCKED.png');
        //Collectibles and chests
        this.load.spritesheet('Chest', './assets/Map/Swamp/4 Animated objects/Chest.png', {frameWidth: 32, frameHeight: 32});
        this.chestArray=[];
        this.load.image('Vino', './assets/Propios/Vino.png');
        this.load.image('Escudo', './assets/Propios/Escudo.png');
        this.load.image('Golosinas', './assets/Propios/Golosinas.png');
        this.load.image('Monedas', './assets/Propios/Monedas.png');
        this.collectiblesArray=[];
    }

    create() 
    {        
        //creamos el mapa y los tilesets
        this.map = this.make.tilemap({ key: 'map' });
        const tileset1 = this.map.addTilesetImage('NatureTiles', 'NatTiles');
        const tilesetProps = this.map.addTilesetImage('NatureProps', 'NatProps');
        const tilesetMedProps = this.map.addTilesetImage('MedievalProps', 'MedProps');
        const tileset2 = this.map.addTilesetImage('MedievalTiles', 'MedTiles');
        
        //Añadimos el fondo por imagen
        const texture = this.textures.get('Sky');
        const height = texture.getSourceImage().height;
        this.background = this.add.tileSprite(0, -300, this.scale.width, height, 'Sky');
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0);

        //Creamos las layers del mapa
        this.backgroundLayer = this.map.createLayer('Tile Layer 1', [tileset1, tilesetProps, tilesetMedProps]); //Decoraciones sin colisiones
        this.floorLayer = this.map.createLayer('Suelo',[tileset1, tileset2]); //La capa que tiene los tiles a nivel de la tierra
        this.airLayer = this.map.createLayer('Aire',tileset2); //la capa que contiene los tiles rojos en el aire
        this.adventureLayer = this.map.createLayer('Adventure',tilesetProps); //la capa de nubes que tiene colisiones (el resto de los tiles en la NOCOL)
        this.adventureNOCOLLayer = this.map.createLayer('AdventureNOCOL',tilesetProps); //Cumplimenta a adventureLayer pero no tiene colisiones
        
        //le damos colision a los tiles de ciertas capas con id entre 0 y 9999 (no hay tantos ids pero nos aseguramos que todos tengan colision)
        this.floorLayer.setCollisionBetween(0, 9999);
        this.airLayer.setCollisionBetween(0, 9999);
        this.adventureLayer.setCollisionBetween(0, 9999);
        
        //Recorremos la capa de Objetos y añadimos los objetos correspondientes
        for (const point of this.map.getObjectLayer('Characters').objects) {
            if (point.name == 'Ed') {
                this.Ed = new Ed(this,point.x,point.y);
            }
            else if (point.name == 'NPC') { //Este es el NPC básico
                this.npcArray.push(new NPC(this,point.x,point.y, this.npcTextures[this.npcCount%6], 'base', point.properties.find(prop => prop.name == 'dialogue').value));
                this.npcCount++;
            }
            else if (point.name == 'Final') { //Este es NPC pero tiene la forma de Ed y es el que determina el final del juego
                this.npcArray.push(new NPC(this,point.x,point.y, 'EdIdle', 'final',0));
            }
            else if(point.name=='Giver'){ //Estos NPCs te regalan una personalidad
                this.npcTemp=new NPC(this,point.x,point.y, this.npcTextures[this.npcCount%6], 'giver',point.properties.find(prop => prop.name == 'dialogue').value);
                this.npcTemp.whatPersonality(point.properties.find(prop => prop.name == 'personality').value); //la personalidad que entrega
                this.npcArray.push(this.npcTemp);
                this.npcCount++;
            }
            else if(point.name=='Checker'){ //Estos NPCs te darán pistas solo si tienes ciertas personalidades seleccionadas
                this.npcTemp=new NPC(this,point.x,point.y, this.npcTextures[this.npcCount%6], 'checker',point.properties.find(prop => prop.name == 'dialogue').value);
                this.npcTemp.whatPersonality(point.properties.find(prop => prop.name == 'trait').value); //el componente de la personalidad que requiere
                this.npcArray.push(this.npcTemp);
                this.npcCount++;
            }
            else if(point.name=='Mission'){ //Estos NPCs te dan una misión a cambio de una personalidad.
                this.npcTemp=new NPC(this,point.x,point.y, this.npcTextures[this.npcCount%6], 'mission',point.properties.find(prop => prop.name == 'dialogue').value);
                this.npcTemp.whatPersonality(point.properties.find(prop => prop.name == 'personality').value); //La personalidad que entrega
                this.npcArray.push(this.npcTemp);
                this.npcCount++;
            }
            else if(point.name=='Chest'){ //Cofres que tienen personalidades
                this.chestArray.push(new Chest(this,point.x,point.y,point.properties.find(prop => prop.name == 'name').value,point.properties.find(prop => prop.name == 'trait').value));
            }
            else if(point.name=='Collectible'){ //Los objetos que forman parte de las misiones
                this.collectiblesArray.push(new Collectibles(this,point.x,point.y,point.properties.find(prop => prop.name == 'name').value));
            }
        }
        //Añadimos una camara
        this.cameras.main.startFollow(this.Ed);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        //Ya creado Ed, añadimos las colisiones
        this.physics.add.collider(this.Ed,this.floorLayer);
        this.physics.add.collider(this.Ed,this.airLayer);
        this.physics.add.collider(this.Ed,this.adventureLayer);
        //Mejoramos la detección de las colisiones para que Ed no atraviese los tiles
        this.physics.world.TILE_BIAS = 32;
        //Añadimos la tecla ESC para ir al menu de pausa
        this.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.esc.on('down',this.goPause,this) ;
        //Lo último tiene que ser el startGame de Ed para que se inicie el primer dialogo y las personalidades
        this.Ed.startGame();
    }

    //ir a menu de pausa
    goPause(){ 
        this.scene.sleep();
        this.scene.run('PauseState');
    }

    //al terminar el juego
    endGame(){
        this.scene.sleep();
        this.scene.run('MainMenu');
    }

    update(t,dt)
    {
        //Hacemos update del background para dar efecto de parallax
        this.background.tilePositionX = this.cameras.main.scrollX * 0.5;
        this.background.tilePositionY = this.cameras.main.scrollY * 0.5;
    }
}

