import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/The_Game_of_the_Century_(chess)
tests['The Game of the Century works.'] = () => {
    const board = new Board();
    const moves = [
        ['g1', 'f3'], ['g8', 'f6'], // 1. Nf3 Nf6
        ['c2', 'c4'], ['g7', 'g6'], // 2. c4 g6
        ['b1', 'c3'], ['f8', 'g7'], // 3. Nc3 Bg7
        ['d2', 'd4'], ['e8', 'g8'], // 4. d4 0-0
        ['c1', 'f4'], ['d7', 'd5'], // 5. Bf4 d5
        ['d1', 'b3'], ['d5', 'c4'], // 6. Qb3 dxc4
        ['b3', 'c4'], ['c7', 'c6'], // 7. Qxc4 c6
        ['e2', 'e4'], ['b8', 'd7'], // 8. e4 Nbd7
        ['a1', 'd1'], ['d7', 'b6'], // 9. Rd1 Nb6
        ['c4', 'c5'], ['c8', 'g4'], // 10. Qc5 Bg4
        ['f4', 'g5'], ['b6', 'a4'], // 11. Bg5? Na4!!
        ['c5', 'a3'], ['a4', 'c3'], // 12. Qa3 Nxc3
        ['b2', 'c3'], ['f6', 'e4'], // 13. bxc3 Nxe4!
        ['g5', 'e7'], ['d8', 'b6'], // 14. Bxe7 Qb6
        ['f1', 'c4'], ['e4', 'c3'], // 15. Bc4 Nxc3!
        ['e7', 'c5'], ['f8', 'e8'], // 16. Bc5 Rfe8+
        ['e1', 'f1'], ['g4', 'e6'], // 17. Kf1 Be6!!
        ['c5', 'b6'], ['e6', 'c4'], // 18. Bxb6? Bxc4+
        ['f1', 'g1'], ['c3', 'e2'], // 19. Kg1 Ne2+
        ['g1', 'f1'], ['e2', 'd4'], // 20. Kf1 Nxd4+
        ['f1', 'g1'], ['d4', 'e2'], // 21. Kg1 Ne2+
        ['g1', 'f1'], ['e2', 'c3'], // 22. Kf1 Nc3+
        ['f1', 'g1'], ['a7', 'b6'], // 23. Kg1 axb6
        ['a3', 'b4'], ['a8', 'a4'], // 24. Qb4 Ra4!
        ['b4', 'b6'], ['c3', 'd1'], // 25. Qxb6 Nxd1
        ['h2', 'h3'], ['a4', 'a2'], // 26. h3 Rxa2
        ['g1', 'h2'], ['d1', 'f2'], // 27. Kh2 Nxf2
        ['h1', 'e1'], ['e8', 'e1'], // 28. Re1 Rxe1
        ['b6', 'd8'], ['g7', 'f8'], // 29. Qd8+ Bf8
        ['f3', 'e1'], ['c4', 'd5'], // 30. Nxe1 Bd5
        ['e1', 'f3'], ['f2', 'e4'], // 31. Nf3 Ne4
        ['d8', 'b8'], ['b7', 'b5'], // 32. Qb8 b5
        ['h3', 'h4'], ['h7', 'h5'], // 33. h4 h5
        ['f3', 'e5'], ['g8', 'g7'], // 34. Ne5 Kg7
        ['h2', 'g1'], ['f8', 'c5'], // 35. Kg1 Bc5+
        ['g1', 'f1'], ['e4', 'g3'], // 36. Kf1 Ng3+
        ['f1', 'e1'], ['c5', 'b4'], // 37. Ke1 Bb4+
        ['e1', 'd1'], ['d5', 'b3'], // 38. Kd1 Bb3+
        ['d1', 'c1'], ['g3', 'e2'], // 39. Kc1 Ne2+
        ['c1', 'b1'], ['e2', 'c3'], // 40. Kb1 Nc3+
        ['b1', 'c1'], ['a2', 'c2'], // 41. Kc1 Rc2# 0-1
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    if (board.mate !== true) {
        return ['Checkmate not recognized'];
    }
    const notations = [
        ['Nf3', 'Nf6'],
        ['c4', 'g6'],
        ['Nc3', 'Bg7'],
        ['d4', '0-0'],
        ['Bf4', 'd5'],
        ['Qb3', 'dxc4'],
        ['Qxc4', 'c6'],
        ['e4', 'Nbd7'],
        ['Rd1', 'Nb6'],
        ['Qc5', 'Bg4'],
        ['Bg5', 'Na4'],
        ['Qa3', 'Nxc3'],
        ['bxc3', 'Nxe4'],
        ['Bxe7', 'Qb6'],
        ['Bc4', 'Nxc3'],
        ['Bc5', 'Rfe8+'],
        ['Kf1', 'Be6'],
        ['Bxb6', 'Bxc4+'],
        ['Kg1', 'Ne2+'],
        ['Kf1', 'Nxd4+'],
        ['Kg1', 'Ne2+'],
        ['Kf1', 'Nc3+'],
        ['Kg1', 'axb6'],
        ['Qb4', 'Ra4'],
        ['Qxb6', 'Nxd1'],
        ['h3', 'Rxa2'],
        ['Kh2', 'Nxf2'],
        ['Re1', 'Rxe1'],
        ['Qd8+', 'Bf8'],
        ['Nxe1', 'Bd5'],
        ['Nf3', 'Ne4'],
        ['Qb8', 'b5'],
        ['h4', 'h5'],
        ['Ne5', 'Kg7'],
        ['Kg1', 'Bc5+'],
        ['Kf1', 'Ng3+'],
        ['Ke1', 'Bb4+'],
        ['Kd1', 'Bb3+'],
        ['Kc1', 'Ne2+'],
        ['Kb1', 'Nc3+'],
        ['Kc1', 'Rc2#'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
