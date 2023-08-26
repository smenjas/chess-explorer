import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/En_passant
tests['A white pawn can capture a black pawn en passant.'] = () => {
    const board = new Board();
    const moves = [
        ['e2', 'e4'], ['c7', 'c6'], // 1. e4 c6
        ['e4', 'e5'], ['d7', 'd5'], // 2. e5 d5
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    if (board.enPassant !== 'd6') {
        return ['En passant not recognized'];
    }
    if (board.testMove('e5', 'd6') === false) { // 3. exd6
        return ['Move failed'];
    }
    if (board.squares['d5'] !== '') {
        return ['Captured pawn still on the board'];
    }
    const notations = [
        ['e4', 'c6'],
        ['e5', 'd5'],
        ['exd6'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

tests['A black pawn can capture a white pawn en passant.'] = () => {
    const board = new Board();
    const moves = [
        ['e2', 'e4'], ['e7', 'e5'], // 1. e4 e5
        ['d2', 'd4'], ['e5', 'd4'], // 2. d4? exd4
        ['c2', 'c4'], // 3. c4
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    if (board.enPassant !== 'c3') {
        return ['En passant not recognized'];
    }
    if (board.testMove('d4', 'c3') === false) { // 3... dxc3
        return ['Move failed'];
    }
    if (board.squares['c4'] !== '') {
        return ['Captured pawn still on the board'];
    }
    const notations = [
        ['e4', 'e5'],
        ['d4', 'exd4'],
        ['c4', 'dxc3'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
