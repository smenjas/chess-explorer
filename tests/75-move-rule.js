import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

tests['The 75-move rule works.'] = () => {
    // See: https://en.wikipedia.org/wiki/Fifty-move_rule#Timman_vs._Lutz,_1995
    const board = new Board();
    board.squares = {
        a1: '', b1: '', c1: '', d1: '', e1: '', f1: '', g1: '', h1: '',
        a2: '', b2: '', c2: '', d2: '', e2: '', f2: '', g2: '', h2: '',
        a3: '', b3: '', c3: '', d3: '', e3: '', f3: '', g3: '', h3: '',
        a4: '', b4: 'BR', c4: '', d4: '', e4: '', f4: 'WB', g4: '', h4: '',
        a5: '', b5: '', c5: '', d5: '', e5: '', f5: 'WK', g5: 'WR', h5: '',
        a6: '', b6: '', c6: '', d6: '', e6: '', f6: '', g6: '', h6: '',
        a7: '', b7: '', c7: '', d7: '', e7: '', f7: '', g7: '', h7: 'BK',
        a8: '', b8: '', c8: '', d8: '', e8: '', f8: '', g8: '', h8: '',
    },
    board.turn = 'Black';
    board.drawCount = 74;
    board.kings = {Black: 'h7', White: 'f5'};
    board.analyze();
    if (board.testMove('b4', 'b5') === false) { // 121... Rb5+
        return ['Move failed'];
    }
    if (board.draw !== 'the 75-move rule') {
        return ['Draw not recognized'];
    }
    const notations = [
        ['Rb5+ (=)'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
