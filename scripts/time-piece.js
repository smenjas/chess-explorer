import Piece from '../client/piece.js';

// Optimal check for piece abbreviation validity: >12x faster than calling Piece.exists()
function checkPieceLength(abbr) {
    if (abbr.length !== 2) {
        return '';
    }
    return 'x';
}

// Suboptimal check for piece abbreviation validity: >12x slower than checking string length
function checkPieceExists(abbr) {
    if (!Piece.exists(abbr)) {
        return '';
    }
    return 'x';
}

const functions = [
    checkPieceLength,
    checkPieceExists,
];

const input = ['BB', 'BK', 'BN', 'BP', 'BQ', 'BR', 'WB', 'WK', 'WN', 'WP', 'WQ', 'WR', ''];

const max = 1e7;
for (const f of functions) {
    console.time(f.name);
    for (let n = 0; n < max; n++) {
        for (const i of input) {
            f(i);
        }
    }
    console.timeEnd(f.name);
}
