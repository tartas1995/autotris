import Canvas from './canvas.js'

class Display {
    gameWorker;
    canvas;
    scoreElement;
    board;
    timeOfLastFrame;
    fpsInterval;
    nbrOfRows;
    nbrOfColumns;
    pixelsPerBlock;

    constructor (gameWorker, config) {
        this.init = this.init.bind(this);
        this.render = this.render.bind(this);
        this.animate = this.animate.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.addEventListener = this.addEventListener.bind(this);
        this.updateScore = this.updateScore.bind(this);
        this.transformColor = this.transformColor.bind(this);
        this.gameWorker = gameWorker;
        this.fpsInterval = config.fpsInterval;
        this.nbrOfRows = config.numberOfRows;
        this.nbrOfColumns = config.numberOfColumns;
        this.pixelsPerBlock = config.pixelsPerBlock;
        this.timeOfLastFrame = 0;
        this.scoreElement = document.querySelector('#score');
        this.scoreElement.style.color = this.transformColor(config.color);
        this.scoreElement.style.fontSize = config.fontSize;
        this.scoreElement.style.fontFamily = config.fontFamily;
        if (!config.displayScore) {
            this.scoreElement.style.display = 'none';
        }
        this.init();
    }

    transformColor(str) {
        //check if RBG value
        if (str.length === 6) {
            const r = parseInt(str.substring(0,2), 16);
            const g = parseInt(str.substring(2,4), 16);
            const b = parseInt(str.substring(4,6), 16);
            if (r > 0 && r < 256 
                && g > 0 && g < 256
                && b > 0 && b < 256 ) {
                    return `#${str}`;
            }
        }
        return str;
    }

    init() {
        this.gameWorker.onmessage = this.onMessage;
        this.canvas = new Canvas(
            document.querySelector('#game'),
            this.nbrOfRows,
            this.nbrOfColumns,
            this.pixelsPerBlock
        );
        this.addEventListener();
        this.animate();
    }

    render() {
        this.canvas.clearCanvas();
        if (!this.board) return;
        for (let block of this.board) {
            this.canvas.drawBlock(block.color, block.x, block.y);
        }
    }

    addEventListener() {
        /*
        document.addEventListener("keydown", (e) => {
            switch(e.key) {
                case "ArrowUp":
                    this.gameWorker.postMessage({
                        name: 'control',
                        input: 0
                    })
                    break;
                case "ArrowLeft":
                    this.gameWorker.postMessage({
                        name: 'control',
                        input: 1
                    })
                    break;
                case "ArrowRight":
                    this.gameWorker.postMessage({
                        name: 'control',
                        input: 2
                    })
                    break;
                case "ArrowDown":
                    this.gameWorker.postMessage({
                        name: 'control',
                        input: 3
                    })
                    break;
                case "b":
                    this.gameWorker.postMessage({
                        name: 'break',
                    })
                    break;
                default:
                    break;
            }
        })
        */
    }

    updateScore(score) {
        this.scoreElement.innerHTML = score;
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
            case 'display_update':
                this.board = e.data.board;
                this.updateScore(e.data.score);
                break;
        
            default:
                break;
        }
    }
}

export default Display;