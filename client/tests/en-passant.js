import Board from '../board.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/En_passant
tests['A white pawn can capture a black pawn en passant.'] = () => {
    const failures = [];
    const board = new Board();
    const moves = [
        ['e2', 'e4'], ['c7', 'c6'], // 1. e4 c6
        ['e4', 'e5'], ['d7', 'd5'], // 2. e5 d5
    ];
    if (board.testMoves(moves) === false) {
        failures.push('Move failed');
        return failures;
    }
    if (board.enPassant !== 'd6') {
        failures.push('En passant not recognized');
        return failures;
    }
    if (board.testMoves([['e5', 'd6']]) === false) { // 3. exd6
        failures.push('Move failed');
    }
    else if (board.squares['d5'] !== '') {
        failures.push('Captured pawn still on the board');
    }
    return failures;
};

tests['A black pawn can capture a white pawn en passant.'] = () => {
    const failures = [];
    const board = new Board();
    const moves = [
        ['e2', 'e4'], ['e7', 'e5'], // 1. e4 e5
        ['d2', 'd4'], ['e5', 'd4'], // 2. d4? exd4
        ['c2', 'c4'], // 3. c4
    ];
    if (board.testMoves(moves) === false) {
        failures.push('Move failed');
        return failures;
    }
    if (board.enPassant !== 'c3') {
        failures.push('En passant not recognized');
        return failures;
    }
    if (board.testMoves([['d4', 'c3']]) === false) { // 3... dxc3
        failures.push('Move failed');
    }
    else if (board.squares['c4'] !== '') {
        failures.push('Captured pawn still on the board');
    }
    return failures;
};

export default tests;
