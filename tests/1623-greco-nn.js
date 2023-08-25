import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://www.chessgames.com/perl/chessgame?gid=1243022
tests['1623 Greco-NN works.'] = () => {
    const board = new Board();
    const moves = [
        ['e2', 'e4'], ['b7', 'b6'], // 1. e4 b6
        ['d2', 'd4'], ['c8', 'b7'], // 2. d4 Bb7
        ['f1', 'd3'], ['f7', 'f5'], // 3. Bd3 f5
        ['e4', 'f5'], ['b7', 'g2'], // 4. exf5 Bxg2
        ['d1', 'h5'], ['g7', 'g6'], // 5. Qh5+ g6
        ['f5', 'g6'], ['g8', 'f6'], // 6. fxg6 Nf6
        ['g6', 'h7'], ['f6', 'h5'], // 7. gxh7+ Nxh5
        ['d3', 'g6'], // 8. Bg6# 1-0
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    if (board.mate !== true) {
        return ['Checkmate not recognized'];
    }
    const notations = [
        ['e4', 'b6'],
        ['d4', 'Bb7'],
        ['Bd3', 'f5'],
        ['exf5', 'Bxg2'],
        ['Qh5+', 'g6'],
        ['fxg6', 'Nf6'],
        ['gxh7+', 'Nxh5'],
        ['Bg6#'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
