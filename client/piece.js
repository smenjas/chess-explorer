export default class Piece {
    static list = {
        BB: { symbol: '&#9821;', color: 'Black', type: 'Bishop' },
        BK: { symbol: '&#9818;', color: 'Black', type: 'King' },
        BN: { symbol: '&#9822;', color: 'Black', type: 'Knight' },
        BP: { symbol: '&#x265F;&#xFE0E;', color: 'Black', type: 'Pawn' },
        BQ: { symbol: '&#9819;', color: 'Black', type: 'Queen' },
        BR: { symbol: '&#9820;', color: 'Black', type: 'Rook' },
        WB: { symbol: '&#9815;', color: 'White', type: 'Bishop' },
        WK: { symbol: '&#9812;', color: 'White', type: 'King' },
        WN: { symbol: '&#9816;', color: 'White', type: 'Knight' },
        WP: { symbol: '&#9817;', color: 'White', type: 'Pawn' },
        WQ: { symbol: '&#9813;', color: 'White', type: 'Queen' },
        WR: { symbol: '&#9814;', color: 'White', type: 'Rook' },
    };

    static draw(abbr) {
        if (Piece.exists(abbr) === false) {
            return '';
        }
        return Piece.list[abbr].symbol;
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
