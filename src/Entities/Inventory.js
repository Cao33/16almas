//esta clase se llama desde ed pero se debe crear desde playstate, no incurrir en fallos. Sigue siendo poo
export default class Inventory extends Phaser.GameObjects.Sprite
{
    constructor(scene,x,y){
        super(scene,x,y, 'InventoryPNG');
        this.scene.add.existing(this);
        this.cartas= [];
    }

    addCarta(carta) {
        this.cartas.push(carta);
        this.scene.add.existing(carta); // Añadir la carta a la escena
    }
}