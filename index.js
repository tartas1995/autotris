// change settings here.
const gameConfig = {
    timeBetweenMoves: 250,
    fpsInterval: 1000 / 20
}

const gameWorker = new Worker('./game/index.js', {
    type: 'module'
});
import Display from './display/index.js';

const display = new Display(gameWorker, gameConfig);

gameWorker.postMessage({
    name: 'config',
    config: gameConfig
})