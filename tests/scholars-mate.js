import Board from '../board.js';

const tests = {};

tests['Scholar\'s mate works.'] = () => {
    const failures = [];
    const board = new Board();
    const moves = [
        ['e2', 'e4'], ['e7', 'e5'],
        ['d1', 'h5'], ['b8', 'c6'],
        ['f1', 'c4'], ['g8', 'f6'],
        ['h5', 'f7'],
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
