import Block from './block.js';

class Piece {
    blocks;
    type;
    x;
    y;
    color;

    constructor(type, color) {
        this.blocks = [];
        this.color = color;
        this.x = 10;
        this.y = 0;
        for (let i = 0; i < 3; i++) {
            this.blocks.push(new Block(0,0, color));
        }
    }
}