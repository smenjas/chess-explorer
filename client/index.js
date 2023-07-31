'use strict';

function drawBoard(positions) {
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    let html = '<table class="chess-board"><tbody>';
    for (const rank of ranks.reverse()) {
        let square = (rank % 2 === 0) ? 'light' : 'dark';
        html += `<tr class="rank-${rank}">`;
        for (const file of files) {
            const position = `${file}${rank}`;
            const piece = positions[position];
            const symbol = drawPiece(piece);
            const title = namePiece(piece);
            html += `<td class="${position} ${piece} ${square}" title="${title}">${symbol}</td>`;
            square = (square === 'light') ? 'dark' : 'light';
        }
        html += '</tr>';
    }
    html += '</tr></tbody></table>';

    return html;
}

function drawPiece(abbr) {
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

function namePiece(abbr) {
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

const positions = {
    a1: 'wr', b1: 'wn', c1: 'wb', d1: 'wq', e1: 'wk', f1: 'wb', g1: 'wn', h1: 'wr',
    a2: 'wp', b2: 'wp', c2: 'wp', d2: 'wp', e2: 'wp', f2: 'wp', g2: 'wp', h2: 'wp',
    a3: '', b3: '', c3: '', d3: '', e3: '', f3: '', g3: '', h3: '',
    a4: '', b4: '', c4: '', d4: '', e4: '', f4: '', g4: '', h4: '',
    a5: '', b5: '', c5: '', d5: '', e5: '', f5: '', g5: '', h5: '',
    a6: '', b6: '', c6: '', d6: '', e6: '', f6: '', g6: '', h6: '',
    a7: 'bp', b7: 'bp', c7: 'bp', d7: 'bp', e7: 'bp', f7: 'bp', g7: 'bp', h7: 'bp',
    a8: 'br', b8: 'bn', c8: 'bb', d8: 'bq', e8: 'bk', f8: 'bb', g8: 'bn', h8: 'br',
};

document.title = 'Chess Explorer';
let html = `<h1>${document.title}</h1>`;
html += drawBoard(positions);
document.body.insertAdjacentHTML('beforeend', html);
