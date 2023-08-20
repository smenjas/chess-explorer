import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://www.chess.com/article/view/the-shortest-stalemate-possible#comment-10764662
tests['Quick stalemate works.'] = () => {
    const board = new Board();
    const moves = [
        ['d2', 'd4'], ['e7', 'e5'], // 1. d4 e5
        ['d1', 'd2'], ['e5', 'e4'], // 2. Qd2 e4
        ['a2', 'a4'], ['a7', 'a5'], // 3. a4 a5
        ['d2', 'f4'], ['f7', 'f5'], // 4. Qf4 f5
        ['h2', 'h3'], ['d8', 'h4'], // 5. h3 Qh4
        ['f4', 'h2'], ['f8', 'b4'], // 6. Qh2 Bb4+
        ['b1', 'd2'], ['d7', 'd6'], // 7. Nd2 d6
        ['a1', 'a3'], ['c8', 'e6'], // 8. Ra3 Be6
        ['a3', 'g3'], ['e6', 'b3'], // 9. Rg3 Bb3
        ['c2', 'c4'], ['c7', 'c5'], // 10. c4 c5
        ['f2', 'f3'], ['f5', 'f4'], // 11. f3 f4
        ['d4', 'd5'], ['e4', 'e3'], // 12. d5 e3 (=)
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    board.analyze();
    if (board.draw !== 'stalemate') {
        return ['Stalemate not recognized'];
    }
    const notations = [
        ['d4', 'e5'],
        ['Qd2', 'e4'],
        ['a4', 'a5'],
        ['Qf4', 'f5'],
        ['h3', 'Qh4'],
        ['Qh2', 'Bb4+'],
        ['Nd2', 'd6'],
        ['Ra3', 'Be6'],
        ['Rg3', 'Bb3'],
        ['c4', 'c5'],
        ['f3', 'f4'],
        ['d5', 'e3 (=)'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
