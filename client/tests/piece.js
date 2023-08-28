import Piece from '../piece.js';

const tests = {};

tests['Piece.exists() works.'] = () => {
    const pieces = {
        BB: true, BK: true, BN: true, BP: true, BQ: true, BR: true,
        WB: true, WK: true, WN: true, WP: true, WQ: true, WR: true,
        '': false,
    };
    const failures = [];
    for (const piece in pieces) {
        const result = Piece.exists(piece);
        if (Piece.exists(piece) !== pieces[piece]) {
            failures.push(`Piece.exists('${piece}') returns: ${result}`);
        }
    }
    return failures;
};

tests['Piece.value() works.'] = () => {
    const pieces = {
        BB: 3, BK: 10, BN: 3, BP: 1, BQ: 9, BR: 5,
        WB: 3, WK: 10, WN: 3, WP: 1, WQ: 9, WR: 5,
        '': 0,
    };
    const failures = [];
    for (const piece in pieces) {
        const result = Piece.value(piece);
        if (Piece.value(piece) !== pieces[piece]) {
            failures.push(`Piece.value('${piece}') returns: ${result}`);
        }
    }
    return failures;
};

export default tests;
