import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/Peruvian_Immortal
tests['The Peruvian Immortal works.'] = () => {
    const board = new Board();
    const moves = [
        ['e2', 'e4'], ['d7', 'd5'], // 1. e4 d5
        ['e4', 'd5'], ['d8', 'd5'], // 2. exd5 Qxd5
        ['b1', 'c3'], ['d5', 'a5'], // 3. Nc3 Qa5
        ['d2', 'd4'], ['c7', 'c6'], // 4. d4 c6
        ['g1', 'f3'], ['c8', 'g4'], // 5. Nf3 Bg4
        ['c1', 'f4'], ['e7', 'e6'], // 6. Bf4 e6
        ['h2', 'h3'], ['g4', 'f3'], // 7. h3 Bxf3
        ['d1', 'f3'], ['f8', 'b4'], // 8. Qxf3 Bb4
        ['f1', 'e2'], ['b8', 'd7'], // 9. Be2 Nd7
        ['a2', 'a3'], ['e8', 'c8'], // 10. a3 0-0-0??
        ['a3', 'b4'], ['a5', 'a1'], // 11. axb4!! Qxa1+
        ['e1', 'd2'], ['a1', 'h1'], // 12. Kd2! Qxh1
        ['f3', 'c6'], ['b7', 'c6'], // 13. Qxc6+! bxc6
        ['e2', 'a6'], // 14. Ba6# 1-0
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    if (board.mate !== true) {
        return ['Checkmate not recognized'];
    }
    const notations = [
        ['e4', 'd5'],
        ['exd5', 'Qxd5'],
        ['Nc3', 'Qa5'],
        ['d4', 'c6'],
        ['Nf3', 'Bg4'],
        ['Bf4', 'e6'],
        ['h3', 'Bxf3'],
        ['Qxf3', 'Bb4'],
        ['Be2', 'Nd7'],
        ['a3', '0-0-0'],
        ['axb4', 'Qxa1+'],
        ['Kd2', 'Qxh1'],
        ['Qxc6+', 'bxc6'],
        ['Ba6#'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
