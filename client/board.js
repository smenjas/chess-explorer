import Piece from './piece.js';
import Score from './score.js';
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
        kings: {Black: 'e8', White: 'e1'},
        castle: {Black: ['c8', 'g8'], White: ['c1', 'g1']},
        check: false,
        draw: false,
        mate: false,
        score: [],
    };
    static ranks = [1, 2, 3, 4, 5, 6, 7, 8];
    static files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

    constructor(board = null) {
        if (board === null) {
            board = Board.restore();
        }
        for (const key in board) {
            this[key] = structuredClone(board[key]);
        }
    }

    describe() {
        if (this.mate) {
            return `Checkmate: ${this.getOpponent().toLowerCase()} wins`;
        }
        if (this.draw) {
            return `${this.turn} can't move: stalemate`;
        }
        let html = `${this.turn}'s move`;
        if (this.check) {
            html += ', check';
        }
        return html;
    }

    fixScore() {
        // This is for backward compatibility with the previous score format.
        for (let i = 0; i < this.score.length; i++) {
            const tempo = this.score[i];
            if (tempo.length === 8) {
                continue;
            }
            this.score[i] = [
                tempo[0], // piece abbreviation
                tempo[1], // from
                tempo[2], // to
                tempo[3], // captured
                tempo[6], // disambiguator
                tempo[4], // check
                false, // draw
                tempo[5], // mate
            ];
        }
        this.save();
    }

    render() {
        this.fixScore();
        this.analyze();
        let html = '<table class="chess-board"><tbody>';
        for (const rank of Board.ranks.toReversed()) {
            let shade = (rank % 2 === 0) ? 'light' : 'dark';
            html += `<tr class="rank-${rank}">`;
            for (const file of Board.files) {
                const square = file + rank;
                const piece = this.squares[square];
                const moves = this.origins[square];
                html += Square.render(square, shade, piece, !!moves.length, this.targets[square]);
                shade = (shade === 'light') ? 'dark' : 'light';
            }
            html += '</tr>';
        }
        html += '</tr></tbody></table>';
        return html;
    }

    analyze() {
        // Calculate risks first, to avoid moving the king into danger.
        this.findRisks();
        // Find all hypothetical moves, regardless of whether the king is in check.
        this.origins = this.findAllMoves();
        this.targets = Board.findAllTargets(this.origins);
        // Restrict moves to those that protect the king, when in check.
        this.filterMoves();
        // Prevent moves that put or leave the king in check.
        const canMove = this.validateMoves();
        if (canMove === true) {
            return;
        }
        if (this.check === true) {
            this.mate = true;
            this.score[this.score.length - 1][7] = true;
            for (const square in this.origins) {
                this.origins[square] = [];
            }
            this.targets = Board.findAllTargets(this.origins);
        }
        // Stalemate: cannot move, but not in check
        this.draw = true;
        this.score[this.score.length - 1][6] = true;
    }

    validateMove(from, to) {
        // Copy the board, then try a move without updating whose turn it is,
        // to see whether the king will be in check.
        // Return whether the move is valid.
        const board = new Board(this);
        const valid = board.move(from, to, true);
        if (valid === false) {
            return false;
        }
        board.findRisks();
        return !board.check;
    }

    validateMoves() {
        let canMove = false;
        const moves = {};
        for (const from in this.origins) {
            moves[from] = [];
            for (const to of this.origins[from]) {
                const valid = this.validateMove(from, to);
                if (valid === true) {
                    canMove = true;
                    moves[from].push(to);
                }
            }
        }
        this.origins = moves;
        this.targets = Board.findAllTargets(this.origins);
        return canMove;
    }

    defendKing(moves, king, threat) {
        // Allow moves that capture the attacker.
        const defenders = this.targets[threat] ?? [];
        for (const defender of defenders) {
            if (defender !== king) {
                moves[defender].push(threat);
            }
        }
        // Allow moves that block the attacker.
        const path = this.findPath(threat, king);
        for (const square of path) {
            const blockers = this.targets[square] ?? [];
            for (const blocker of blockers) {
                moves[blocker].push(square);
            }
        }
    }

    filterMoves() {
        // When in check, only allow moves that protect the king.
        if (!this.check) {
            return;
        }
        const moves = {};
        for (const from in this.origins) {
            moves[from] = [];
        }
        // Allow moving the king to safety (already determined).
        const king = this.kings[this.turn];
        moves[king] = this.origins[king];
        // Allow moves that block or capture the attacker(s).
        const threats = this.risks[king];
        for (const threat of threats) {
            this.defendKing(moves, king, threat);
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
        const minR = Math.min(fromRank, toRank) + 1;
        const maxR = Math.max(fromRank, toRank) - 1;
        if (fromFile === toFile) {
            for (let rank = minR; rank <= maxR; rank++) {
                squares.push(fromFile + rank);
            }
            return squares;
        }
        const fromF = Square.fileToNumber(fromFile);
        const toF = Square.fileToNumber(toFile);
        const minF = Math.min(fromF, toF) + 1;
        const maxF = Math.max(fromF, toF) - 1;
        if (fromRank === toRank) {
            for (let f = minF; f <= maxF; f++) {
                const file = Square.numberToFile(f);
                squares.push(file + fromRank);
            }
            return squares;
        }
        if ((fromFile < toFile && fromRank < toRank) || (fromFile > toFile && fromRank > toRank)) {
            for (let f = minF, r = minR; f <= maxF, r <= maxR; f++, r++) {
                const file = Square.numberToFile(f);
                squares.push(file + r);
            }
        }
        else {
            for (let f = minF, r = maxR; f <= maxF, r >= minR; f++, r--) {
                const file = Square.numberToFile(f);
                squares.push(file + r);
            }
        }
        return squares;
    }

    findAllMoves(opponent = false) {
        const from = {};
        for (const rank of Board.ranks) {
            for (const file of Board.files) {
                const square = file + rank;
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
        if (abbr === '') {
            return [];
        }
        const color = opponent ? this.getOpponent() : this.turn;
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

    findRisks() {
        this.risks = Board.findAllTargets(this.findAllMoves(true));
        const king = this.kings[this.turn];
        this.check = king in this.risks;
        if (this.check) {
            this.score[this.score.length - 1][5] = true;
        }
    }

    addJump(moves, square, color, hypothetical = false) {
        // The hypothetical parameter is for pawns, since they jump weird.
        if (this.squareOccupiedByOpponent(square, color)
            || (square === this.enPassant)
            || (hypothetical && !this.squareOccupied(square))) {
            moves.push(square);
        }
    }

    addMove(moves, square, color = '') {
        // Pass the piece's color if you want to include jumps.
        // Pawns should not pass the piece's color, since they jump weird.
        const occupied = this.squareOccupied(square);
        if (occupied === false) {
            moves.push(square);
        }
        else if (color !== '') {
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
            const occupied = this.addMove(moves, f + r, color);
            if (occupied === true) {
                break;
            }
        }
        for (let n = fileNumber - 1, r = rank - 1; n >= 1 && r >= 1; n--, r--) {
            const f = Square.numberToFile(n);
            const occupied = this.addMove(moves, f + r, color);
            if (occupied === true) {
                break;
            }
        }
        for (let n = fileNumber + 1, r = rank - 1; n <= 8 && r >= 1; n++, r--) {
            const f = Square.numberToFile(n);
            const occupied = this.addMove(moves, f + r, color);
            if (occupied === true) {
                break;
            }
        }
        for (let n = fileNumber - 1, r = rank + 1; n >= 1 && r <= 8; n--, r++) {
            const f = Square.numberToFile(n);
            const occupied = this.addMove(moves, f + r, color);
            if (occupied === true) {
                break;
            }
        }
        return moves;
    }

    findCastleMoves(square, color) {
        if (this.check === true) {
            // Castling is not allowed when in check.
            return [];
        }
        const squares = [];
        for (const target of this.castle[color]) {
            const [rookFrom, rookTo] = this.findRookCastleMove(target);
            const path = this.findPath(square, rookFrom);
            const clear = path.every(square => this.squares[square] === '');
            if (clear === true && (rookTo in this.risks) === false) {
                squares.push(target);
            }
        }
        return squares;
    }

    findRookCastleMove(kingTo) {
        let rookFile = 'a';
        let skipFile = 'd';
        if (kingTo[0] === 'g') {
            rookFile = 'h';
            skipFile = 'f';
        }
        const rank = kingTo[1];
        return [rookFile + rank, skipFile + rank];
    }

    findKingMoves(file, rank, color) {
        // Kings can move one square in any direction.
        const adjacentSquares = Square.findAdjacent(file, rank);
        const castleSquares = this.findCastleMoves(file + rank, color);
        const squares = adjacentSquares.concat(castleSquares);
        const moves = [];
        for (const square of squares) {
            if (!(square in this.risks)) {
                this.addMove(moves, square, color);
            }
        }
        return moves;
    }

    findKnightMoves(file, rank, color) {
        // Knights can move in an L shape, two spaces one direction and one
        // space perpendicular. Other pieces do not block their path.
        const n = Square.fileToNumber(file);
        const fPlus1 = Square.numberToFile(n + 1);
        const fPlus2 = Square.numberToFile(n + 2);
        const fLess1 = Square.numberToFile(n - 1);
        const fLess2 = Square.numberToFile(n - 2);
        const rPlus1 = rank + 1;
        const rPlus2 = rank + 2;
        const rLess1 = rank - 1;
        const rLess2 = rank - 2;
        const moves = [];
        const squares = [
            fPlus1 + rPlus2, fPlus2 + rPlus1, fLess1 + rPlus2, fLess2 + rPlus1,
            fPlus1 + rLess2, fPlus2 + rLess1, fLess1 + rLess2, fLess2 + rLess1,
        ];
        for (const square of squares) {
            if ((square in this.squares) === true) {
                this.addMove(moves, square, color);
            }
        }
        return moves;
    }

    findPawnJumps(file, rank, color, hypothetical = false) {
        if (rank === 1 || rank === 8) {
            return [];
        }
        const moves = [];
        const r = (color === 'White') ? rank + 1 : rank - 1;
        const fileDown = Square.fileDown(file);
        const fileUp = Square.fileUp(file);
        if (fileDown !== '') {
            this.addJump(moves, fileDown + r, color, hypothetical);
        }
        if (fileUp !== '') {
            this.addJump(moves, fileUp + r, color, hypothetical);
        }
        return moves;
    }

    findPawnMoves(file, rank, color, jumpsOnly = false) {
        // Pawns can:
        // - move forward one square;
        // - move forward two squares, for the first move only;
        // - jump one square diagonally.
        const jumps = this.findPawnJumps(file, rank, color, jumpsOnly);
        if (jumpsOnly === true) {
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
            const occupied = this.addMove(moves, file + r);
            if (occupied === true) {
                break;
            }
        }
        return moves;
    }

    findWhitePawnMoves(file, rank) {
        const moves = [];
        const max = (rank === 2) ? 4 : (rank < 8) ? rank + 1 : rank;
        for (let r = rank + 1; r <= max; r++) {
            const occupied = this.addMove(moves, file + r);
            if (occupied === true) {
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
            const occupied = this.addMove(moves, f + rank, color);
            if (occupied === true) {
                break;
            }
        }
        for (let n = fileNumber - 1; n >= 1; n--) {
            const f = Square.numberToFile(n);
            const occupied = this.addMove(moves, f + rank, color);
            if (occupied === true) {
                break;
            }
        }
        for (let r = rank + 1; r <= 8; r++) {
            const occupied = this.addMove(moves, file + r, color);
            if (occupied === true) {
                break;
            }
        }
        for (let r = rank - 1; r >= 1; r--) {
            const occupied = this.addMove(moves, file + r, color);
            if (occupied === true) {
                break;
            }
        }
        return moves;
    }

    getOpponent() {
        return (this.turn === 'Black') ? 'White' : 'Black';
    }

    static restore() {
        if (typeof window === 'undefined') {
            return Board.fresh;
        }
        return JSON.parse(localStorage.getItem('board')) || Board.fresh;
    }

    save() {
        this.origins = {};
        this.targets = {};
        this.risks = {};
        localStorage.setItem('board', JSON.stringify(this));
    }

    disambiguate(from, to) {
        // See: https://en.wikipedia.org/wiki/Algebraic_notation_(chess)#Disambiguating_moves
        const origins = this.targets[to];
        if (origins.length < 2) {
            return '';
        }
        const abbr = this.squares[to];
        if (abbr === '') {
            console.warn('Cannot disambiguate, no piece on', to);
            return '';
        }
        const type = abbr[1];
        if (type === 'P' || type === 'K') {
            return '';
        }
        const disambiguators = [];
        for (const origin of origins) {
            if (origin === from) {
                continue;
            }
            if (type !== this.squares[origin][1]) {
                continue;
            }
            if (from[0] !== origin[0]) {
                disambiguators.push(from[0]);
            }
            else if (from[1] !== origin[1]) {
                disambiguators.push(from[1]);
            }
        }
        switch (disambiguators.length) {
        case 0:
            return '';
        case 1:
            return disambiguators[0];
        default:
            return from;
        }
    }

    findCapturedPiece(from, to) {
        // Call this *before* the move.
        const abbr = this.squares[from];
        if (this.squares[to] === '' && abbr[1] === 'P' && (from[0] !== to[0])) {
            return this.getOpponent()[0] + 'P';
        }
        return this.squares[to];
    }

    move(from, to, hypothetical = false) {
        const valid = this.trackPiece(from, to);
        if (valid === false) {
            return false;
        }
        const captured = this.findCapturedPiece(from, to);
        this.squares[to] = this.squares[from];
        this.squares[from] = '';
        if (hypothetical === true) {
            return true;
        }
        // TODO: Record whether the piece is ambiguous.
        const disambiguator = this.disambiguate(from, to);
        this.score.push([this.squares[to], from, to, captured, disambiguator, false, false, false]);
        this.turn = this.getOpponent();
        return true;
    }

    testMove(from, to) {
        this.analyze();
        return this.move(from, to);
    }

    testMoves(moves) {
        for (const move of moves) {
            if (this.testMove(...move) === false) {
                return false;
            }
        }
        return true;
    }

    renderScore() {
        return Score.render(this.score);
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

    trackPiece(from, to) {
        // Track pawns that are open to en passant.
        // Return whether the move is valid, even if it's not a pawn.
        const abbr = this.squares[from];
        if (abbr === '') {
            console.warn('No piece on', from, 'to move to', to);
            return false;
        }
        if (!(to in this.targets) || !this.targets[to].includes(from)) {
            console.warn('Cannot move', abbr, 'from', from, 'to', to);
            return false;
        }
        const piece = Piece.list[abbr];
        if (piece.color !== this.turn) {
            const name = `${piece.color} ${piece.type}`;
            console.warn(`Cannot move ${name} on ${this.turn}'s turn.`);
            return false;
        }
        if (piece.type === 'King') {
            this.trackKing(from, to, piece.color);
            this.enPassant = '';
            return true;
        }
        if (piece.type === 'Rook') {
            this.trackRook(from, to, piece.color);
            this.enPassant = '';
            return true;
        }
        if (piece.type !== 'Pawn') {
            this.enPassant = '';
            return true;
        }
        return this.trackPawn(from, to, piece.color);
    }

    trackKing(from, to, color) {
        this.kings[color] = to;
        if (this.castle[color].includes(to)) {
            // When castling, move the rook.
            const [rookFrom, rookTo] = this.findRookCastleMove(to);
            this.squares[rookTo] = this.squares[rookFrom];
            this.squares[rookFrom] = '';
        }
        this.castle[color] = []; // Eliminate castling option.
    }

    trackPawn(from, to, color) {
        const fromRank = parseInt(from[1]);
        const [toFile, toRank] = Square.parse(to);
        if (to === this.enPassant) {
            const square = toFile + fromRank;
            this.squares[square] = '';
        }
        this.enPassant = '';
        // When a pawn has just moved two squares, it may be captured en passant.
        if (Math.abs(toRank - fromRank) === 2) {
            const rank = (color === 'White') ? toRank - 1 : toRank + 1;
            const skip = toFile + rank;
            this.enPassant = skip;
        }
        else if (toRank === 1 || toRank === 8) {
            // Automatically promote the pawn to a queen.
            this.squares[from] = this.squares[from][0] + 'Q';
        }
        return true;
    }

    trackRook(from, to, color) {
        if (this.castle[color].length === 0) {
            return;
        }
        // Eliminate castling option when this rook moves.
        const [fromFile, fromRank] = Square.parse(from);
        const file = (fromFile === 'a') ? 'c' : 'g';
        const index = this.castle[color].indexOf(file + fromRank);
        this.castle[color].splice(index, 1);
    }
}
