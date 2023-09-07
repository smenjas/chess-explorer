import Board from './board.js';

const board = new Board();
board.players.Black = 'robot';
board.players.White = 'robot';

while (board.play()) {
    board.logMove();
}

console.log(board.describe().replace('<br>', ': '));

// This is how much localStorage would be used in a browser.
const json = JSON.stringify(board);
const bytes = Buffer.byteLength(json);
console.log('Board object size:', bytes, 'bytes');
