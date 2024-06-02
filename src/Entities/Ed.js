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
        this.speedX = 0;
		this.speedY = 0;

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
            this.speedX=100;
        }
        else if(this.a.isDown){
            this.speedX=-100;
            
        }
        else {
            this.speedX=0;
        }
        
    }

    preUpdate(t,dt)
    {
        super.preUpdate(t,dt);
        this.move();
        this.body.setVelocity(this.speedX, this.speedY);
    }
}