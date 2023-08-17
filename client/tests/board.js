import Board from '../board.js';
import Test from '../test.js';

const tests = {};

tests['board.disambiguate() works.'] = () => {
    const example = {
        squares: {
            a1: '', b1: '', c1: '', d1: '', e1: 'WQ', f1: '', g1: '', h1: 'WQ',
            a2: '', b2: '', c2: '', d2: '', e2: '', f2: '', g2: '', h2: '',
            a3: 'WR', b3: '', c3: '', d3: '', e3: '', f3: '', g3: '', h3: '',
            a4: '', b4: '', c4: '', d4: '', e4: 'WQ', f4: '', g4: '', h4: '',
            a5: 'WR', b5: '', c5: '', d5: '', e5: '', f5: '', g5: '', h5: '',
            a6: '', b6: '', c6: '', d6: '', e6: '', f6: '', g6: '', h6: '',
            a7: '', b7: '', c7: '', d7: '', e7: '', f7: '', g7: '', h7: '',
            a8: '', b8: '', c8: '', d8: '', e8: '', f8: 'BR', g8: '', h8: 'BR',
        },
        targets: {
            f8: ['d8', 'h8'],
            a3: ['a1', 'a5'],
            a5: ['a7'],
            e1: ['a1', 'e4', 'h1', 'h4'],
        },
    };
    const board = new Board(example);
    const tests = [
        [['d8', 'f8'], 'd'],
        [['a1', 'a3'], '1'],
        [['a7', 'a5'], ''],
        [['h4', 'e1'], 'h4'],
    ];
    return Test.run(board.disambiguate.bind(board), tests);
};

export default tests;
