const worker = self;
import Pieces from './pieces.js';

class Game {
    worker;
    timeBetweenMoves;
    board;
    currentPiece;
    intervalId;
    score;

    constructor (worker) {
        this.init =  this.init.bind(this);
        this.break =  this.break.bind(this);
        this.clock =  this.clock.bind(this);
        this.getNewPieces =  this.getNewPieces.bind(this);
        this.loadConfig =  this.loadConfig.bind(this);
        this.sendBoardToDisplay =  this.sendBoardToDisplay.bind(this);
        this.onMessage =  this.onMessage.bind(this);
        this.controls =  this.controls.bind(this);
        this.checkAndRemoveLines =  this.checkAndRemoveLines.bind(this);
        this.worker = worker;
        this.timeBetweenMoves = null;
        this.currentPiece = null;
        this.board = [];
        this.score = 0;
        this.init();    
    }

    init() {
        this.worker.onmessage = this.onMessage;
    }

    break() {
        clearInterval(this.intervalId);
    }

    clock() {
        if (this.currentPiece === null) {
            this.currentPiece = this.getNewPieces();
        }
        if (this.canMoveCurrentPiece('down')) {
            this.currentPiece.moveDown();
        } else {
            if (this.currentPiece.getPostions().find(pos=>pos.y < 0)) {
                this.gameOver();
                return;
            }
            this.board.push(...this.currentPiece.getPostions());
            this.currentPiece = null;
            this.checkAndRemoveLines();
        }
        this.sendBoardToDisplay();
    }

    checkAndRemoveLines() {
        const lines = {};
        for (let block of this.board) {
            if (!lines[block.y]) {
                lines[block.y] = 0;
            }
            lines[block.y]++;
        }
        let numberOfRemovedLines = 0;
        for (let line of Object.keys(lines)) {
            const numberOfBlocks = lines[line];
            if (numberOfBlocks === this.numberOfColumns) {
                numberOfRemovedLines++;
            }
        }
        if (numberOfRemovedLines > 0) {
            this.score += numberOfRemovedLines * numberOfRemovedLines;
            const newBoard = [];
            for (let block of this.board) {
                if (lines[block.y] < this.numberOfColumns) {
                    let rowToMoveDown = 0;
                    for (let ii = block.y; ii < this.numberOfRows; ii++) {
                        if (lines[ii] === this.numberOfColumns) {
                            rowToMoveDown++;
                        }
                    }
                    newBoard.push({...block, y: block.y + rowToMoveDown})
                }
            }
            this.board = newBoard;
        }
    }

    controls() {
        return [
            () => {
                if (this.currentPiece !== null 
                    && this.canMoveCurrentPiece('rotate')) {
                    this.currentPiece.rotate();
                    this.sendBoardToDisplay();
                }
            },
            () => {
                if (this.currentPiece !== null 
                    && this.canMoveCurrentPiece('left')) {
                    this.currentPiece.moveLeft();
                    this.sendBoardToDisplay();
                }
            },
            () => {
                if (this.currentPiece !== null 
                    && this.canMoveCurrentPiece('right')) {
                    this.currentPiece.moveRight();
                    this.sendBoardToDisplay();
                }
            },
            () => {
                if (this.currentPiece !== null 
                    && this.canMoveCurrentPiece('down')) {
                    this.currentPiece.moveDown();
                    this.sendBoardToDisplay();
                }
            },
        ]
    }

    gameOver() {
        console.log("gameOver");
        this.board = [];
        this.currentPiece = null;
    }

    canMoveCurrentPiece(direction = 'down') {
        let futurePositions = null;
        switch (direction) {
            case 'rotate':
                futurePositions = this.currentPiece.clone()
                    .rotate()
                    .getPostions();
                break;
            case 'left':
                futurePositions = this.currentPiece.getPostions()
                    .map((p)=>{
                        let { y, x } = p;
                        return { x: x - 1, y };
                    });
                break;
            case 'right':
                futurePositions = this.currentPiece.getPostions()
                    .map((p)=>{
                        let { y, x } = p;
                        return { x: x + 1, y };
                    });
                break;
            case 'down':
            default:
                futurePositions = this.currentPiece.getPostions()
                    .map((p)=>{
                        let { y, x } = p;
                        return { x, y: y + 1 };
                    });
                break;
        }
        const wouldOverlapBoard = this.board.findIndex(
            (position) => {
                let found = false;
                for (let fpos of futurePositions) {
                    if (fpos.x === position.x && fpos.y === position.y) {
                        found = true;
                        break;
                    }
                }
                return found;
            }
        ) !== -1;
        if (wouldOverlapBoard) {
            return false;
        } else {
            return futurePositions.findIndex((pos) => {
                return pos.y >= this.numberOfRows 
                    || pos.x < 0 
                    || pos.x >= this.numberOfColumns
            }) === -1
        }
    }

    getNewPieces() {
        const id = Math.floor( Math.random() * Pieces.length );
        return Pieces[id]();
    }

    loadConfig(config) {
        if (!config.numberOfRows || !config.numberOfColumns) {
            throw 'BROKEN> missing number of rows and/or columns from config'
        }
        this.numberOfRows =  config.numberOfRows;
        this.numberOfColumns =  config.numberOfColumns;
        if (!!config.timeBetweenMoves) {
            this.timeBetweenMoves =  config.timeBetweenMoves;
        }
        this.intervalId = setInterval(this.clock, this.timeBetweenMoves)
    }

    sendBoardToDisplay() {
        let displayBoard = null;
        if (this.currentPiece === null) {
            displayBoard = [...this.board];    
        } else {
            displayBoard = [...this.board, ...this.currentPiece.getPostions()];
        }
        worker.postMessage({
            name: 'board_update',
            board: displayBoard
        });
    }

    onMessage(e) {
        if (!e.data.name) console.error('missing name in message'. e.data)
        switch (e.data.name) {
            case 'config':
                this.loadConfig(e.data.config)
                break;
            case 'break':
                this.break();
            case 'control':
                this.controls()[e.data.input]()
            default:
                break;
        }
    }
}

export default new Game(worker);