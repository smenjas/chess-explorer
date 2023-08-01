export default class Piece {
    static list = {
        bb: { symbol: '&#9821;', color: 'Black', type: 'Bishop' },
        bk: { symbol: '&#9818;', color: 'Black', type: 'King' },
        bn: { symbol: '&#9822;', color: 'Black', type: 'Knight' },
        bp: { symbol: '&#9823;', color: 'Black', type: 'Pawn' },
        bq: { symbol: '&#9819;', color: 'Black', type: 'Queen' },
        br: { symbol: '&#9820;', color: 'Black', type: 'Rook' },
        wb: { symbol: '&#9815;', color: 'White', type: 'Bishop' },
        wk: { symbol: '&#9812;', color: 'White', type: 'King' },
        wn: { symbol: '&#9816;', color: 'White', type: 'Knight' },
        wp: { symbol: '&#9817;', color: 'White', type: 'Pawn' },
        wq: { symbol: '&#9813;', color: 'White', type: 'Queen' },
        wr: { symbol: '&#9814;', color: 'White', type: 'Rook' },
    };

    static draw(abbr) {
        if (abbr.length !== 2) {
            return '';
        }
        if (!Piece.exists(abbr)) {
            console.warn('Invalid piece abbreviation:', abbr);
            return '';
        }
        return Piece.list[abbr].symbol;
    }

    static exists(abbr) {
        return abbr in Piece.list;
    }

    static name(abbr) {
        if (abbr.length !== 2) {
            return '';
        }
        if (!Piece.exists(abbr)) {
            console.warn('Invalid piece abbreviation:', abbr);
            return '';
        }
        const piece = Piece.list[abbr];
        return `${piece.color} ${piece.type}`;
    }
}
