import { gameConfig, gameConfigTypes } from './config.js';

const form = document.querySelector('#configuration');
const button = document.querySelector('#submit');
const output = document.querySelector('#output');

button.addEventListener('click', submit)

function createLabel(key) {
    const label = document.createElement('label');
    label.innerHTML = key;
    label.htmlFor = key;
    return label;
}

function createInput(key, type) {
    const input = document.createElement('input');
    input.id = key;
    switch (type) {
        case 'number':
            input.type = "number";
            break;
        case 'boolean':
            input.type = "checkbox";
            break;
        case 'string':
        default:
    }
    return input;
}

function createRow(key, type) {
    const row = document.createElement('div');
    row.appendChild(createLabel(key));
    row.appendChild(createInput(key, type));
    form.appendChild(row);
}

function generateInputs() {
    for (let key of Object.keys(gameConfigTypes)) {
        createRow(key, gameConfigTypes[key]);
    }
}

function populateInputs() {
    for (let key of Object.keys(gameConfig)) {
        const value = gameConfig[key];
        const type = gameConfigTypes[key];
        switch (type) {
            case 'boolean':
                if (value) form.querySelector(`#${key}`).checked = true
                break;
            case 'number':
            case 'string':
            default:
                form.querySelector(`#${key}`).value = value;
                break;
        }
    }
}

function readInputs() {
    const result = {};
    for (let key of Object.keys(gameConfigTypes)) {
        const input = form.querySelector(`#${key}`);
        let value = null;
        switch (gameConfigTypes[key]) {
            case 'boolean':
                value = !!input.checked;
                break;
            case 'number':
                value = parseFloat(input.value);
                break;
            case 'string':
            default:
                value = input.value;
                break;
        }
        result[key] = value;
    }
    return result;
}

function convertInputs(config) {
    const params = new URLSearchParams();
    for (let key of Object.keys(config)) {
        const value = config[key];
        if (value !== '') {
            params.append(key,value);
        }
    }
    return params.toString()
}

function createLink(params) {
    output.href = `./?${params}`;
    output.innerHTML = 'link to autotris with settings'
}

function inital () {
    generateInputs();
    populateInputs();
}

function submit() {
    createLink(convertInputs(readInputs()));
}

inital();