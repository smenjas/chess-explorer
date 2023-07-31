import Board from './board.js';

const board = new Board();

document.title = 'Chess Explorer';
let html = `<h1>${document.title}</h1>`;
html += board.draw();
document.body.insertAdjacentHTML('beforeend', html);
