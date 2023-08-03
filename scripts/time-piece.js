import Piece from '../client/piece.js';

// Optimal check for piece abbreviation validity: >6x faster than checking string length
function checkPieceEmpty(abbr) {
    return abbr !== '';
}

// Suboptimal check for piece abbreviation validity: >6x slower than comparing to the empty string
function checkPieceFalsy(abbr) {
    return !!abbr;
}

// Suboptimal check for piece abbreviation validity: ~6x slower than comparing to the empty string
function checkPieceLength(abbr) {
    return abbr.length === 2;
}

// Pessimal check for piece abbreviation validity: ~15x slower than compaing to the empty string
function checkPieceExists(abbr) {
    return Piece.exists(abbr);
}

// Pessimal check for piece abbreviation validity: ~15x slower than compaing to the empty string
function checkPieceInObject(abbr) {
    return abbr in Piece.list;
}

// Pessimal check for piece abbreviation validity: ~15x slower than compaing to the empty string
function checkPieceListHasOwn(abbr) {
    return Object.hasOwn(Piece.list, abbr);
}

const functions = [
    checkPieceEmpty,
    checkPieceFalsy,
    checkPieceLength,
    checkPieceExists,
    checkPieceInObject,
    checkPieceListHasOwn,
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
