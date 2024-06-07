import Ed from '../Entities/Ed.js';

export default class PlayState extends Phaser.Scene {
	constructor() {
		super({ key: 'PlayState' });
	}

    preload()
    {
        this.load.spritesheet('EdIdle', './assets/Ed/Idle.png', {frameWidth: 32, frameHeight: 32});
        this.load.tilemapTiledJSON('map', './assets/Map/minimap.json');
        this.load.image('tilesN', './assets/Map/Nature/Tiles.png');
        this.load.image('tilesM', './assets/Map/Medieval/Tiles.png');
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

        this.Ed = new Ed(this,400,400);

        this.map = this.make.tilemap({ key: 'map' });
        const tileset1 = this.map.addTilesetImage('NatureTiles', 'tilesN');
        const tileset2 = this.map.addTilesetImage('MedievalTiles', 'tilesM');

        this.backgroundLayer = this.map.createLayer('Tile Layer 1', tileset1);
        this.floorLayer = this.map.createLayer('Suelo', tileset2);
        this.floorLayer.setCollisionBetween(0, 9999);

        this.cameras.main.startFollow(this.Ed);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.physics.add.collider(this.Ed,this.floorLayer);
    }

    update(t,dt)
    {

    }
}

