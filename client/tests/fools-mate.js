import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/Fool%27s_mate
tests['Fool\'s mate works.'] = () => {
    const board = new Board();
    const moves = [
        ['f2', 'f3'], ['e7', 'e5'], // 1. f3 e5
        ['g2', 'g4'], ['d8', 'h4'], // 2. g4?? Qh4# 0-1
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    board.analyze();
    if (board.mate !== true) {
        return ['Checkmate not recognized'];
    }
    const notations = [
        ['f3', 'e5'],
        ['g4', 'Qh4#'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
