import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/Scachs_d%27amor
tests['Scachs d\'amor works.'] = () => {
    const board = new Board();
    const moves = [
        ['e2', 'e4'], ['d7', 'd5'], // 1. e4 d5
        ['e4', 'd5'], ['d8', 'd5'], // 2. exd5 Qxd5
        ['b1', 'c3'], ['d5', 'd8'], // 3. Nc3 Qd8
        ['f1', 'c4'], ['g8', 'f6'], // 4. Bc4 Nf6
        ['g1', 'f3'], ['c8', 'g4'], // 5. Nf3 Bg4
        ['h2', 'h3'], ['g4', 'f3'], // 6. h3 Bxf3
        ['d1', 'f3'], ['e7', 'e6'], // 7. Qxf3 e6
        ['f3', 'b7'], ['b8', 'd7'], // 8. Qxb7 Nbd7
        ['c3', 'b5'], ['a8', 'c8'], // 9. Nb5 Rc8
        ['b5', 'a7'], ['d7', 'b6'], // 10. Nxa7 Nb6
        ['a7', 'c8'], ['b6', 'c8'], // 11. Nxc8 Nxc8
        ['d2', 'd4'], ['c8', 'd6'], // 12. d4 Nd6
        ['c4', 'b5'], ['d6', 'b5'], // 13. Bb5+ Nxb5
        ['b7', 'b5'], ['f6', 'd7'], // 14. Qxb5+ Nd7
        ['d4', 'd5'], ['e6', 'd5'], // 15. d5 exd5
        ['c1', 'e3'], ['f8', 'd6'], // 16. Be3 Bd6
        ['a1', 'd1'], ['d8', 'f6'], // 17. Rd1 Qf6
        ['d1', 'd5'], ['f6', 'g6'], // 18. Rxd5 Qg6
        ['e3', 'f4'], ['d6', 'f4'], // 19. Bf4 Bxf4
        ['b5', 'd7'], ['e8', 'f8'], // 20. Qxd7+ Kf8
        ['d7', 'd8'], // 21. Qd8# 1-0
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    board.analyze();
    if (board.mate !== true) {
        return ['Checkmate not recognized'];
    }
    const notations = [
        ['e4', 'd5'],
        ['exd5', 'Qxd5'],
        ['Nc3', 'Qd8'],
        ['Bc4', 'Nf6'],
        ['Nf3', 'Bg4'],
        ['h3', 'Bxf3'],
        ['Qxf3', 'e6'],
        ['Qxb7', 'Nbd7'],
        ['Nb5', 'Rc8'],
        ['Nxa7', 'Nb6'],
        ['Nxc8', 'Nxc8'],
        ['d4', 'Nd6'],
        ['Bb5+', 'Nxb5'],
        ['Qxb5+', 'Nd7'],
        ['d5', 'exd5'],
        ['Be3', 'Bd6'],
        ['Rd1', 'Qf6'],
        ['Rxd5', 'Qg6'],
        ['Bf4', 'Bxf4'],
        ['Qxd7+', 'Kf8'],
        ['Qd8#'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
