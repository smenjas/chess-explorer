import Board from '../board.js';

const tests = {};

tests['Fool\'s mate works.'] = () => {
    const failures = [];
    const board = new Board();
    const moves = [
        ['f2', 'f3'], ['e7', 'e5'],
        ['g2', 'g4'], ['d8', 'h4'],
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
}

export default tests;
