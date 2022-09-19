const worker = self;

class AI {
    //constant
    aggregateHeight;
    lines;
    holes;
    bumpiness;
    numberOfColumns;
    numberOfRows;
    // runtime
    worker;
    gameWorker;
    bestPosition;
    bestRotation;
    currentPiece;
    board;

    constructor(worker) {
        //runtime
        this.worker = worker;
        this.worker.onmessage = this.onAIWorkerListener;
    }

    onAIWorkerListener(e) {
        if (!!e.data.gameWorker) {
            this.gameWorker = e.data.gameWorker;
            this.gameWorker.onmessage = this.onGameWorkerListener;
        }
        if (!!e.data.name === 'config') {
            this.aggregateHeight = e.data.aggregateHeight;
            this.lines = e.data.lines;
            this.holes = e.data.holes;
            this.bumpiness = e.data.bumpiness;
            this.aiInterval = e.data.aiInterval;
            this.numberOfRows = e.data.numberOfRows;
            this.numberOfColumns = e.data.numberOfColumns;
        }
    }

    onGameWorkerListener(e) {
        if (!!e.data.name) {
            if (e.data.name === 'board_update') {
                this.board = e.data.board;
            }
        }
    }

    getInput() {
        if (this.bestPosition !== null && this.bestRotation !== null) {
            if (this.bestRotation !== this.currentPiece.rotation) {
                return 'rotate';
            }
            const distance = this.bestPosition - this.currentPiece.x;
            if (distance > 0) {
                return 'left';
            } else if (distance < 0) {
                return 'right';
            } else {
                return 'down';
            }
        } else {
            this.calculateBestMove();
            return this.getInput();
        }
    }

    calculateBestMove() {
        const board = [];
        for (let ii = 0;  ii < this.numberOfRows; ii++) {
            board[ii][this.numberOfColumns] = undefined;
        }
        for (const block in this.board) {
            board[block.y][block.x] = true;
        }
        const moves = [];
        const scores = [];
        // generate all moves
        for (let move of moves) {
            const moveboard = board;
            // insert move into board
            scores.push(this.calculateScore(moveboard))
        }
        let heighest = 0;
        let move = null;
        for (let ii = 0; ii < scores.length; ii++) {
            if (scores[ii] > heighest) {
                heighest = scores[ii];
                move = moves[ii];
            }
        }
        this.bestPosition = move;
    }

    calculateScore() {
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
                    if (heightArray[jj] !== null) {
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
            aggregateHeight += heightArray[ii];
            if (ii !== 0) {
                bumpiness += heightArray[ii - 1] - heightArray[ii]
            }
        }
        return (this.aggregateHeight * aggregateHeight)
            + (this.lines * numberOfLines)
            + (this.holes * numberOfHoles)
            + (this.bumpiness * bumpiness)
    }



}

export default new Game(worker);