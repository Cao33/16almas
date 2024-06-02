export default class Ed extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y)
    {
        super(scene,x,y, 'Ed');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setCollideWorldBounds();

        this.a = this.scene.input.keyboard.addKey('A');
        this.d = this.scene.input.keyboard.addKey('D');
        this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.speedX = 0;
		this.speedY = 0; //la gravedad de la tierra
        this.seconds = 0; //segundos para usar en el mrua de la gravedad
        this.jump=false;

        this.scene.anims.create({
			key: 'EdIdleAnim',
			frames: scene.anims.generateFrameNumbers('EdIdle', { start: 0, end: 3}),
			frameRate: 10,
			repeat: -1
		});

        this.play('EdIdleAnim');
    }

    move()
    {
        if(this.d.isDown){
            this.speedX=200;
        }
        else if(this.a.isDown){
            this.speedX=-200;
            
        }
        else {
            this.speedX=0;
        }
        
        if(this.speedY>=0){
            this.jump=false;
        }

        if(this.spaceKey.isDown&& !this.jump){
            this.jump=true;
            this.seconds=0;
            this.speedY = -450;
        }
        else{
            this.speedY+=40*this.seconds;
        }
    }

    preUpdate(t,dt)
    {
        super.preUpdate(t,dt);
        this.seconds+=dt/1000;
        this.move();
        this.body.setVelocity(this.speedX, this.speedY);
    }
}