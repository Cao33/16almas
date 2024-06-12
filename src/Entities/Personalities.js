export default class Personalities extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, nameTex) {
        super(scene, x, y, texture);
        this.newTexture = nameTex;
        this.setScale(0.75,0.5); //el png era demasiado grande y es más facil reajustarlo aqui
        this.setInteractive();//le añadimos setInteractive para que se pueda hacer click
        this.on('pointerdown', this.onSelect, this);
        this.active=false;//active es el bool que nos dice si se ha desbloqueado la carta o no
        this.setDepth(3);//depth para que se pueda ver por encima de todo
    }

    onSelect() {
        if(this.active){ //si esta personalidad está desbloqueada
            for(let i = 0; i<16;i++){
                this.scene.Ed.personalitiesArray[i].setAlpha(1);//Ponemos todas las cartas sea la que sea con un alpha opaco
            }
            this.scene.Ed.selectPersonality(this.newTexture);//le decimos a Ed que hemos seleccionado esta carta
            this.setAlpha(0.5);//por último ponemos esta carta a mitad de transparencia para indicar la seleccion
        }
    }

    addPersonality(){ 
        this.active=true; //desbloqueamos esta carta para poder seleccionarla
        this.setTexture(this.newTexture); //cambiamos su sprite de BLOQUEADO a la personalidad en cuestion
    }
}
