import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

// See: https://en.wikipedia.org/wiki/Rules_of_chess#Dead_position
const tests = {};

tests['King against king recognized.'] = () => {
    const board = new Board();
    board.squares = {
        a1: '', b1: '', c1: '', d1: '', e1: '', f1: 'WR', g1: 'WK', h1: '',
        a2: '', b2: '', c2: '', d2: '', e2: '', f2: '', g2: '', h2: '',
        a3: '', b3: '', c3: '', d3: '', e3: '', f3: '', g3: '', h3: '',
        a4: '', b4: '', c4: '', d4: '', e4: '', f4: '', g4: '', h4: '',
        a5: '', b5: '', c5: '', d5: '', e5: '', f5: '', g5: '', h5: '',
        a6: '', b6: '', c6: '', d6: '', e6: '', f6: '', g6: '', h6: '',
        a7: '', b7: '', c7: '', d7: '', e7: '', f7: '', g7: '', h7: '',
        a8: '', b8: '', c8: '', d8: '', e8: '', f8: 'BR', g8: 'BK', h8: '',
    },
    board.castle = {Black: [], White: []};
    board.kings = {Black: 'g8', White: 'g1'};
    const moves = [
        ['f1', 'f8'], ['g8', 'f8'], // Rxf8+ Kxf1 (=)
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    if (board.draw !== 'insufficient material') {
        return ['Draw not recognized'];
    }
    board.analyze();
    const notations = [
        ['Rxf8+', 'Kxf8 (=)'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

tests['King against king and bishop recognized.'] = () => {
    const board = new Board();
    board.squares = {
        a1: '', b1: '', c1: '', d1: '', e1: 'WK', f1: 'WB', g1: '', h1: '',
        a2: '', b2: '', c2: '', d2: '', e2: '', f2: '', g2: '', h2: '',
        a3: '', b3: '', c3: '', d3: '', e3: '', f3: '', g3: '', h3: '',
        a4: '', b4: '', c4: '', d4: '', e4: '', f4: '', g4: '', h4: '',
        a5: '', b5: 'BP', c5: '', d5: '', e5: '', f5: '', g5: '', h5: '',
        a6: '', b6: '', c6: '', d6: '', e6: '', f6: '', g6: '', h6: '',
        a7: '', b7: '', c7: '', d7: '', e7: '', f7: '', g7: '', h7: '',
        a8: '', b8: '', c8: '', d8: '', e8: 'BK', f8: '', g8: '', h8: '',
    },
    board.castle = {Black: [], White: []};
    const moves = [
        ['f1', 'b5'], // Bxb5+ (=)
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    if (board.draw !== 'insufficient material') {
        return ['Draw not recognized'];
    }
    board.analyze();
    const notations = [
        ['Bxb5+ (=)'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

tests['King against king and knight recognized.'] = () => {
    const board = new Board();
    board.squares = {
        a1: '', b1: '', c1: '', d1: '', e1: 'WK', f1: '', g1: 'WN', h1: '',
        a2: '', b2: '', c2: '', d2: '', e2: 'BP', f2: '', g2: '', h2: '',
        a3: '', b3: '', c3: '', d3: '', e3: '', f3: '', g3: '', h3: '',
        a4: '', b4: '', c4: '', d4: '', e4: '', f4: '', g4: '', h4: '',
        a5: '', b5: '', c5: '', d5: '', e5: '', f5: '', g5: '', h5: '',
        a6: '', b6: '', c6: '', d6: '', e6: '', f6: '', g6: '', h6: '',
        a7: '', b7: '', c7: '', d7: '', e7: '', f7: '', g7: '', h7: '',
        a8: '', b8: '', c8: '', d8: '', e8: 'BK', f8: '', g8: '', h8: '',
    },
    board.castle = {Black: [], White: []};
    const moves = [
        ['g1', 'e2'], // Nxe2 (=)
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    if (board.draw !== 'insufficient material') {
        return ['Draw not recognized'];
    }
    board.analyze();
    const notations = [
        ['Nxe2 (=)'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
