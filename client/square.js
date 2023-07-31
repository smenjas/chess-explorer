import Piece from './piece.js';

export default class Square {
    static draw(square, shade, piece, canMove) {
        const symbol = Piece.draw(piece);
        const title = Square.title(square, piece);
        const classes = [piece, shade];
        if (canMove) {
            classes.push('can-move');
        }
        return `<td id="${square}" class="${classes.join(' ')}" title="${title}">${symbol}</td>`;
    }

    static fileDown(file) {
        switch (file) {
            case 'b': return 'a';
            case 'c': return 'b';
            case 'd': return 'c';
            case 'e': return 'd';
            case 'f': return 'e';
            case 'g': return 'f';
            case 'h': return 'g';
            default: return '';
        }
    }

    static fileLeft(color, file) {
        return (color === 'White') ? Square.fileDown(file) : Square.fileUp(file);
    }

    static fileRight(color, file) {
        return (color === 'White') ? Square.fileUp(file) : Square.fileDown(file);
    }

    static fileUp(file) {
        switch (file) {
            case 'a': return 'b';
            case 'b': return 'c';
            case 'c': return 'd';
            case 'd': return 'e';
            case 'e': return 'f';
            case 'f': return 'g';
            case 'g': return 'h';
            default: return '';
        }
    }

    static parse(square) {
        const file = square[0];
        const rank = parseInt(square[1]);
        return [file, rank];
    }

    static title(square, piece) {
        let title = square;
        if (Piece.exists(piece)) {
            title += `: ${Piece.name(piece)}`;
        }
        return title;
    }
}
