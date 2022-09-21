const gameConfigTypes = {
    //game config
    timeBetweenMoves: 'number',
    //display
    fpsInterval: 'number',
    displayScore: 'boolean',
    color: 'string',
    fontSize: 'string',
    fontFamily: 'string',
    // ai config
    aiInterval: 'number',
    aggregateHeight: 'number',
    lines: 'number',
    holes: 'number',
    bumpiness: 'number',
    // shared
    numberOfRows: 'number',
    numberOfColumns: 'number',
    pixelsPerBlock: 'number',
}

// change settings here.
const gameConfig = {
    //game config
    timeBetweenMoves: 100,
    //display
    fpsInterval: 1000 / 20,
    displayScore: true,
    color: 'white',
    fontSize: '1em',
    fontFamily: 'auto',
    // ai config
    aiInterval: 1000 / 30,
    aggregateHeight: -0.510066,
    lines: 0.760666,
    holes: -0.35663,
    bumpiness: -0.184483,
    // shared
    numberOfRows: 20,
    numberOfColumns: 10,
    pixelsPerBlock: 20,
}

function findGetParameter(parameterName) {
    let result = null,
        tmp = [];
    let items = location.search.substring(1).split("&");
    for (let index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

for (let configKey in gameConfig) {
    const loadValue = findGetParameter(configKey);
    if (loadValue !== null) {
        let transformed = null;
        switch (gameConfigTypes[configKey]) {
            case 'number':
                transformed = parseFloat(loadValue);
                break;
            case 'boolean':
                transformed = (loadValue === 'true' || loadValue === '1')
                break;
            case 'string':
            default:
                transformed = loadValue;
                break;
        }
        gameConfig[configKey] = transformed;
    }
}

const messageChannel = new MessageChannel();

const gameWorker = new Worker('./game/index.js', {
    type: 'module'
});

const aiWorker = new Worker('./game/ai.js', {
    type: 'module'
})


import Display from './display/index.js';

const display = new Display(gameWorker, gameConfig);

aiWorker.postMessage({
    name: 'config',
    config: gameConfig,
}, [messageChannel.port2])

gameWorker.postMessage({
    name: 'config',
    config: gameConfig,
}, [messageChannel.port1])