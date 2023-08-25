import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/Scholar%27s_mate
tests['Scholar\'s mate works.'] = () => {
    const board = new Board();
    const moves = [
        ['e2', 'e4'], ['e7', 'e5'], // 1. e4 e5
        ['d1', 'h5'], ['b8', 'c6'], // 2. Qh5 Nc6
        ['f1', 'c4'], ['g8', 'f6'], // 3. Bc4 Nf6??
        ['h5', 'f7'], // Qxf7# 1-0
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    if (board.mate !== true) {
        return ['Checkmate not recognized'];
    }
    const notations = [
        ['e4', 'e5'],
        ['Qh5', 'Nc6'],
        ['Bc4', 'Nf6'],
        ['Qxf7#'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
