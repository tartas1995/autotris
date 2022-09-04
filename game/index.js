const worker = self;

class Game {
    worker;
    timeBetweenMoves;
    board;

    constructor (worker) {
        this.worker = worker;
        this.timeBetweenMoves = null;
        this.onMessage =  this.onMessage.bind(this);
        this.loadConfig =  this.loadConfig.bind(this);
        this.init();    
    }

    init() {
        this.worker.onmessage = this.onMessage;
    }

    loadConfig(config) {
        if (!!config.timeBetweenMoves) {
            this.timeBetweenMoves =  config.timeBetweenMoves;
        }
    }

    onMessage(e) {
        if (!e.data.name) console.error('missing name in message'. e.data)
        switch (e.data.name) {
            case 'config':
                this.loadConfig(e.data.config)
                break;
        
            default:
                break;
        }
    }
}

export default new Game(worker);