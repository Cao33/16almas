export default class NPC extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y, npcFile)
    {
        super(scene,x,y);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.name=npcFile
        this.scene.anims.create({
            key: 'Idle',
            frames: scene.anims.generateFrameNumbers(npcFile, { start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        this.play('Idle');
    }

    openDialogue(){
        console.log('dialogo');
    }

    preUpdate(t,dt){
        super.preUpdate(t,dt);
    }
}