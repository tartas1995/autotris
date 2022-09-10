const worker = self;
import Pieces from './pieces.js';

class Game {
    worker;
    timeBetweenMoves;
    board;
    currentPiece;
    intervalId;

    constructor (worker) {
        this.init =  this.init.bind(this);
        this.break =  this.break.bind(this);
        this.clock =  this.clock.bind(this);
        this.getNewPieces =  this.getNewPieces.bind(this);
        this.loadConfig =  this.loadConfig.bind(this);
        this.sendBoardToDisplay =  this.sendBoardToDisplay.bind(this);
        this.onMessage =  this.onMessage.bind(this);
        this.worker = worker;
        this.timeBetweenMoves = null;
        this.currentPiece = null;
        this.board = [];
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
        if (this.canMoveCurrentPieceDown()) {
            this.currentPiece.moveDown();
        } else {
            if (this.currentPiece.getPostions().find(pos=>pos.y < 0)) {
                this.gameOver();
                return;
            }
            this.board.push(...this.currentPiece.getPostions());
            this.currentPiece = null;
        }
        //stuff
        // add if rotate is possible
        //this.currentPiece.rotate();
        //end of stuff
        this.sendBoardToDisplay();
    }

    gameOver() {
        console.log("gameOver");
        this.board = [];
        this.currentPiece = null;
    }

    canMoveCurrentPieceDown() {
        const futurePositions = this.currentPiece.getPostions()
            .map((p)=>{
                let { y, x } = p;
                return { x, y: y + 1 };
            });
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
            default:
                break;
        }
    }
}

export default new Game(worker);