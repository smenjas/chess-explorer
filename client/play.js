import Board from './board.js';

const board = new Board();
board.players.Black = 'robot';
board.players.White = 'robot';

while (board.play()) {
    board.logMove();
}

console.log(board.describe().replace('<br>', ': '));
