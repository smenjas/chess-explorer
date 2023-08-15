import Piece from './piece.js';

export default class Score {
    static draw(score) {
        let html = '<ol>';
        let notations = Score.notate(score);
        for (const moves of notations) {
            html += `<li>${moves.join(' ')}</li>`;
        }
        html += '</ol>';
        return html;
    }

    static notateCastle(from, to) {
        // Only call this for a king.
        if (from !== 'e1' && from !== 'e8') {
            return '';
        }
        switch (to[0]) {
        case 'c':
            return '0-0-0';
        case 'g':
            return '0-0';
        default:
            return '';
        }
    }

    static notateMove(abbr, from, to, captured, check, mate) {
        // See: https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
        if (abbr === '') {
            return '';
        }
        const piece = Piece.list[abbr];
        let text = '';
        let castleNotation = '';
        switch (piece.type) {
        case 'Bishop':
            text += 'B';
            break;
        case 'King':
            castleNotation = Score.notateCastle(from, to);
            if (castleNotation !== '') {
                return castleNotation;
            }
            text += 'K';
            break;
        case 'Knight':
            text += 'N';
            break;
        case 'Queen':
            text += 'Q';
            break;
        case 'Rook':
            text += 'R';
            break;
        }
        if (captured !== '') {
            if (piece.type === 'Pawn') {
                text += from[0];
            }
            text += 'x';
        }
        text += to;
        if (piece.type === 'Pawn' && (to[1] === '1' || to[1] === '8')) {
            text += 'Q';
        }
        if (mate === true) {
            text += '#';
        }
        else if (check === true) {
            text += '+';
        }
        return text;
    }

    static notate(score) {
        let notations = [];
        for (let i = 0; i < score.length; i++) {
            const move = score[i];
            const n = Math.floor(i / 2);
            if (!(n in notations)) {
                notations[n] = [];
            }
            notations[n].push(Score.notateMove(...move));
        }
        return notations;
    }
}
