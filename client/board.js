import Piece from './piece.js';
import Square from './square.js';

export default class Board {
    static fresh = {
        squares: {
            a1: 'WR', b1: 'WN', c1: 'WB', d1: 'WQ', e1: 'WK', f1: 'WB', g1: 'WN', h1: 'WR',
            a2: 'WP', b2: 'WP', c2: 'WP', d2: 'WP', e2: 'WP', f2: 'WP', g2: 'WP', h2: 'WP',
            a3: '', b3: '', c3: '', d3: '', e3: '', f3: '', g3: '', h3: '',
            a4: '', b4: '', c4: '', d4: '', e4: '', f4: '', g4: '', h4: '',
            a5: '', b5: '', c5: '', d5: '', e5: '', f5: '', g5: '', h5: '',
            a6: '', b6: '', c6: '', d6: '', e6: '', f6: '', g6: '', h6: '',
            a7: 'BP', b7: 'BP', c7: 'BP', d7: 'BP', e7: 'BP', f7: 'BP', g7: 'BP', h7: 'BP',
            a8: 'BR', b8: 'BN', c8: 'BB', d8: 'BQ', e8: 'BK', f8: 'BB', g8: 'BN', h8: 'BR',
        },
        risks: {}, // Squares with opponents, keyed by their possible moves
        origins: {}, // Possible moves, keyed by the origin
        targets: {}, // Squares with pieces that can move, keyed by the move
        enPassant: '', // A skipped square, susceptible to en passant
        turn: 'White',
        king: 'e1',
        check: false,
        mate: false,
    };
    static ranks = [1, 2, 3, 4, 5, 6, 7, 8];
    static files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    constructor(newGame = false) {
        const board = newGame ? Board.fresh : Board.restore();
        for (const key in board) {
            this[key] = board[key];
        }
    }

    describe() {
        if (this.mate) {
            return `<p>Checkmate. ${Board.getOpponent(this)} wins.</p>`;
        }
        let html = `${this.turn}'s move.`;
        if (this.check) {
            html += ' Check.';
        }
        return `<p>${html}</p>`;
    }

    draw() {
        this.analyze();
        let html = '<table class="chess-board"><tbody>';
        for (const rank of Board.ranks.toReversed()) {
            let shade = (rank % 2 === 0) ? 'light' : 'dark';
            html += `<tr class="rank-${rank}">`;
            for (const file of Board.files) {
                const square = `${file}${rank}`;
                const piece = this.squares[square];
                const moves = this.origins[square];
                html += Square.draw(square, shade, piece, !!moves.length, this.targets[square]);
                shade = (shade === 'light') ? 'dark' : 'light';
            }
            html += '</tr>';
        }
        html += '</tr></tbody></table>';
        return html;
    }

    analyze() {
        // Calculate risks first, to avoid moving the king into danger.
        this.risks = Board.findRisks(this);
        // Find all hypothetical moves, regardless of whether the king is in check.
        // Also, find the king, and whether he is in check.
        this.origins = Board.findAllMoves(this);
        this.targets = Board.findAllTargets(this.origins);
        // Restrict moves to those that protect the king, when in check.
        this.filterMoves();
        // Prevent moves that put or leave the king in check.
        const canMove = this.validate();
        this.mate = this.check && !canMove;
        if (this.mate) {
            for (const square in this.origins) {
                this.origins[square] = [];
            }
            this.targets = Board.findAllTargets(this.origins);
        }
    }

    validate() {
        let canMove = false;
        const valid = {};
        for (const origin in this.origins) {
            valid[origin] = [];
            const piece = this.squares[origin];
            const moves = this.origins[origin];
            for (const move of moves) {
                // Copy the board, then try a move without updating whose
                // turn it is, to see whether the king will be in check.
                const board = structuredClone(this);
                board[move] = piece;
                board[origin] = '';
                board.risks = Board.findRisks(board);
                board.king = Board.findKing(board, board.turn);
                board.check = board.king in board.risks;
                if (!board.check) {
                    canMove = true;
                    valid[origin].push(move);
                }
            }
        }
        this.origins = valid;
        this.targets = Board.findAllTargets(this.origins);
        return canMove;
    }

    filterMoves() {
        // When in check, only allow moves that protect the king.
        if (!this.check) {
            return;
        }
        const moves = {};
        // Allow moving the king to safety (already determined).
        for (const from in this.origins) {
            const to = this.origins[from];
            if (to.length && from === this.king) {
                moves[from] = to;
                continue;
            }
            moves[from] = [];
        }
        // Allow moves that block or capture the attacker(s).
        const threats = this.risks[this.king];
        for (const threat of threats) {
            // Allow moves that capture the attacker(s).
            if (threat in this.targets) {
                const defenders = this.targets[threat];
                for (const defender of defenders) {
                    if (defender === this.king) {
                        continue;
                    }
                    moves[defender].push(threat);
                }
            }
            // Allow moves that block the attacker(s).
            const path = this.findPath(threat, this.king);
            for (const square of path) {
                const options = this.targets[square] ?? [];
                for (const option of options) {
                    moves[option].push(square);
                }
            }
        }
        this.origins = moves;
        this.targets = Board.findAllTargets(this.origins);
    }

    findPath(from, to) {
        const abbr = this.squares[from];
        if (abbr === '') {
            console.warn(from, 'is not occupied: cannot find a path.');
            return [];
        }
        const piece = Piece.list[abbr];
        switch (piece.type) {
        case 'Bishop':
        case 'Queen':
        case 'Rook':
            break;
        default:
            return [];
        }
        const [fromFile, fromRank] = Square.parse(from);
        const [toFile, toRank] = Square.parse(to);
        const squares = [];
        if (fromFile === toFile) {
            const lower = Math.min(fromRank, toRank);
            const upper = Math.max(fromRank, toRank);
            const min = lower + 1;
            const max = upper - 1;
            for (let rank = min; rank <= max; rank++) {
                squares.push(`${fromFile}${rank}`);
            }
        }
        return squares;
    }

    static findAllMoves(board, opponent = false) {
        const from = {};
        for (const rank of Board.ranks) {
            for (const file of Board.files) {
                const square = `${file}${rank}`;
                from[square] = Board.findMoves(board, square, opponent);
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

    static findMoves(board, square, opponent = false) {
        const abbr = board.squares[square];
        if (abbr === '') {
            return [];
        }
        const color = opponent ? Board.getOpponent(board) : board.turn;
        const piece = Piece.list[abbr];
        if (piece.color !== color) {
            return [];
        }
        const [file, rank] = Square.parse(square);
        switch (piece.type) {
        case 'Bishop':
            return Board.findBishopMoves(board, file, rank, piece.color);
        case 'King':
            if (!opponent) {
                board.king = square;
                board.check = board.king in board.risks;
            }
            return Board.findKingMoves(board, file, rank, piece.color);
        case 'Knight':
            return Board.findKnightMoves(board, file, rank, piece.color);
        case 'Pawn':
            return Board.findPawnMoves(board, file, rank, piece.color, opponent);
        case 'Queen':
            return Board.findQueenMoves(board, file, rank, piece.color);
        case 'Rook':
            return Board.findRookMoves(board, file, rank, piece.color);
        }
        return [];
    }

    static findRisks(board) {
        return Board.findAllTargets(Board.findAllMoves(board, true));
    }

    static addJump(board, moves, square, color, hypothetical = false) {
        // The hypothetical parameter is for pawns, since they jump weird.
        if (Board.squareOccupiedByOpponent(board, square, color)
            || (square === board.enPassant)
            || (hypothetical && !Board.squareOccupied(board, square))) {
            moves.push(square);
        }
    }

    static addMove(board, moves, square, color = '') {
        // Pass the piece's color if you want to include jumps.
        // Pawns should not pass the piece's color, since they jump weird.
        const occupied = Board.squareOccupied(board, square);
        if (!occupied) {
            moves.push(square);
        }
        else if (color) {
            Board.addJump(board, moves, square, color);
        }
        return occupied;
    }

    static findBishopMoves(board, file, rank, color) {
        // Bishops can move diagonally until blocked by their own color or the
        // edge of the board. They always stay on the same shade of squares.
        const fileNumber = Square.fileToNumber(file);
        const moves = [];
        for (let n = fileNumber + 1, r = rank + 1; n <= 8 && r <= 8; n++, r++) {
            const f = Square.numberToFile(n);
            const occupied = Board.addMove(board, moves, `${f}${r}`, color);
            if (occupied) {
                break;
            }
        }
        for (let n = fileNumber - 1, r = rank - 1; n >= 1 && r >= 1; n--, r--) {
            const f = Square.numberToFile(n);
            const occupied = Board.addMove(board, moves, `${f}${r}`, color);
            if (occupied) {
                break;
            }
        }
        for (let n = fileNumber + 1, r = rank - 1; n <= 8 && r >= 1; n++, r--) {
            const f = Square.numberToFile(n);
            const occupied = Board.addMove(board, moves, `${f}${r}`, color);
            if (occupied) {
                break;
            }
        }
        for (let n = fileNumber - 1, r = rank + 1; n >= 1 && r <= 8; n--, r++) {
            const f = Square.numberToFile(n);
            const occupied = Board.addMove(board, moves, `${f}${r}`, color);
            if (occupied) {
                break;
            }
        }
        return moves;
    }

    static findKing(board, color) {
        // Only validate() should call this.
        const king = `${color[0]}K`;
        for (const square in board.squares) {
            const abbr = board.squares[square];
            if (abbr === king) {
                return square;
            }
        }
        console.warn(king, 'not found!');
        return '';
    }

    static findKingMoves(board, file, rank, color) {
        // Kings can move one square in any direction.
        const squares = Square.findAdjacent(file, rank);
        const moves = [];
        for (const square of squares) {
            if (!(square in board.risks)) {
                Board.addMove(board, moves, square, color);
            }
        }
        return moves;
    }

    static findKnightMoves(board, file, rank, color) {
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
        Board.addMove(board, moves, `${fPlus1}${rPlus2}`, color);
        Board.addMove(board, moves, `${fPlus2}${rPlus1}`, color);
        Board.addMove(board, moves, `${fLess1}${rPlus2}`, color);
        Board.addMove(board, moves, `${fLess2}${rPlus1}`, color);
        Board.addMove(board, moves, `${fPlus1}${rLess2}`, color);
        Board.addMove(board, moves, `${fPlus2}${rLess1}`, color);
        Board.addMove(board, moves, `${fLess1}${rLess2}`, color);
        Board.addMove(board, moves, `${fLess2}${rLess1}`, color);
        return moves;
    }

    static findPawnJumps(board, file, rank, color, hypothetical = false) {
        if ((color === 'White' && rank === 8) || (color === 'Black' && rank === 1)) {
            return [];
        }
        const moves = [];
        const r = (color === 'White') ? rank + 1 : rank - 1;
        const left = Square.fileLeft(color, file);
        const right = Square.fileRight(color, file);
        if (left) {
            Board.addJump(board, moves, `${left}${r}`, color, hypothetical);
        }
        if (right) {
            Board.addJump(board, moves, `${right}${r}`, color, hypothetical);
        }
        return moves;
    }

    static findPawnMoves(board, file, rank, color, jumpsOnly = false) {
        // Pawns can:
        // - move forward one square;
        // - move forward two squares, for the first move only;
        // - jump one square diagonally.
        // TODO: Implement en passant.
        const jumps = Board.findPawnJumps(board, file, rank, color, jumpsOnly);
        if (jumpsOnly) {
            return jumps;
        }
        const moves = (color === 'White') ?
            Board.findWhitePawnMoves(board, file, rank) :
            Board.findBlackPawnMoves(board, file, rank);
        return moves.concat(jumps);
    }

    static findBlackPawnMoves(board, file, rank) {
        const moves = [];
        const min = (rank === 7) ? 5 : (rank > 1) ? rank - 1 : rank;
        for (let r = rank - 1; r >= min; r--) {
            const occupied = Board.addMove(board, moves, `${file}${r}`);
            if (occupied) {
                break;
            }
        }
        return moves;
    }

    static findWhitePawnMoves(board, file, rank) {
        const moves = [];
        const max = (rank === 2) ? 4 : (rank < 8) ? rank + 1 : rank;
        for (let r = rank + 1; r <= max; r++) {
            const occupied = Board.addMove(board, moves, `${file}${r}`);
            if (occupied) {
                break;
            }
        }
        return moves;
    }

    static findQueenMoves(board, file, rank, color) {
        // Queens can move orthogonally (like a rook) or diagonally (like a
        // bishop) until blocked by their own color or the edge of the board.
        const rookMoves = Board.findRookMoves(board, file, rank, color);
        const bishopMoves = Board.findBishopMoves(board, file, rank, color);
        return rookMoves.concat(bishopMoves);
    }

    static findRookMoves(board, file, rank, color) {
        // Rooks can move orthogonally until blocked by their own color or the
        // edge of the board. They move along either the rank or the file.
        const fileNumber = Square.fileToNumber(file);
        const moves = [];
        for (let n = fileNumber + 1; n <= 8; n++) {
            const f = Square.numberToFile(n);
            const occupied = Board.addMove(board, moves, `${f}${rank}`, color);
            if (occupied) {
                break;
            }
        }
        for (let n = fileNumber - 1; n >= 1; n--) {
            const f = Square.numberToFile(n);
            const occupied = Board.addMove(board, moves, `${f}${rank}`, color);
            if (occupied) {
                break;
            }
        }
        for (let r = rank + 1; r <= 8; r++) {
            const occupied = Board.addMove(board, moves, `${file}${r}`, color);
            if (occupied) {
                break;
            }
        }
        for (let r = rank - 1; r >= 1; r--) {
            const occupied = Board.addMove(board, moves, `${file}${r}`, color);
            if (occupied) {
                break;
            }
        }
        return moves;
    }

    static getOpponent(board) {
        return (board.turn === 'Black') ? 'White' : 'Black';
    }

    static restore() {
        return JSON.parse(localStorage.getItem('board')) || Board.fresh;
    }

    save() {
        localStorage.setItem('board', JSON.stringify(this));
    }

    move(from, to) {
        const valid = this.trackEnPassant(from, to);
        if (valid === false) {
            return;
        }
        this.squares[to] = this.squares[from];
        this.squares[from] = '';
        this.turn = Board.getOpponent(this);
        this.origins = {};
        this.targets = {};
        this.risks = {};
        this.save();
    }

    static squareOccupied(board, square) {
        return board.squares[square] !== '';
    }

    static squareOccupiedByOpponent(board, square, color) {
        const piece = board.squares[square];
        if (!piece) {
            return false;
        }
        return Piece.list[piece].color !== color;
    }

    trackEnPassant(from, to) {
        // Track pawns that are open to en passant.
        // Return whether the move is valid, even if it's not a pawn.
        const abbr = this.squares[from];
        if (abbr === '') {
            console.warn('No piece on', from, 'to move to', to);
            this.enPassant = '';
            return false;
        }
        const piece = Piece.list[abbr];
        if (piece.color !== this.turn) {
            const name = `${piece.color} ${piece.type}`;
            console.warn(`Cannot move ${name} on ${this.turn}'s turn.`);
            this.enPassant = '';
            return false;
        }
        if (piece.type !== 'Pawn') {
            this.enPassant = '';
            return true;
        }
        const fromRank = Square.parse(from)[1];
        const [toFile, toRank] = Square.parse(to);
        if (to === this.enPassant) {
            const square = `${toFile}${fromRank}`;
            this.squares[square] = '';
        }
        this.enPassant = '';
        if (toRank - fromRank === 2) {
            const rank = (piece.color === 'White') ? toRank - 1 : toRank + 1;
            const skip = `${toFile}${rank}`;
            this.enPassant = skip;
        }
        return true;
    }
}
