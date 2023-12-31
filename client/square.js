import Piece from './piece.js';

export default class Square {
    static render(square, shade, piece, canMove, moved, incoming) {
        const symbol = Piece.render(piece);
        const classes = [piece, shade];
        if (canMove === true) {
            classes.push('can-move');
        }
        if (moved === true) {
            classes.push('moved');
        }
        if (Array.isArray(incoming) === true) {
            for (const square of incoming) {
                classes.push(`from-${square}`);
            }
        }
        const coord = `<div class="coord">${square}</div>`;
        return `<td id="${square}" class="${classes.join(' ')}">${coord}${symbol}</td>`;
    }

    static fileDown(file) {
        const fileNumber = Square.fileToNumber(file);
        return Square.numberToFile(fileNumber - 1);
    }

    static fileLeft(file, color) {
        return (color === 'White') ? Square.fileDown(file) : Square.fileUp(file);
    }

    static fileRight(file, color) {
        return (color === 'White') ? Square.fileUp(file) : Square.fileDown(file);
    }

    static fileUp(file) {
        const fileNumber = Square.fileToNumber(file);
        if (fileNumber === 0) {
            return '';
        }
        return Square.numberToFile(fileNumber + 1);
    }

    static fileToNumber(file) {
        // This is >4x faster than calling charCodeAt().
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
        // This is 6-10% faster than using a switch statement.
        if (typeof fileNumber !== 'number' || fileNumber < 1 || fileNumber > 8) {
            return '';
        }
        return String.fromCharCode(fileNumber + 96);
    }

    static adjacent = {};

    static findAdjacent(file, rank) {
        const square = file + rank;
        if ((square in Square.adjacent) === true) {
            return Square.adjacent[square];
        }
        const squares = [];
        const min = (rank === 1) ? 1 : rank - 1;
        const max = (rank === 8) ? 8 : rank + 1;
        const fileDown = Square.fileDown(file);
        if (fileDown !== '') {
            for (let r = min; r <= max; r++) {
                squares.push(fileDown + r);
            }
        }
        if (min !== rank) {
            squares.push(file + min);
        }
        if (max !== rank) {
            squares.push(file + max);
        }
        const fileUp = Square.fileUp(file);
        if (fileUp !== '') {
            for (let r = min; r <= max; r++) {
                squares.push(fileUp + r);
            }
        }
        Square.adjacent[square] = squares;
        return squares;
    }

    static parse(square) {
        const file = square[0];
        const rank = parseInt(square[1]);
        return [file, rank];
    }

    static title(square, piece) {
        let title = square;
        if (piece !== '') {
            title += `: ${Piece.name(piece)}`;
        }
        return title;
    }
}
