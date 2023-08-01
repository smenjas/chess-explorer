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
        const fileNumber = Square.fileToNumber(file);
        return Square.numberToFile(fileNumber - 1);
    }

    static fileLeft(color, file) {
        return (color === 'White') ? Square.fileDown(file) : Square.fileUp(file);
    }

    static fileRight(color, file) {
        return (color === 'White') ? Square.fileUp(file) : Square.fileDown(file);
    }

    static fileUp(file) {
        const fileNumber = Square.fileToNumber(file);
        return Square.numberToFile(fileNumber + 1);
    }

    static fileToNumber(file) {
        switch (file) {
        case 'a': return 1;
        case 'b': return 2;
        case 'c': return 3;
        case 'd': return 4;
        case 'e': return 5;
        case 'f': return 6;
        case 'g': return 7;
        case 'h': return 8;
        default: return 0;
        }
    }

    static numberToFile(fileNumber) {
        switch (fileNumber) {
        case 1: return 'a';
        case 2: return 'b';
        case 3: return 'c';
        case 4: return 'd';
        case 5: return 'e';
        case 6: return 'f';
        case 7: return 'g';
        case 8: return 'h';
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
