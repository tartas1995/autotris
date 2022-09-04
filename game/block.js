class Block {
    x;
    y;
    color;

    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    changeX(x) {
        this.x = x;
    }

    changeY(y) {
        this.y = y;
    }
}

export default Block;