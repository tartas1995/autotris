import Canvas from './canvas.js'

class Display {
    gameWorker;
    canvas;
    board;
    timeOfLastFrame;
    fpsInterval;

    constructor (gameWorker, config) {
        this.animate = this.animate.bind(this);
        this.gameWorker = gameWorker;
        this.fpsInterval = config.fpsInterval;
        this.init();
    }

    init() {
        this.gameWorker.onmessage = this.onMessage;
        this.canvas = new Canvas(document.querySelector('#game'));
        this.animate();
    }

    render() {
        this.canvas.clearCanvas();
        for (let block of board) {
            this.canvas.drawBlock(block.color, block.x, block.y);
        }
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