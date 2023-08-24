import Board from './board.js';

const board = new Board();
board.players.Black = 'robot';
board.players.White = 'robot';

do {
    board.analyze();
}
while (board.play());
// TODO: Doesn't notate mate.

console.log(board.describe().replace('<br>', ': '));
