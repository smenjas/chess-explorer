import Piece from './piece.js';
import Square from './square.js';

export default class Board {
    constructor() {
        this.squares = {
            a1: 'wr', b1: 'wn', c1: 'wb', d1: 'wq', e1: 'wk', f1: 'wb', g1: 'wn', h1: 'wr',
            a2: 'wp', b2: 'wp', c2: 'wp', d2: 'wp', e2: 'wp', f2: 'wp', g2: 'wp', h2: 'wp',
            a3: '', b3: '', c3: '', d3: '', e3: '', f3: '', g3: '', h3: '',
            a4: '', b4: '', c4: '', d4: '', e4: '', f4: '', g4: '', h4: '',
            a5: '', b5: '', c5: '', d5: '', e5: '', f5: '', g5: '', h5: '',
            a6: '', b6: '', c6: '', d6: '', e6: '', f6: '', g6: '', h6: '',
            a7: 'bp', b7: 'bp', c7: 'bp', d7: 'bp', e7: 'bp', f7: 'bp', g7: 'bp', h7: 'bp',
            a8: 'br', b8: 'bn', c8: 'bb', d8: 'bq', e8: 'bk', f8: 'bb', g8: 'bn', h8: 'br',
        };
        this.turn = 'White';
    }

    draw() {
        const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

        let html = '<table class="chess-board"><tbody>';
        for (const rank of ranks.reverse()) {
            let shade = (rank % 2 === 0) ? 'light' : 'dark';
            html += `<tr class="rank-${rank}">`;
            for (const file of files) {
                const square = `${file}${rank}`;
                const piece = this.squares[square];
                const moves = this.findMoves(square, piece);
                html += Square.draw(square, shade, piece, !!moves.length);
                shade = (shade === 'light') ? 'dark' : 'light';
            }
            html += '</tr>';
        }
        html += '</tr></tbody></table>';

        return html;
    }

    findMoves(square, abbr) {
        if (!Piece.exists(abbr)) {
            return [];
        }
        const piece = Piece.list[abbr];
        if (piece.color !== this.turn) {
            return [];
        }

        switch (piece.type) {
        case 'Bishop':
            break;
        case 'King':
            return this.findKingMoves(square, piece.color);
        case 'Knight':
            break;
        case 'Pawn':
            return this.findPawnMoves(square, piece.color);
        case 'Queen':
            break;
        case 'Rook':
            break;
        }

        return [];
    }

    addJump(square, color, moves) {
        if (this.squareOccupiedByOpponent(square, color)) {
            moves.push(square);
        }
    }

    addMove(square, color, moves) {
        // Pawns should not call this, since they jump weird.
        const occupied = this.squareOccupied(square);
        if (!occupied) {
            moves.push(square);
        }
        else if (this.squareOccupiedByOpponent(square, color)) {
            moves.push(square);
        }
        return occupied;
    }

    findAdjacentSquares(file, rank) {
        const squares = [];
        const min = (rank === 1) ? 1 : rank - 1;
        const max = (rank === 8) ? 8 : rank + 1;
        const fileDown = Square.fileDown(file);
        if (fileDown) {
            for (let r = min; r <= max; r++) {
                squares.push(`${fileDown}${r}`);
            }
        }
        if (min !== rank) {
            squares.push(`${file}${min}`);
        }
        if (max !== rank) {
            squares.push(`${file}${max}`);
        }
        const fileUp = Square.fileUp(file);
        if (fileUp) {
            for (let r = min; r <= max; r++) {
                squares.push(`${fileUp}${r}`);
            }
        }
        return squares;
    }

    findKingMoves(square, color) {
        // Kings can move one square in any direction.
        // TODO: Disallow moving a king into danger.
        const [file, rank] = Square.parse(square);
        const squares = this.findAdjacentSquares(file, rank);
        const moves = [];
        for (const s of squares) {
            this.addMove(s, color, moves);
        }
        return moves;
    }

    findPawnJumps(file, rank, color) {
        if ((color === 'White' && rank === 8) || (color === 'Black' && rank === 1)) {
            return [];
        }

        const moves = [];
        const r = (color === 'White') ? rank + 1 : rank - 1;
        const left = Square.fileLeft(color, file);
        const right = Square.fileRight(color, file);

        if (left) {
            this.addJump(`${left}${r}`, color, moves);
        }

        if (right) {
            this.addJump(`${right}${r}`, color, moves);
        }

        return moves;
    }

    findPawnMoves(square, color) {
        // Pawns can:
        // - move forward one square;
        // - move forward two squares, for the first move only;
        // - jump one square diagonally.
        // TODO: Implement en passant.
        const [file, rank] = Square.parse(square);
        const moves = (color === 'White') ?
            this.findWhitePawnMoves(file, rank) :
            this.findBlackPawnMoves(file, rank);
        const jumps = this.findPawnJumps(file, rank, color);
        for (const jump of jumps) {
            moves.push(jump);
        }
        return moves;
    }

    findBlackPawnMoves(file, rank) {
        const moves = [];
        const min = (rank === 7) ? 5 : (rank > 1) ? rank - 1 : rank;
        for (let r = rank - 1; r >= min; r--) {
            const square = `${file}${r}`;
            if (this.squareOccupied(square)) {
                break;
            }
            moves.push(square);
        }
        return moves;
    }

    findWhitePawnMoves(file, rank) {
        const moves = [];
        const max = (rank === 2) ? 4 : (rank < 8) ? rank + 1 : rank;
        for (let r = rank + 1; r <= max; r++) {
            const square = `${file}${r}`;
            if (this.squareOccupied(square)) {
                break;
            }
            moves.push(square);
        }
        return moves;
    }

    squareOccupied(square) {
        return this.squares[square] !== '';
    }

    squareOccupiedByOpponent(square, color) {
        const piece = this.squares[square];
        if (piece === '') {
            return false;
        }
        return Piece.list[piece].color !== color;
    }
}
