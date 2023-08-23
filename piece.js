export default class Piece {
    static list = {
        BB: { value: 3, symbol: '&#9821;', color: 'Black', type: 'Bishop' },
        BK: { value: 10, symbol: '&#9818;', color: 'Black', type: 'King' },
        BN: { value: 3, symbol: '&#9822;', color: 'Black', type: 'Knight' },
        BP: { value: 1, symbol: '&#x265F;&#xFE0E;', color: 'Black', type: 'Pawn' },
        BQ: { value: 9, symbol: '&#9819;', color: 'Black', type: 'Queen' },
        BR: { value: 5, symbol: '&#9820;', color: 'Black', type: 'Rook' },
        WB: { value: 3, symbol: '&#9815;', color: 'White', type: 'Bishop' },
        WK: { value: 10, symbol: '&#9812;', color: 'White', type: 'King' },
        WN: { value: 3, symbol: '&#9816;', color: 'White', type: 'Knight' },
        WP: { value: 1, symbol: '&#9817;', color: 'White', type: 'Pawn' },
        WQ: { value: 9, symbol: '&#9813;', color: 'White', type: 'Queen' },
        WR: { value: 5, symbol: '&#9814;', color: 'White', type: 'Rook' },
    };

    static render(abbr) {
        if (Piece.exists(abbr) === false) {
            return '';
        }
        return Piece.list[abbr].symbol;
    }

    static encode(abbr) {
        if (abbr === '') {
            return ' ';
        }
        if (abbr[0] === 'B') {
            return abbr[1];
        }
        return abbr[1].toLowerCase();
    }

    static exists(abbr) {
        if (abbr === '') {
            return false;
        }
        return abbr in Piece.list;
    }

    static name(abbr) {
        if (Piece.exists(abbr) === false) {
            return '';
        }
        const piece = Piece.list[abbr];
        return `${piece.color} ${piece.type}`;
    }
}
