import Board from '../board.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/Scholar%27s_mate
tests['Scholar\'s mate works.'] = () => {
    const failures = [];
    const board = new Board();
    const moves = [
        ['e2', 'e4'], ['e7', 'e5'], // 1. e4 e5
        ['d1', 'h5'], ['b8', 'c6'], // 2. Qh5 Nc6
        ['f1', 'c4'], ['g8', 'f6'], // 3. Bc4 Nf6??
        ['h5', 'f7'], // Qxf7# 1-0
    ];
    if (board.testMoves(moves) === false) {
        failures.push('Move failed');
        return failures;
    }
    board.analyze();
    if (board.mate !== true) {
        failures.push('Checkmate not recognized');
    }
    return failures;
};

export default tests;
