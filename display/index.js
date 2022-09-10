import Canvas from './canvas.js'

class Display {
    gameWorker;
    canvas;
    board;
    timeOfLastFrame;
    fpsInterval;
    nbrOfRows;
    nbrOfColumns;
    pixelsPerBlock;

    constructor (gameWorker, config) {
        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
        this.break = this.break.bind(this);
        this.animate = this.animate.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.gameWorker = gameWorker;
        this.fpsInterval = config.fpsInterval;
        this.nbrOfRows = config.numberOfRows;
        this.nbrOfColumns = config.numberOfColumns;
        this.pixelsPerBlock = config.pixelsPerBlock;
        this.timeOfLastFrame = 0;
        this.init();
    }

    init() {
        this.gameWorker.onmessage = this.onMessage;
        window.break = this.break;
        this.canvas = new Canvas(
            document.querySelector('#game'),
            this.nbrOfRows,
            this.nbrOfColumns,
            this.pixelsPerBlock
        );
        this.animate();
    }

    render() {
        this.canvas.clearCanvas();
        if (!this.board) return;
        for (let block of this.board) {
            this.canvas.drawBlock(block.color, block.x, block.y);
        }
    }

    break() {
        this.gameWorker.postMessage({
            name: 'break'
        })
    }

    animate() {
        window.requestAnimationFrame(this.animate);
        const now = Date.now();
        const elapsed = now - this.timeOfLastFrame;
        if (elapsed > this.fpsInterval) {
            this.timeOfLastFrame = now - (elapsed % this.fpsInterval);
            this.render();
        }
    }

    onMessage(e) {
        if (!e.data.name) console.error('missing name in message'. e.data)
        switch (e.data.name) {
            case 'board_update':
                this.board = e.data.board;
                break;
        
            default:
                break;
        }
    }
}

export default Display;