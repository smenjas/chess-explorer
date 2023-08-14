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

export default tests;
