import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

tests['board.disambiguate() works.'] = () => {
    const board = new Board();
    board.squares = {
        a1: '', b1: '', c1: '', d1: '', e1: 'WQ', f1: '', g1: '', h1: 'WQ',
        a2: '', b2: '', c2: '', d2: '', e2: '', f2: '', g2: '', h2: '',
        a3: 'WR', b3: '', c3: '', d3: '', e3: '', f3: '', g3: '', h3: '',
        a4: '', b4: '', c4: '', d4: '', e4: 'WQ', f4: '', g4: '', h4: '',
        a5: 'WR', b5: '', c5: '', d5: '', e5: '', f5: '', g5: '', h5: '',
        a6: '', b6: '', c6: '', d6: '', e6: '', f6: '', g6: '', h6: '',
        a7: '', b7: '', c7: '', d7: '', e7: '', f7: '', g7: '', h7: '',
        a8: '', b8: '', c8: '', d8: '', e8: '', f8: 'BR', g8: '', h8: 'BR',
    };
    board.targets = {
        f8: ['d8', 'h8'],
        a3: ['a1', 'a5'],
        a5: ['a7'],
        e1: ['a1', 'e4', 'h1', 'h4'],
    };
    const tests = [
        [['BR', 'd8', 'f8'], 'd'],
        [['WR', 'a1', 'a3'], '1'],
        [['WR', 'a7', 'a5'], ''],
        [['WQ', 'h4', 'e1'], 'h4'],
    ];
    return Test.run(board.disambiguate.bind(board), tests);
};

tests['Pawn promotion notation works.'] = () => {
    // See: https://en.wikipedia.org/wiki/Algebraic_notation_(chess)#Pawn_promotion
    const board = new Board();
    board.squares = {
        a1: 'WR', b1: '', c1: '', d1: '', e1: 'WK', f1: '', g1: '', h1: 'WR',
        a2: '', b2: '', c2: 'BP', d2: '', e2: '', f2: '', g2: '', h2: '',
        a3: '', b3: '', c3: '', d3: '', e3: '', f3: '', g3: '', h3: '',
        a4: '', b4: '', c4: '', d4: '', e4: '', f4: '', g4: '', h4: '',
        a5: '', b5: '', c5: '', d5: '', e5: '', f5: '', g5: '', h5: '',
        a6: '', b6: '', c6: '', d6: '', e6: '', f6: '', g6: '', h6: '',
        a7: '', b7: '', c7: '', d7: '', e7: '', f7: '', g7: '', h7: '',
        a8: 'BR', b8: '', c8: '', d8: '', e8: 'BK', f8: '', g8: '', h8: 'BR',
    },
    board.turn = 'Black';
    board.analyze();
    if (board.move('c2', 'c1') === false) { // ... c1Q
        return ['Move failed'];
    }
    if (board.squares.c1 !== 'BQ') {
        return ['Pawn not promoted to queen'];
    }
    const notations = [
        ['c1=Q+'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
