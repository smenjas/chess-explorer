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
        this.risks = {};
        this.turn = 'White';
    }

    describe() {
        let html = `<p>${this.turn}'s move.</p>`;
        return html;
    }

    draw() {
        const ranks = [1, 2, 3, 4, 5, 6, 7, 8];
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        this.risks = this.findRisks(ranks, files);
        const from = this.findAllMoves(ranks, files);
        const to = Board.findAllTargets(from);
        let html = '<table class="chess-board"><tbody>';
        for (const rank of ranks.reverse()) {
            let shade = (rank % 2 === 0) ? 'light' : 'dark';
            html += `<tr class="rank-${rank}">`;
            for (const file of files) {
                const square = `${file}${rank}`;
                const piece = this.squares[square];
                const moves = from[square];
                html += Square.draw(square, shade, piece, !!moves.length, to[square]);
                shade = (shade === 'light') ? 'dark' : 'light';
            }
            html += '</tr>';
        }
        html += '</tr></tbody></table>';
        return html;
    }

    findAllMoves(ranks, files, opponent = false) {
        const from = {};
        for (const rank of ranks) {
            for (const file of files) {
                const square = `${file}${rank}`;
                from[square] = this.findMoves(square, opponent);
            }
        }
        return from;
    }

    static findAllTargets(from) {
        const to = {};
        for (const [square, moves] of Object.entries(from)) {
            for (const move of moves) {
                if (!(move in to)) {
                    to[move] = [];
                }
                to[move].push(square);
            }
        }
        return to;
    }

    findMoves(square, opponent = false) {
        const abbr = this.squares[square];
        if (!Piece.exists(abbr)) {
            return [];
        }
        const color = !opponent ? this.turn : (this.turn === 'Black') ? 'White' : 'Black';
        const piece = Piece.list[abbr];
        if (piece.color !== color) {
            return [];
        }
        const [file, rank] = Square.parse(square);
        switch (piece.type) {
        case 'Bishop':
            return this.findBishopMoves(file, rank, piece.color);
        case 'King':
            return this.findKingMoves(file, rank, piece.color);
        case 'Knight':
            return this.findKnightMoves(file, rank, piece.color);
        case 'Pawn':
            return this.findPawnMoves(file, rank, piece.color, opponent);
        case 'Queen':
            return this.findQueenMoves(file, rank, piece.color);
        case 'Rook':
            return this.findRookMoves(file, rank, piece.color);
        }
        return [];
    }

    findRisks(ranks, files) {
        return Board.findAllTargets(this.findAllMoves(ranks, files, true));
    }

    addJump(moves, square, color, hypothetical = false) {
        // This is for pawns, since they jump weird.
        if (hypothetical || this.squareOccupiedByOpponent(square, color)) {
            moves.push(square);
        }
    }

    addMove(moves, square, color = '') {
        // Pass the piece's color if you want to include jumps.
        // Pawns should not pass the piece's color, since they jump weird.
        const occupied = this.squareOccupied(square);
        if (!occupied) {
            moves.push(square);
        }
        else if (color) {
            this.addJump(moves, square, color);
        }
        return occupied;
    }

    findBishopMoves(file, rank, color) {
        // Bishops can move diagonally until blocked by their own color or the
        // edge of the board. They always stay on the same shade of squares.
        const fileNumber = Square.fileToNumber(file);
        const moves = [];
        for (let n = fileNumber + 1, r = rank + 1; n <= 8 && r <= 8; n++, r++) {
            const f = Square.numberToFile(n);
            const occupied = this.addMove(moves, `${f}${r}`, color);
            if (occupied) {
                break;
            }
        }
        for (let n = fileNumber - 1, r = rank - 1; n >= 1 && r >= 1; n--, r--) {
            const f = Square.numberToFile(n);
            const occupied = this.addMove(moves, `${f}${r}`, color);
            if (occupied) {
                break;
            }
        }
        for (let n = fileNumber + 1, r = rank - 1; n <= 8 && r >= 1; n++, r--) {
            const f = Square.numberToFile(n);
            const occupied = this.addMove(moves, `${f}${r}`, color);
            if (occupied) {
                break;
            }
        }
        for (let n = fileNumber - 1, r = rank + 1; n >= 1 && r <= 8; n--, r++) {
            const f = Square.numberToFile(n);
            const occupied = this.addMove(moves, `${f}${r}`, color);
            if (occupied) {
                break;
            }
        }
        return moves;
    }

    findKingMoves(file, rank, color) {
        // Kings can move one square in any direction.
        // TODO: Disallow moving a king into danger.
        const squares = Square.findAdjacent(file, rank);
        const moves = [];
        for (const s of squares) {
            if (!(s in this.risks)) {
                this.addMove(moves, s, color);
            }
        }
        return moves;
    }

    findKnightMoves(file, rank, color) {
        // Knights can move in an L shape, two spaces one direction and one
        // space perpendicular. Other pieces do not block their path.
        const n = Square.fileToNumber(file);
        const moves = [];
        const fPlus1 = Square.numberToFile(n + 1);
        const fPlus2 = Square.numberToFile(n + 2);
        const fLess1 = Square.numberToFile(n - 1);
        const fLess2 = Square.numberToFile(n - 2);
        const rPlus1 = rank + 1;
        const rPlus2 = rank + 2;
        const rLess1 = rank - 1;
        const rLess2 = rank - 2;
        this.addMove(moves, `${fPlus1}${rPlus2}`, color);
        this.addMove(moves, `${fPlus2}${rPlus1}`, color);
        this.addMove(moves, `${fLess1}${rPlus2}`, color);
        this.addMove(moves, `${fLess2}${rPlus1}`, color);
        this.addMove(moves, `${fPlus1}${rLess2}`, color);
        this.addMove(moves, `${fPlus2}${rLess1}`, color);
        this.addMove(moves, `${fLess1}${rLess2}`, color);
        this.addMove(moves, `${fLess2}${rLess1}`, color);
        return moves;
    }

    findPawnJumps(file, rank, color, hypothetical = false) {
        if ((color === 'White' && rank === 8) || (color === 'Black' && rank === 1)) {
            return [];
        }
        const moves = [];
        const r = (color === 'White') ? rank + 1 : rank - 1;
        const left = Square.fileLeft(color, file);
        const right = Square.fileRight(color, file);
        if (left) {
            this.addJump(moves, `${left}${r}`, color, hypothetical);
        }
        if (right) {
            this.addJump(moves, `${right}${r}`, color, hypothetical);
        }
        return moves;
    }

    findPawnMoves(file, rank, color, jumpsOnly = false) {
        // Pawns can:
        // - move forward one square;
        // - move forward two squares, for the first move only;
        // - jump one square diagonally.
        // TODO: Implement en passant.
        const jumps = this.findPawnJumps(file, rank, color, jumpsOnly);
        if (jumpsOnly) {
            return jumps;
        }
        const moves = (color === 'White') ?
            this.findWhitePawnMoves(file, rank) :
            this.findBlackPawnMoves(file, rank);
        return moves.concat(jumps);
    }

    findBlackPawnMoves(file, rank) {
        const moves = [];
        const min = (rank === 7) ? 5 : (rank > 1) ? rank - 1 : rank;
        for (let r = rank - 1; r >= min; r--) {
            const occupied = this.addMove(moves, `${file}${r}`);
            if (occupied) {
                break;
            }
        }
        return moves;
    }

    findWhitePawnMoves(file, rank) {
        const moves = [];
        const max = (rank === 2) ? 4 : (rank < 8) ? rank + 1 : rank;
        for (let r = rank + 1; r <= max; r++) {
            const occupied = this.addMove(moves, `${file}${r}`);
            if (occupied) {
                break;
            }
        }
        return moves;
    }

    findQueenMoves(file, rank, color) {
        // Queens can move orthogonally (like a rook) or diagonally (like a
        // bishop) until blocked by their own color or the edge of the board.
        const rookMoves = this.findRookMoves(file, rank, color);
        const bishopMoves = this.findBishopMoves(file, rank, color);
        return rookMoves.concat(bishopMoves);
    }

    findRookMoves(file, rank, color) {
        // Rooks can move orthogonally until blocked by their own color or the
        // edge of the board. They move along either the rank or the file.
        const fileNumber = Square.fileToNumber(file);
        const moves = [];
        for (let n = fileNumber + 1; n <= 8; n++) {
            const f = Square.numberToFile(n);
            const occupied = this.addMove(moves, `${f}${rank}`, color);
            if (occupied) {
                break;
            }
        }
        for (let n = fileNumber - 1; n >= 1; n--) {
            const f = Square.numberToFile(n);
            const occupied = this.addMove(moves, `${f}${rank}`, color);
            if (occupied) {
                break;
            }
        }
        for (let r = rank + 1; r <= 8; r++) {
            const occupied = this.addMove(moves, `${file}${r}`, color);
            if (occupied) {
                break;
            }
        }
        for (let r = rank - 1; r >= 1; r--) {
            const occupied = this.addMove(moves, `${file}${r}`, color);
            if (occupied) {
                break;
            }
        }
        return moves;
    }

    move(from, to) {
        this.squares[to] = this.squares[from];
        this.squares[from] = '';
        this.turn = (this.turn === 'Black') ? 'White' : 'Black';
    }

    squareOccupied(square) {
        return this.squares[square] !== '';
    }

    squareOccupiedByOpponent(square, color) {
        const piece = this.squares[square];
        if (!piece) {
            return false;
        }
        return Piece.list[piece].color !== color;
    }
}
