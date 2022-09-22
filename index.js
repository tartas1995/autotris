import { gameConfig, gameConfigTypes } from './config.js'

const params = new URLSearchParams(document.location.search);

for (let configKey in gameConfig) {
    const loadValue = params.get(configKey);
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