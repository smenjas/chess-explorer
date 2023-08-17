import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/Immortal_Game
tests['The Immortal Game works.'] = () => {
    const board = new Board();
    const moves = [
        ['e2', 'e4'], ['e7', 'e5'], // 1. e4 e5
        ['f2', 'f4'], ['e5', 'f4'], // 2. f4 exf4
        ['f1', 'c4'], ['d8', 'h4'], // 3. Bc4 Qh4+
        ['e1', 'f1'], ['b7', 'b5'], // 4. Kf1 b5?!
        ['c4', 'b5'], ['g8', 'f6'], // 5. Bxb5 Nf6
        ['g1', 'f3'], ['h4', 'h6'], // 6. Nf3 Qh6
        ['d2', 'd3'], ['f6', 'h5'], // 7. d3 Nh5
        ['f3', 'h4'], ['h6', 'g5'], // 8. Nh4 Qg5
        ['h4', 'f5'], ['c7', 'c6'], // 9. Nf5 c6
        ['g2', 'g4'], ['h5', 'f6'], // 10. g4? Nf6
        ['h1', 'g1'], ['c6', 'b5'], // 11. Rg1! cxb5?
        ['h2', 'h4'], ['g5', 'g6'], // 12. h4! Qg6
        ['h4', 'h5'], ['g6', 'g5'], // 13. h5 Qg5
        ['d1', 'f3'], ['f6', 'g8'], // 14. Qf3 Ng8
        ['c1', 'f4'], ['g5', 'f6'], // 15. Bxf4 Qf6
        ['b1', 'c3'], ['f8', 'c5'], // 16. Nc3 Bc5
        ['c3', 'd5'], ['f6', 'b2'], // 17. Nd5 Qxb2
        ['f4', 'd6'], ['c5', 'g1'], // 18. Bd6! Bxg1?
        ['e4', 'e5'], ['b2', 'a1'], // 19. e5! Qxa1+
        ['f1', 'e2'], ['b8', 'a6'], // 20. Ke2 Na6
        ['f5', 'g7'], ['e8', 'd8'], // 21. Nxg7+ Kd8
        ['f3', 'f6'], ['g8', 'f6'], // 22. Qf6+! Nxf6
        ['d6', 'e7'], // 23. Be7# 1-0
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    board.analyze();
    if (board.mate !== true) {
        return ['Checkmate not recognized'];
    }
    const notations = [
        ['e4', 'e5'],
        ['f4', 'exf4'],
        ['Bc4', 'Qh4+'],
        ['Kf1', 'b5'],
        ['Bxb5', 'Nf6'],
        ['Nf3', 'Qh6'],
        ['d3', 'Nh5'],
        ['Nh4', 'Qg5'],
        ['Nf5', 'c6'],
        ['g4', 'Nf6'],
        ['Rg1', 'cxb5'],
        ['h4', 'Qg6'],
        ['h5', 'Qg5'],
        ['Qf3', 'Ng8'],
        ['Bxf4', 'Qf6'],
        ['Nc3', 'Bc5'],
        ['Nd5', 'Qxb2'],
        ['Bd6', 'Bxg1'],
        ['e5', 'Qxa1+'],
        ['Ke2', 'Na6'],
        ['Nxg7+', 'Kd8'],
        ['Qf6+', 'Nxf6'],
        ['Be7#'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
