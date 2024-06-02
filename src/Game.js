import MainMenu from "./States/MainMenu.js";
import PlayState from "./States/PlayState.js";
import PauseState from "./States/PauseState.js";

var config = {
    type: Phaser.CANVAS,
    canvas: document.getElementById("juego"),
    width: 1200,
    height: 600,
    pixelArt: true,
    scale: {
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,         
        min: {
        width: 256,
        height: 192
        },
        max: {
            width: 800,
            height: 600 
        },
        zoom: 1
    },
    scene: [MainMenu, PlayState, PauseState],          
    physics: { 
        default: 'arcade', 
        arcade: { 
            gravity: { y: 0 }, 
            debug: false
        } 
    }             
};

var game = new Phaser.Game(config);
