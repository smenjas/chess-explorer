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
        mate: false,
        draw: '',
        drawCount: 0,
        score: [],
        history: [],
        players: {Black: 'human', White: 'human'},
        level: 1,
    };
    static ranks = [1, 2, 3, 4, 5, 6, 7, 8];
    static files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    static paths = {};
    static cache = {};

    constructor(board = null, hypothetical = false) {
        if (board === null) {
            board = Board.restore();
        }
        for (const key in board) {
            this[key] = structuredClone(board[key]);
        }
        this.fixFormat();
        for (const key in Board.fresh) {
            if ((key in this) === false) {
                this[key] = Board.fresh[key];
            }
        }
        if (board === null || hypothetical === true) {
            return;
        }
        this.analyze();
    }

    describe() {
        if (this.mate) {
            return `Checkmate<br>${this.getOpponent()} wins`;
        }
        if (this.draw !== '') {
            return `Draw due to ${this.draw}`;
        }
        let html = `${this.turn}'s move`;
        if (this.check) {
            html += '<br>Check';
        }
        return html;
    }

    encode() {
        // Hash the state of the board.
        let hash = Board.encodeSquares(this.squares);
        hash += Board.encodeEnPassant(this.enPassant);
        hash += Board.encodeCastleRights(this.castle);
        hash += this.turn[0];
        return hash;
    }

    static encodeCastleRights(castle) {
        let code = 0;
        for (const color in castle) {
            for (const square of castle[color]) {
                code += Board.encodeCastleTarget(square);
            }
        }
        return code.toString(16);
    }

    static encodeCastleTarget(square) {
        switch (square) {
        case 'c1': return 1;
        case 'g1': return 2;
        case 'c8': return 4;
        case 'g8': return 8;
        default:
            console.warn('Invalid castle square:', square);
            return 0;
        }
    }

    static encodeEnPassant(square) {
        if (square === '') {
            return ' ';
        }
        return square[0];
    }

    static encodeSquares(squares) {
        let hash = '';
        for (const rank of Board.ranks) {
            for (const file of Board.files) {
                hash += Piece.encode(squares[file + rank]);
            }
        }
        return hash;
    }

    fixFormat() {
        // This is for backward compatibility with older board formats.
        this.fixScore();
        this.fixDraw();
        this.save();
    }

    fixDraw() {
        switch (this.draw) {
        case false:
            this.draw = '';
            break;
        case true:
            this.draw = 'stalemate';
            break;
        }
    }

    static fixShortTempo(tempo) {
        if (tempo.length !== 7) {
            return tempo;
        }
        return [
            tempo[0], // moved
            tempo[1], // from
            tempo[2], // to
            tempo[3], // taken
            tempo[6], // disambiguator
            tempo[4], // check
            false, // draw
            tempo[5], // mate
        ];
    }

    static fixTempo(tempo) {
        if (Array.isArray(tempo) === false) {
            if ('moved' in tempo === false) {
                tempo.moved = tempo.abbr;
                delete tempo.abbr;
            }
            if ('taken' in tempo === false) {
                tempo.taken = tempo.captured;
                delete tempo.captured;
            }
            return tempo;
        }
        tempo = Board.fixShortTempo(tempo);
        return {
            from: tempo[1],
            to: tempo[2],
            moved: tempo[0],
            taken: tempo[3],
            disambiguator: tempo[4],
            check: tempo[5],
            draw: tempo[6],
            mate: tempo[7],
        };
    }

    fixScore() {
        // This is for backward compatibility with the previous score format.
        for (const i in this.score) {
            this.score[i] = Board.fixTempo(this.score[i]);
        }
    }

    render() {
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

    computeMoves() {
        const hash = this.encode();
        if (hash !== this.history[this.history.length - 1]) {
            // Don't save duplicate hashes when refreshing the page.
            this.history.push(hash);
        }
        if (hash in Board.cache) {
            this.risks = Board.cache[hash].risks;
            this.origins = Board.cache[hash].origins;
            this.targets = Board.cache[hash].targets;
            const king = this.kings[this.turn];
            this.check = king in this.risks;
            return !!this.filterOrigins().length;
        }
        // Calculate risks first, to avoid moving the king into danger.
        this.check = this.findRisks();
        // Find all hypothetical moves, regardless of whether the king is in check.
        this.origins = this.findAllMoves();
        this.targets = Board.findAllTargets(this.origins);
        // Restrict moves to those that protect the king, when in check.
        this.filterMoves();
        // Prevent moves that put or leave the king in check.
        const canMove = this.validateMoves();
        Board.cache[hash] = {
            risks: this.risks,
            origins: this.origins,
            targets: this.targets,
        };
        return canMove;
    }

    analyze() {
        const canMove = this.computeMoves();
        if (canMove === true) {
            return;
        }
        if (this.check === true) {
            this.mate = true;
            for (const square in this.origins) {
                this.origins[square] = [];
            }
            this.targets = {};
            return;
        }
        // Stalemate: cannot move, but not in check
        this.draw = 'stalemate';
    }

    validateMove(from, to) {
        // Copy the board, then try a move without updating whose turn it is,
        // to see whether the king will be in check.
        // Return whether the move is valid.
        const board = new Board(this, true);
        const valid = board.move(from, to, true);
        if (valid === false) {
            return false;
        }
        const check = board.findRisks(true);
        return !check;
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

    filterOrigins() {
        return Object.keys(this.origins)
            .filter(origin => this.origins[origin].length !== 0);
    }

    findPath(from, to) {
        const abbr = this.squares[from];
        if (abbr === '') {
            console.warn(from, 'is not occupied: cannot find a path.');
            return [];
        }
        const piece = Piece.list[abbr];
        // Queens, rooks, and bishops can move multiple squares.
        // Kings can move two squares when castling.
        // Knights can leap over pieces.
        switch (piece.type) {
        case 'Knight':
        case 'Pawn':
            return [];
        }
        const key = from + to;
        if (key in Board.paths === true) {
            return Board.paths[key];
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
            Board.paths[key] = squares;
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
            Board.paths[key] = squares;
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
        Board.paths[key] = squares;
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

    static findAllTargets(origins) {
        const targets = {};
        for (const [square, moves] of Object.entries(origins)) {
            for (const move of moves) {
                if (!(move in targets)) {
                    targets[move] = [];
                }
                targets[move].push(square);
            }
        }
        return targets;
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
        return king in this.risks;
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

    findKingAdjacent(theirs = false) {
        const color = theirs === true ? this.getOpponent() : this.turn;
        const king = this.kings[color];
        return Square.findAdjacent(...Square.parse(king));
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
        if (typeof window === 'undefined') {
            return;
        }
        localStorage.setItem('board', JSON.stringify(this));
    }

    disambiguate(moved, from, to) {
        // See: https://en.wikipedia.org/wiki/Algebraic_notation_(chess)#Disambiguating_moves
        const origins = this.targets[to];
        if (origins.length < 2) {
            return '';
        }
        if (moved === '') {
            console.warn('Cannot disambiguate, no piece on', to);
            return '';
        }
        const type = moved[1];
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

    findTakenPiece(from, to) {
        // Call this *before* the move.
        const moved = this.squares[from];
        const taken = this.squares[to];
        if (taken !== '') {
            return taken;
        }
        if (moved[1] === 'P' && (from[0] !== to[0])) {
            // Handle en passant.
            return this.getOpponent()[0] + 'P';
        }
        return '';
    }

    move(from, to, hypothetical = false) {
        const moved = this.squares[from];
        const valid = this.trackPiece(from, to);
        if (valid === false) {
            return false;
        }
        const taken = this.findTakenPiece(from, to);
        this.squares[to] = this.squares[from];
        this.squares[from] = '';
        if (hypothetical === true) {
            return true;
        }
        const disambiguator = this.disambiguate(moved, from, to);
        this.turn = this.getOpponent();
        this.analyze();
        this.detectDraw(moved, taken);
        const tempo = {
            from: from,
            to: to,
            moved: moved,
            taken: taken,
            disambiguator: disambiguator,
            check: this.check,
            draw: this.draw !== '',
            mate: this.mate,
        };
        this.score.push(tempo);
        return true;
    }

    logMove() {
        if (this.robotPresent() === false) {
            return;
        }
        const hash = this.history[this.history.length - 1];
        const tempo = this.score[this.score.length - 1];
        const notation = Score.notateMove(tempo);
        console.log(hash, tempo.moved, tempo.from, tempo.to, notation, tempo.taken);
    }

    robotPresent() {
        return this.players.Black === 'robot' || this.players.White === 'robot';
    }

    static chooseRandomly(array) {
        if (array.length === 1) {
            return array[0];
        }
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    chooseRandomMove() {
        // What legal moves are there to choose from?
        const from = Board.chooseRandomly(this.filterOrigins());
        const to = Board.chooseRandomly(this.origins[from]);
        return [from, to];
    }

    static rateSquares(squares, judge) {
        const ratings = {};
        squares.forEach(square => ratings[square] = judge(square));
        return ratings;
    }

    rateOrigins() {
        // Prioritize the most valuable piece(s) currently at risk.
        return Board.rateSquares(this.filterOrigins(), origin =>
            origin in this.risks ? Piece.value(this.squares[origin]) : 0);
    }

    rateTargets() {
        // Initialize ratings by how many extra pieces can capture that square,
        // plus the opponent piece's value (if any) in the event of capture.
        // If more than one piece can move there, it's protected.
        // TODO: Protected squares are a double edged sword: they also block development (e.g. e3).
        const targets = Object.keys(this.targets);
        return Board.rateSquares(targets, to =>
            this.countProtectors(to) + Piece.value(this.squares[to]));
    }

    getAllMoves() {
        const moves = [];
        for (const from in this.origins) {
            for (const to of this.origins[from]) {
                moves.push([from, to]);
            }
        }
        return moves;
    }

    logRating(from, to, rating, description) {
        if (rating === 0 && description !== 'Final rating') {
            return;
        }
        const sign = rating < 0 ? '' : '+';
        const abbr = this.squares[from];
        console.log(abbr, from, to, `${sign}${rating}`, description);
    }

    chooseCarefulMove() {
        // TODO: Deprioritize moves that open paths to check, e.g. d3, f3, d7, & f7.
        // TODO: Count how many unprotected pieces are at risk, before and after each move.
        // TODO: Preemptively block check. The king moves out into the open too often.
        // TODO: Castling rarely occurs.
        // TODO: Assess check priority.
        // TODO: Increment rating for squares adjacent to the king, or on a path.
        // TODO: Encourage non-pawn development.
        // TODO: Block paths to king.

        const turnCount = Math.ceil(this.history.length / 2);
        const outerGroup = `${this.turn} ${turnCount}`;
        console.groupCollapsed(outerGroup);

        const moves = this.getAllMoves();
        if (moves.length === 1) {
            console.groupEnd(outerGroup);
            return moves[0];
        }

        const fromRatings = this.rateOrigins();
        const toRatings = this.rateTargets();

        const theirAdjacents = this.findKingAdjacent(true);
        const trapped = this.countTrapped(this);

        this.countPawnProtection(fromRatings, toRatings);

        // Find the best moves, by combining ratings, and considering piece losses.
        let maxRating = -Infinity;
        const ratings = {};
        const canWin = this.canWin();
        for (const move of moves) {
            const [from, to] = move;
            const key = from + to;
            ratings[key] = fromRatings[from] + toRatings[to];

            const moved = this.squares[from];
            const innerGroup = `${moved} ${from} ${to}`;
            console.groupCollapsed(innerGroup);
            this.logRating(from, to, fromRatings[from], 'At risk');
            const capture = this.squares[to];
            const captureValue = Piece.value(capture);
            const protectors = toRatings[to] - captureValue;
            this.logRating(from, to, captureValue, `Takes ${capture}`);
            this.logRating(from, to, protectors, 'Target protected');

            ratings[key] += this.rateMove(move);
            ratings[key] += this.emulateMove(from, to, theirAdjacents, trapped, canWin);

            this.logRating(from, to, ratings[key], 'Final rating');
            console.groupEnd(innerGroup);

            if (ratings[key] > maxRating) {
                maxRating = ratings[key];
            }
        }

        const bestMoves = Board.findMoveRating(ratings, maxRating);
        console.log(maxRating, ratings, bestMoves);
        console.groupEnd(outerGroup);
        return Board.chooseRandomly(bestMoves);
    }

    rateMove(move) {
        let rating = 0;
        const [from, to] = move;
        const abbr = this.squares[from];

        // Prioritize pawn promotion.
        if ((abbr === 'WP' && to[1] === '8') || (abbr === 'BP' && to[1] === '1')) {
            this.logRating(from, to, 8, 'Prioritizing pawn promotion');
            rating += 8;
        }
        return rating;
    }

    chooseMove() {
        switch (this.level) {
        case 1:
            return this.chooseCarefulMove();
        default:
            return this.chooseRandomMove();
        }
    }

    canWin() {
        const pieceCounts = this.countPieces();
        const mine = pieceCounts[this.turn];
        const numPieces = Object.keys(mine).length;
        if (numPieces === 1) {
            return false;
        }
        else if (numPieces === 2) {
            if ('Bishop' in mine === true || 'Knight' in mine === true) {
                return false;
            }
        }
        return true;
    }

    emulateMove(from, to, adjacents, trapped, canWin = true) {
        // Copy the board, then try a move to see if it achieves check or mate.
        const board = new Board(this, true);
        const valid = board.move(from, to);
        if (valid === false) {
            return 0;
        }
        // First, consider the effect of the move on the opponent.
        let rating = 0;
        if (board.mate === true) {
            this.logRating(from, to, 100, 'Checkmate');
            rating += 100;
        }
        else if (board.draw !== '') {
            const drawValue = canWin === true ? -1 : 100;
            this.logRating(from, to, drawValue, 'Draw');
            rating += drawValue;
        }
        else if (board.check === true) {
            this.logRating(from, to, 1, 'Check');
            rating += 1;
        }
        // Prioritize restricting the opponent king's movement.
        let kingThreat = 0;
        for (const adjacent of adjacents) {
            if (adjacent in board.risks === true && adjacent in this.targets === false) {
                kingThreat += 1;
            }
        }
        this.logRating(from, to, kingThreat, `${this.getOpponent()} king restricted`);
        rating += kingThreat;
        // Is the origin protected?
        if (from in board.risks) {
            const protectors = board.risks[from];
            const protectorCount = protectors.length;
            if (this.squares[from][1] !== 'P') {
                protectorCount -= 1;
            }
            this.logRating(from, to, -protectorCount, 'Origin protected');
            rating -= protectorCount;
        }
        // Next, consider the effect of the move on our own pieces.
        board.turn = this.turn;
        board.analyze();
        // Is this a risky move?
        if (to in board.risks === true) {
            const value = Piece.value(board.squares[to]);
            this.logRating(from, to, -value, 'Risky');
            rating -= value;
        }
        // Has the number of trapped pieces changed?
        const trappedChange = trapped - board.countTrapped();
        this.logRating(from, to, trappedChange, 'Piece(s) can move');
        rating += trappedChange;
        return rating;
    }

    static findMoveRating(ratings, rating) {
        const moves = [];
        for (const key in ratings) {
            if (ratings[key] === rating) {
                moves.push([key.substring(0, 2), key.substring(2)]);
            }
        }
        return moves;
    }

    play() {
        if (this.mate === true || this.draw !== '') {
            return false;
        }
        const move = this.chooseMove();
        return this.move(...move);
    }

    testMoves(moves) {
        for (const move of moves) {
            if (this.move(...move) === false) {
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
        // When a pawn has just moved two squares, it may be taken en passant.
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

    countPawnProtection(fromRatings, toRatings) {
        // Increment targets protected by pawns.
        for (const from in fromRatings) {
            const abbr = this.squares[from];
            if (abbr[1] !== 'P') {
                continue;
            }
            const [file, rank] = Square.parse(from);
            const jumps = this.findPawnJumps(file, rank, this.turn, true);
            for (const jump of jumps) {
                if (jump in toRatings) {
                    toRatings[jump] += 1;
                }
            }
        }
    }

    countPieces() {
        const pieces = {Black: {}, White: {}};
        for (const square in this.squares) {
            const abbr = this.squares[square];
            if (abbr === '') {
                continue;
            }
            const piece = Piece.list[abbr];
            if ((piece.type in pieces[piece.color]) === false) {
                pieces[piece.color][piece.type] = 1;
            }
            else {
                pieces[piece.color][piece.type] += 1;
            }
        }
        return pieces;
    }

    countProtectors(to) {
        // This does not count targets protected by pawns.
        let count = 0;
        const origins = this.targets[to];
        for (const from of origins) {
            const abbr = this.squares[from];
            if (abbr[1] === 'P') {
                count += 1;
            }
        }
        if (count === 0) {
            return 0;
        }
        return count - 1;
    }

    countRepetitions() {
        if (this.draw !== '') {
            return;
        }
        const lastHash = this.history[this.history.length - 1];
        let count = 0;
        for (const hash of this.history) {
            if (hash === lastHash) {
                count += 1;
            }
        }
        if (count === 5) {
            this.draw = 'fivefold repetition';
        }
    }

    countTrapped() {
        let trapped = 0;
        const turn = this.turn[0];
        for (const square in this.squares) {
            const abbr = this.squares[square];
            if (abbr === '') {
                continue;
            }
            if (abbr[0] !== turn) {
                continue;
            }
            if (this.origins[square].length === 0) {
                trapped += 1;
            }
        }
        return trapped;
    }

    detectDeadPosition() {
        if (this.draw !== '') {
            // If stalemate has occurred, don't bother.
            return;
        }
        const { Black, White } = this.countPieces();
        const numBlack = Object.keys(Black).length;
        const numWhite = Object.keys(White).length;
        let deadPosition = false;
        if (numBlack === 1 && numWhite === 1) {
            // King against king
            deadPosition = true;
        }
        else if (numBlack === 1 && numWhite === 2) {
            if ('Bishop' in White || 'Knight' in White) {
                deadPosition = true;
            }
        }
        else if (numBlack === 2 && numWhite === 1) {
            if ('Bishop' in Black || 'Knight' in Black) {
                deadPosition = true;
            }
        }
        if (deadPosition === true) {
            this.draw = 'insufficient material';
        }
    }

    detectDraw(moved, taken) {
        this.detectDeadPosition();
        this.countRepetitions();
        this.updateDrawCount(moved, taken);
    }

    updateDrawCount(moved, taken) {
        if (taken !== '') {
            this.drawCount = 0;
            return;
        }
        if (moved[1] === 'P') {
            this.drawCount = 0;
            return;
        }
        this.drawCount += 1;
        if (this.drawCount === 75) {
            this.draw = 'the 75-move rule';
        }
    }
}
