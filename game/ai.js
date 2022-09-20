const worker = self;
import { ROTATIONS, Piece } from './pieces.js';

class AI {
    //constant
    aggregateHeight;
    lines;
    holes;
    bumpiness;
    numberOfColumns;
    numberOfRows;
    aiInterval;
    // runtime
    worker;
    gamePort;
    bestMove;
    currentPiece;
    board;
    interval;

    constructor(worker) {
        this.init = this.init.bind(this);
        this.moveClock = this.moveClock.bind(this);
        this.sendInput = this.sendInput.bind(this);
        this.onAIWorkerListener = this.onAIWorkerListener.bind(this);
        this.onGamePortListener = this.onGamePortListener.bind(this);
        this.getInput = this.getInput.bind(this);
        this.calculateBestMove = this.calculateBestMove.bind(this);
        this.calculateScore = this.calculateScore.bind(this);
        //runtime
        this.worker = worker;
        this.worker.onmessage = this.onAIWorkerListener;
    }

    init() {
        this.interval = setInterval(this.moveClock, this.aiInterval);
    }

    moveClock() {
        this.sendInput(this.getInput());
    }

    sendInput(key) {
        switch(key) {
            case "rotate":
                this.gamePort.postMessage({
                    name: 'control',
                    input: 0
                })
                break;
            case "left":
                this.gamePort.postMessage({
                    name: 'control',
                    input: 1
                })
                break;
            case "right":
                this.gamePort.postMessage({
                    name: 'control',
                    input: 2
                })
                break;
            case "down":
                this.gamePort.postMessage({
                    name: 'control',
                    input: 3
                })
                break;
            default:
                break;
        }
    }

    onAIWorkerListener(e) {
        if (e.data.name === 'config') {
            this.aggregateHeight = e.data.config.aggregateHeight;
            this.lines = e.data.config.lines;
            this.holes = e.data.config.holes;
            this.bumpiness = e.data.config.bumpiness;
            this.aiInterval = e.data.config.aiInterval;
            this.numberOfRows = e.data.config.numberOfRows;
            this.numberOfColumns = e.data.config.numberOfColumns;
            this.gamePort = e.ports[0];
            this.gamePort.onmessage = this.onGamePortListener;
            this.init();
        }
    }

    onGamePortListener(e) {
        if (!!e.data.name) {
            if (e.data.name === 'board_update') {
                this.board = e.data.board;
            }
            if (e.data.name === 'currentPiece') {
                const piece = new Piece();
                piece.setData(e.data.piece);
                this.currentPiece = piece;
                if (e.data.newPiece) this.calculateBestMove();
            }
        }
    }

    getInput() {
        if (this.board === null 
            || this.board === undefined 
            || this.currentPiece === null 
            || this.currentPiece === undefined
            ) return null;
        if (this.bestMove !== undefined) {
            if (this.bestMove.rotation !== this.currentPiece.rotation) {
                return 'rotate';
            }
            const distance = this.bestMove.x - this.currentPiece.x;
            if (distance < 0) {
                return 'left';
            } else if (distance > 0) {
                return 'right';
            } else {
                return 'down';
            }
        } else {
            return null;
        }
    }

    calculateBestMove() {
        const arrBoard = [];
        for (let ii = 0;  ii < this.numberOfRows; ii++) {
            arrBoard.push([]);
            for (let jj = 0; jj < this.numberOfColumns; jj++) {
                arrBoard[ii].push(false);
            }
        }
        for (const index in this.board) {
            const block = this.board[index];
            arrBoard[block.y][block.x] = true;
        }
        const moves = [];
        const scores = [];
        for (let x = 0; x < this.numberOfColumns; x++) {
            for (let rr = 0; rr < ROTATIONS[this.currentPiece.type].length; rr++) {
                const rotation = ROTATIONS[this.currentPiece.type][rr];
                let lowestY = null;
                for (let y = 0; y < this.numberOfRows; y++) {
                    let failed = false;
                    // check if piece can be at y
                    const postions = rotation.map(block => {
                        return { x: block.x + x, y: block.y + y };
                    })
                    for (let block of postions) {
                        // if x postion is impossible
                        if (block.x < 0 || block.x >= this.numberOfColumns) {
                            failed = true;
                            break;
                        }
                        // if x postion is impossible
                        if (block.y >= this.numberOfRows) {
                            failed = true;
                            break;
                        }
                        // if block is in way.
                        if (block.y >= 0 && arrBoard[block.y][block.x]) {
                            failed = true;
                            break;
                        }
                    }
                    if (failed) {
                        break;
                    } else {
                        lowestY = y;
                    }
                }
                if (lowestY !== null) {
                    moves.push({ x: x, y: lowestY, rotation: rr});
                }
            }
        }
        for (let move of moves) {
            const moveboard = JSON.parse(JSON.stringify(arrBoard));
            const piece = this.currentPiece.clone();
            piece.x = move.x;
            piece.y = move.y;
            piece.rotation = move.rotation;
            for (let block of piece.getPostions()) {
                if (block.y >= 0) {
                    moveboard[block.y][block.x] = true;
                }
            }
            scores.push(this.calculateScore(moveboard))
        }
        let heighest = null;
        let move = null;
        let index = null;
        for (let ii = 0; ii < scores.length; ii++) {
            if (heighest === null || scores[ii] > heighest) {
                index = ii;
                heighest = scores[ii];
                move = moves[ii];
            }
        }
        this.bestMove = move;
    }

    calculateScore(board) {
        const heightArray = [];
        let numberOfLines = 0;
        let numberOfHoles = 0;
        for (let ii = 0; ii < this.numberOfRows; ii++) {
            let numberOfBlocks = 0;
            for (let jj = 0; jj < this.numberOfColumns; jj++) {
                // if block
                if (board[ii][jj]) {
                    numberOfBlocks++;
                    if (heightArray[jj] === undefined) {
                        heightArray[jj] = ii;
                    }
                } else {
                    if (heightArray[jj] !== undefined && heightArray[jj] !== null) {
                        numberOfHoles++;
                    }
                }
            }
            if (numberOfBlocks == this.numberOfColumns) {
                numberOfLines++;
            }
            numberOfBlocks = 0;
        }
        let aggregateHeight = 0;
        let bumpiness = 0;
        for (let ii = 0; ii < this.numberOfColumns; ii++) {
            const height = !!heightArray[ii] ? this.numberOfRows - heightArray[ii] : 0
            aggregateHeight += height;
            if (ii !== 0) {
                const previousheight = !!heightArray[ii - 1] ? this.numberOfRows - heightArray[ii - 1] : 0
                bumpiness += Math.abs(previousheight - height)
            }
        }
        //console.log(board)
        //console.log(aggregateHeight, numberOfLines, numberOfHoles, bumpiness)
        return (this.aggregateHeight * aggregateHeight)
            + (this.lines * numberOfLines)
            + (this.holes * numberOfHoles)
            + (this.bumpiness * bumpiness)
    }



}
export default new AI(worker);