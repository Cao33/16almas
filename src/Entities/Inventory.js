//puede que esto sea innecesario
export default class Inventory extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y){
        super(scene,x,y, 'InventoryPNG');
        this.scene.add.existing(this);
        this.active=false;
    }
}