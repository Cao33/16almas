import Inventory from './Inventory.js';

export default class Ed extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y)
    {
        super(scene,x,y);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.a = this.scene.input.keyboard.addKey('A');
        this.d = this.scene.input.keyboard.addKey('D');
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.e = this.scene.input.keyboard.addKey('E');

        this.i = this.scene.input.keyboard.addKey('I');
        this.i.on('down', this.manageInv, this);

        this.speedX = 0;
		this.speedY = 0;
        this.seconds = 0; //segundos para usar en el mrua de la gravedad
        this.floored=false;
        this.activeInventory = false;

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

        this.camera = this.scene.cameras.main;
        this.inventory = new Inventory(this.scene,0,0);
        this.inventory.setVisible(false);

        this.play('EdIdleAnim');
    }

    manageInv(){
        if(this.activeInventory){
            this.inventory.setVisible(false);
            this.activeInventory=false;
        }
        else{
            this.speedX=0;
            this.inventory.setPosition(this.camera.scrollX+this.camera.width/2, this.camera.scrollY+this.camera.height/2);
            this.inventory.setVisible(true);
            this.activeInventory=true;
        }
    }

    inputLogic()
    {
        if(!this.activeInventory){
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
                    this.speedY=1; //si fuera 0 pasaria de ser body blocked a body embeded
                }
            }
            else{ //lógica de caida
                this.speedY+=40*this.seconds;
            }
        }
    }

    preUpdate(t,dt)
    {
        this.seconds+=dt/1000;
        this.inputLogic();
        this.body.setVelocity(this.speedX, this.speedY);
        super.preUpdate(t,dt);
    }
}