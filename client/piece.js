export default class Piece {
    static draw(abbr) {
        if (abbr.length !== 2) {
            return '';
        }
        const symbols = {
            bb: '&#9821;',
            bk: '&#9818;',
            bn: '&#9822;',
            bp: '&#9823;',
            bq: '&#9819;',
            br: '&#9820;',
            wb: '&#9815;',
            wk: '&#9812;',
            wn: '&#9816;',
            wp: '&#9817;',
            wq: '&#9813;',
            wr: '&#9814;',
        };
        return symbols[abbr];
    }

    static name(abbr) {
        if (abbr.length !== 2) {
            return '';
        }
        const colors = {
            b: 'Black',
            w: 'White',
        };
        const pieces = {
            b: 'Bishop',
            k: 'King',
            n: 'Knight',
            p: 'Pawn',
            q: 'Queen',
            r: 'Rook',
        };
        const color = colors[abbr[0]];
        const piece = pieces[abbr[1]];
        return `${color} ${piece}`;
    }
}
