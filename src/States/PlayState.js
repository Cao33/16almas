import Ed from '../Entities/Ed.js';

export default class PlayState extends Phaser.Scene {
	constructor() {
		super({ key: 'PlayState' });
	}

    preload()
    {
        this.load.spritesheet('EdIdle', './assets/Ed/Idle.png', {frameWidth: 32, frameHeight: 32});
        this.load.tilemapTiledJSON('map', './assets/Map/minimap.json');
        this.load.image('tiles', './assets/Map/Nature/Tiles.png');
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
        this.tileset = this.map.addTilesetImage('NatureTiles', 'tiles');

        this.backgroundLayer = this.map.createLayer('Tile Layer 1', this.tileset, 0, 0);

        this.collideObjects = this.map.getObjectLayer('CollideSuelo').objects;
        this.colliders = this.physics.add.staticGroup();

        this.collideObjects.forEach(obj => {
            const collider = this.colliders.create(obj.x, obj.y).setOrigin(0, 0);
            collider.displayWidth = obj.width;
            collider.displayHeight = obj.height;
            collider.body.setSize(obj.width, obj.height);
            collider.setVisible(false);
        });

        this.physics.add.collider(this.Ed, this.colliders);
    }

    update(t,dt)
    {

    }
}

