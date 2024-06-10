import Ed from '../Entities/Ed.js';
import NPC from '../Entities/NPC.js';
import Inventory from '../Entities/Inventory.js';
import Personalities from '../Entities/Personalities.js';

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
        this.load.image('Sky', './assets/Propios/BackSkyParallax.png');
        this.load.image('Sky', './assets/Propios/BackSkyParallax.png');
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
        //Reverso
        this.load.image('ENFJr', './assets/Personalidades/Reverso/ENFJ.png');
        this.load.image('ENFPr', './assets/Personalidades/Reverso/ENFP.png');
        this.load.image('ENTJr', './assets/Personalidades/Reverso/ENTJ.png');
        this.load.image('ENTPr', './assets/Personalidades/Reverso/ENTP.png');
        this.load.image('ESFJr', './assets/Personalidades/Reverso/ESFJ.png');
        this.load.image('ESFPr', './assets/Personalidades/Reverso/ESFP.png');
        this.load.image('ESTJr', './assets/Personalidades/Reverso/ESTJ.png');
        this.load.image('ESTPr', './assets/Personalidades/Reverso/ESTP.png');
        this.load.image('INFJr', './assets/Personalidades/Reverso/INFJ.png');
        this.load.image('INFPr', './assets/Personalidades/Reverso/INFP.png');
        this.load.image('INTJr', './assets/Personalidades/Reverso/INTJ.png');
        this.load.image('INTPr', './assets/Personalidades/Reverso/INTP.png');
        this.load.image('ISFJr', './assets/Personalidades/Reverso/ISFJ.png');
        this.load.image('ISFPr', './assets/Personalidades/Reverso/ISFP.png');
        this.load.image('ISTJr', './assets/Personalidades/Reverso/ISTJ.png');
        this.load.image('ISTPr', './assets/Personalidades/Reverso/ISTP.png');
        //Anverso
        /*this.load.image('ENFJa', './assets/Personalidades/Anverso/ENFJ.png');
        this.load.image('ENFPa', './assets/Personalidades/Anverso/ENFP.png');
        this.load.image('ENTJa', './assets/Personalidades/Anverso/ENTJ.png');
        this.load.image('ENTPa', './assets/Personalidades/Anverso/ENTP.png');
        this.load.image('ESFJa', './assets/Personalidades/Anverso/ESFJ.png');
        this.load.image('ESFPa', './assets/Personalidades/Anverso/ESFP.png');
        this.load.image('ESTJa', './assets/Personalidades/Anverso/ESTJ.png');
        this.load.image('ESTPa', './assets/Personalidades/Anverso/ESTP.png');
        this.load.image('INFJa', './assets/Personalidades/Anverso/INFJ.png');
        this.load.image('INFPa', './assets/Personalidades/Anverso/INFP.png');
        this.load.image('INTJa', './assets/Personalidades/Anverso/INTJ.png');
        this.load.image('INTPa', './assets/Personalidades/Anverso/INTP.png');
        this.load.image('ISFJa', './assets/Personalidades/Anverso/ISFJ.png');
        this.load.image('ISFPa', './assets/Personalidades/Anverso/ISFP.png');
        this.load.image('ISTJa', './assets/Personalidades/Anverso/ISTJ.png');
        this.load.image('ISTPa', './assets/Personalidades/Anverso/ISTP.png');*/
    }

    create() 
    {
        this.debugText = this.add.text(10, 10, 'PlayState', {
            font: '16px Arial',
            fill: '#ffffff'
        });
        
        this.startButton = this.add.text(100, 100, 'Go Pause', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setInteractive();

        this.startButton.on('pointerdown', () => {
            this.scene.start('PauseState');
        });

        this.map = this.make.tilemap({ key: 'map' });
        const tileset1 = this.map.addTilesetImage('NatureTiles', 'NatTiles');
        const tileset2 = this.map.addTilesetImage('MedievalTiles', 'MedTiles');

        const w = this.scale.width;
		const h = this.scale.height;
        const numbs = this.map.widthInPixels/w +1;
        for(let i= 0; i<numbs;i++){
            this.add.image(w*i,h,'Sky').setScrollFactor(0.75);
        }

        this.backgroundLayer = this.map.createLayer('Tile Layer 1', tileset1);
        this.floorLayer = this.map.createLayer('Suelo',tileset1);
        this.floorLayer.setCollisionBetween(0, 9999);

        for (const point of this.map.getObjectLayer('Characters').objects) {
            if (point.name == 'Ed') {
                this.Ed = new Ed(this,point.x,point.y);
            }
            else if (point.name == 'NPC') {
                this.npcArray.push(new NPC(this,point.x,point.y, this.npcTextures[this.npcCount%6])); //cambiar el npc file
                this.npcCount++;
            }
            else if (point.name == 'Final') {
                new NPC(this,point.x,point.y, 'EdIdle'); //cambiar el npc file
            }
        }

        this.cameras.main.startFollow(this.Ed);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.physics.add.collider(this.Ed,this.floorLayer);
    }

    showInventory(){
        //cuando se pulse la i se mostrará el inventario y las cartas
    }

    update(t,dt)
    {

    }
}

