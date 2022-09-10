import Block from './block.js';

const ROTATIONS = {
    'I': [
        /**
         * 1.    2.    3.    4.
         * 0000  0010  0000  0100
         * 1x11  0x10  0x00  0x00
         * 0000  0010  1111  0100
         * 0000  0010  0000  0100
         */
        [{ x: -1, y:  0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        [{ x:  1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
        [{ x: -1, y:  1 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
        [{ x:  0, y: -1 }, { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
    ],
    'J': [
        /**
         * 1.   2.   3.   4.
         * 100  011  000  010
         * 1x1  0x0  1x1  0x0
         * 000  010  001  110
         */
        [{ x: -1, y: -1 }, { x: -1, y:  0 }, { x: 0, y: 0 }, { x:  1, y: 0 }],
        [{ x:  1, y: -1 }, { x:  0, y: -1 }, { x: 0, y: 0 }, { x:  0, y: 1 }],
        [{ x:  1, y:  1 }, { x:  1, y:  0 }, { x: 0, y: 0 }, { x: -1, y: 0 }],
        [{ x:  0, y: -1 }, { x:  0, y:  0 }, { x: 0, y: 1 }, { x: -1, y: 1 }],
    ],
    'L': [
        /**
         * 1.   2.   3.   4.
         * 001  010  000  110
         * 1x1  0x0  1x1  0x0
         * 000  011  100  010
         */
        [{ x: -1, y:  0 }, { x:  0, y:  0 }, { x: 1, y: 0 }, { x: 1, y: -1 }],
        [{ x:  0, y: -1 }, { x:  0, y:  0 }, { x: 0, y: 1 }, { x: 1, y:  1 }],
        [{ x: -1, y:  1 }, { x: -1, y:  0 }, { x: 0, y: 0 }, { x: 1, y:  0 }],
        [{ x: -1, y: -1 }, { x:  0, y: -1 }, { x: 0, y: 0 }, { x: 0, y:  1 }],
    ],
    'O': [
        /**
         * x1
         * 11
         */
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }],
    ],
    'S': [
        /**
         * 1.   2.   3.   4.
         * 011  010  000  100
         * 1x0  0x1  0x1  1x0
         * 000  001  110  010
         */
        [{ x: -1, y:  0 }, { x:  0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: -1 }],
        [{ x:  0, y: -1 }, { x:  0, y: 0 }, { x: 1, y:  0 }, { x: 1, y:  1 }],
        [{ x: -1, y:  1 }, { x:  0, y: 1 }, { x: 0, y:  0 }, { x: 1, y:  0 }],
        [{ x: -1, y: -1 }, { x: -1, y: 0 }, { x: 0, y:  0 }, { x: 0, y:  1 }],
    ],
    'T': [
        /**
         * 1.   2.   3.   4.
         * 010  010  000  010
         * 1x1  0x1  1x1  1x0
         * 000  010  010  010
         */
        [{ x: -1, y:  0 }, { x: 0, y: 0 }, { x: 0, y: -1 }, { x:  1, y: 0 }],
        [{ x:  0, y: -1 }, { x: 0, y: 0 }, { x: 0, y:  1 }, { x:  1, y: 0 }],
        [{ x: -1, y:  0 }, { x: 0, y: 0 }, { x: 0, y:  1 }, { x:  1, y: 0 }],
        [{ x:  0, y: -1 }, { x: 0, y: 0 }, { x: 0, y:  1 }, { x: -1, y: 0 }],
    ],
    'Z': [
        /**
         * 1.   2.   3.   4.
         * 110  001  000  010
         * 0x1  0x1  1x0  1x0
         * 000  010  011  100
         */
        [{ x: -1, y: -1 }, { x: 0, y: -1 }, { x:  0, y: 0 }, { x:  1, y: 0 }],
        [{ x:  1, y: -1 }, { x: 1, y:  0 }, { x:  0, y: 0 }, { x:  0, y: 1 }],
        [{ x: -1, y:  0 }, { x: 0, y:  0 }, { x:  0, y: 1 }, { x:  1, y: 1 }],
        [{ x:  0, y: -1 }, { x: 0, y:  0 }, { x: -1, y: 0 }, { x: -1, y: 1 }],
    ],
}

class Piece {
    type;
    x;
    y;
    color;
    rotation;

    constructor(type, color) {
        this.rotate = this.rotate.bind(this);
        this.getPostions = this.getPostions.bind(this);
        this.moveDown = this.moveDown.bind(this);
        this.blocks = [];
        this.color = color;
        this.type = type;
        this.x = 5;
        this.rotation = Math.floor( Math.random() * ROTATIONS[this.type].length );
        this.y = (
            Math.max(
                ...ROTATIONS[this.type][this.rotation].map(p=>p.y)
            ) * -1 )
            -1;
    }

    rotate(clockwise = true) {
        let r;
        if (clockwise) {
            r = this.rotation + 1;
            r = r >= ROTATIONS[this.type].length ? 0 : r;
        } else {
            r = this.rotation - 1;
            r = r < 0 ? ROTATIONS[this.type].length - 1 : r;
        }
        this.rotation = r;
    }

    moveDown() {
        this.y = this.y + 1;
    }

    getPostions() {
        return ROTATIONS[this.type][this.rotation].map(block => {
            return { x: block.x + this.x, y: block.y + this.y, color: this.color };
        })
    }
}

const pieceMap = [
    () => { return new Piece('I', 'cyan')},
    () => { return new Piece('J', 'blue')},
    () => { return new Piece('L', 'orange')},
    () => { return new Piece('O', 'yellow')},
    () => { return new Piece('S', 'green')},
    () => { return new Piece('T', 'purple')},
    () => { return new Piece('Z', 'red')},
]

export default pieceMap;