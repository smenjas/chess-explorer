import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/Levitsky_versus_Marshall
// White resigned after black's 23rd move.
tests['1912 Levitsky-Marshall works.'] = () => {
    const board = new Board();
    const moves = [
        ['d2', 'd4'], ['e7', 'e6'], // 1. d4 e6
        ['e2', 'e4'], ['d7', 'd5'], // 2. e4 d5
        ['b1', 'c3'], ['c7', 'c5'], // 3. Nc3 c5
        ['g1', 'f3'], ['b8', 'c6'], // 4. Nf3 Nc6
        ['e4', 'd5'], ['e6', 'd5'], // 5. exd5 exd5
        ['f1', 'e2'], ['g8', 'f6'], // 6. Be2 Nf6
        ['e1', 'g1'], ['f8', 'e7'], // 7. 0-0 Be7
        ['c1', 'g5'], ['e8', 'g8'], // 8. Bg5 0-0
        ['d4', 'c5'], ['c8', 'e6'], // 9. dxc5 Be6
        ['f3', 'd4'], ['e7', 'c5'], // 10. Nd4 Bxc5
        ['d4', 'e6'], ['f7', 'e6'], // 11. Nxe6 fxe6
        ['e2', 'g4'], ['d8', 'd6'], // 12. Bg4 Qd6
        ['g4', 'h3'], ['a8', 'e8'], // 13. Bh3 Rae8
        ['d1', 'd2'], ['c5', 'b4'], // 14. Qd2 Bb4
        ['g5', 'f6'], ['f8', 'f6'], // 15. Bxf6 Rxf6
        ['a1', 'd1'], ['d6', 'c5'], // 16. Rad1 Qc5
        ['d2', 'e2'], ['b4', 'c3'], // 17. Qe2 Bxc3
        ['b2', 'c3'], ['c5', 'c3'], // 18. bxc3 Qxc3
        ['d1', 'd5'], ['c6', 'd4'], // 19. Rxd5 Nd4
        ['e2', 'h5'], ['e8', 'f8'], // 20. Qh5 Ref8
        ['d5', 'e5'], ['f6', 'h6'], // 21. Re5 Rh6
        ['h5', 'g5'], ['h6', 'h3'], // 22. Qg5 Rxh3!
        ['e5', 'c5'], ['c3', 'g3'], // 23. Rc5 Qg3!!
        ['g5', 'g3'], ['d4', 'e2'], // 24. Qxg3 Ne2+
        ['g1', 'h1'], ['e2', 'g3'], // 25. Kh1 Nxg3+
        ['f2', 'g3'], ['f8', 'f1'], // 26. fxg3 Rxf1#
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    board.analyze();
    if (board.mate !== true) {
        return ['Checkmate not recognized'];
    }
    const notations = [
        ['d4', 'e6'],
        ['e4', 'd5'],
        ['Nc3', 'c5'],
        ['Nf3', 'Nc6'],
        ['exd5', 'exd5'],
        ['Be2', 'Nf6'],
        ['0-0', 'Be7'],
        ['Bg5', '0-0'],
        ['dxc5', 'Be6'],
        ['Nd4', 'Bxc5'],
        ['Nxe6', 'fxe6'],
        ['Bg4', 'Qd6'],
        ['Bh3', 'Rae8'],
        ['Qd2', 'Bb4'],
        ['Bxf6', 'Rxf6'],
        ['Rad1', 'Qc5'],
        ['Qe2', 'Bxc3'],
        ['bxc3', 'Qxc3'],
        ['Rxd5', 'Nd4'],
        ['Qh5', 'Ref8'],
        ['Re5', 'Rh6'],
        ['Qg5', 'Rxh3'],
        ['Rc5', 'Qg3'],
        ['Qxg3', 'Ne2+'],
        ['Kh1', 'Nxg3+'],
        ['fxg3', 'Rxf1#'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
