import Ed from '../Entities/Ed.js';
import NPC from '../Entities/NPC.js';

export default class PlayState extends Phaser.Scene {
	constructor() {
		super({ key: 'PlayState' });
	}

    preload()
    {
        this.load.spritesheet('EdIdle', './assets/Ed/Idle.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('EdRight', './assets/Ed/Right.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('EdLeft', './assets/Ed/Left.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('OldManIdle', './assets/Villagers/OldManIdle.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('OldWomanIdle', './assets/Villagers/OldWomanIdle.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('ManIdle', './assets/Villagers/ManIdle.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('WomanIdle', './assets/Villagers/WomanIdle.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('BoyIdle', './assets/Villagers/BoyIdle.png', {frameWidth: 48, frameHeight: 48});
        this.load.spritesheet('GirlIdle', './assets/Villagers/GirlIdle.png', {frameWidth: 48, frameHeight: 48});
        this.npcCount=0;
        let npcArray
        this.load.image('InventoryPNG', './assets/Propios/InventorySprite.png');
        this.load.tilemapTiledJSON('map', './assets/Map/minimap.json');
        this.load.image('NatTiles', './assets/Map/Nature/Tiles.png');
        this.load.image('MedTiles', './assets/Map/Medieval/Tiles.png');
        this.load.image('NatProps', './assets/Map/Nature/Props.png');
        this.load.image('MedProps', './assets/Map/Medieval/Props.png');
    }

    create() 
    {
        const canvasWidth = this.sys.game.config.width;
        const canvasHeight = this.sys.game.config.height;
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

        this.backgroundLayer = this.map.createLayer('Tile Layer 1', tileset1);
        this.floorLayer = this.map.createLayer('Suelo',tileset1);
        this.floorLayer.setCollisionBetween(0, 9999);

        for (const point of this.map.getObjectLayer('Characters').objects) {
            if (point.name == 'Ed') {
                this.Ed = new Ed(this,point.x,point.y);
            }
            else if (point.name == 'NPC') {
                this.npcCount++;
                //this.npcArray.push(new NPC(this,point.x,point.y));
            }
            console.log(this.npcCount);
        }

        this.cameras.main.startFollow(this.Ed);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.physics.add.collider(this.Ed,this.floorLayer);
    }

    update(t,dt)
    {

    }
}

