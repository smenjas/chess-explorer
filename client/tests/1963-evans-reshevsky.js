import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/Stalemate#Evans_versus_Reshevsky
// and: https://www.chessgames.com/perl/chessgame?gid=1252040
// The players agreed to a draw after white's 50th move. This shows how
// capturing white's offered rook results in stalemate.
tests['1963 Evans-Reshevsky works.'] = () => {
    const board = new Board();
    const moves = [
        ['d2', 'd4'], ['g8', 'f6'], // 1. d4 Nf6
        ['c2', 'c4'], ['e7', 'e6'], // 2. c4 e6
        ['b1', 'c3'], ['f8', 'b4'], // 3. Nc3 Bb4
        ['e2', 'e3'], ['c7', 'c5'], // 4. e3 c5
        ['f1', 'd3'], ['e8', 'g8'], // 5. Bd3 0-0
        ['g1', 'f3'], ['d7', 'd5'], // 6. Nf3 d5
        ['e1', 'g1'], ['d5', 'c4'], // 7. 0-0 dxc4
        ['d3', 'c4'], ['b8', 'd7'], // 8. Bxc4 Nbd7
        ['d1', 'e2'], ['a7', 'a6'], // 9. Qe2 a6
        ['a2', 'a3'], ['c5', 'd4'], // 10. a3 cxd4
        ['a3', 'b4'], ['d4', 'c3'], // 11. axb4 dxc3
        ['b2', 'c3'], ['d8', 'c7'], // 12. bxc3 Qc7
        ['e3', 'e4'], ['e6', 'e5'], // 13. e4 e5
        ['c1', 'b2'], ['d7', 'b6'], // 14. Bb2 Nb6
        ['c4', 'b3'], ['c8', 'g4'], // 15. Bb3 Bg4
        ['a1', 'a5'], ['a8', 'c8'], // 16. Ra5 Rac8
        ['c3', 'c4'], ['b6', 'd7'], // 17. c4 Nbd7
        ['h2', 'h3'], ['g4', 'f3'], // 18. h3 Bxf3
        ['e2', 'f3'], ['f8', 'e8'], // 19. Qxf3 Rfe8
        ['f1', 'd1'], ['c8', 'a8'], // 20. Rd1 Ra8
        ['c4', 'c5'], ['a8', 'd8'], // 21. c5 Rad8
        ['b3', 'a4'], ['e8', 'e7'], // 22. Ba4 Re7
        ['d1', 'd6'], ['b7', 'b5'], // 23. Rd6 b5
        ['a4', 'c2'], ['d7', 'c5'], // 24. Bc2 Nxc5
        ['d6', 'd8'], ['c7', 'd8'], // 25. Rxd8+ Qxd8
        ['f3', 'e3'], ['c5', 'd7'], // 26. Qe3 Ncd7
        ['e3', 'd3'], ['d8', 'b6'], // 27. Qd3 Qb6
        ['b2', 'c1'], ['h7', 'h6'], // 28. Bc1 h6
        ['c1', 'e3'], ['b6', 'b7'], // 29. Be3 Qb7
        ['f2', 'f3'], ['d7', 'b8'], // 30. f3 Nb8
        ['a5', 'a2'], ['e7', 'd7'], // 31. Ra2 Rd7
        ['d3', 'a3'], ['g8', 'h7'], // 32. Qa3 Kh7
        ['g1', 'h2'], ['b7', 'c7'], // 33. Kh2 Qc7
        ['c2', 'd3'], ['f6', 'h5'], // 34. Bd3 Nh5
        ['a2', 'c2'], ['c7', 'd8'], // 35. Rc2 Qd8
        ['d3', 'f1'], ['d7', 'd1'], // 36. Bf1 Rd1
        ['c2', 'c1'], ['d1', 'd6'], // 37. Rc1 Rd6
        ['a3', 'a2'], ['d8', 'f6'], // 38. Qa2 Qf6
        ['c1', 'c7'], ['b8', 'd7'], // 39. Rc7 Nd7
        ['c7', 'a7'], ['h5', 'f4'], // 40. Ra7 Nf4
        ['a2', 'c2'], ['h6', 'h5'], // 41. Qc2 h5
        ['c2', 'c8'], ['d6', 'd1'], // 42. Qc8 Rd1
        ['f1', 'b5'], ['f6', 'g5'], // 43. Bxb5 Qg5
        ['g2', 'g3'], ['a6', 'b5'], // 44. g3 axb5
        ['a7', 'd7'], ['d1', 'e1'], // 45. Rxd7 Re1
        ['d7', 'f7'], ['e1', 'e3'], // 46. Rxf7 Rxe3
        ['h3', 'h4'], ['e3', 'e2'], // 47. h4! Re2+
        ['h2', 'h1'], ['g5', 'g3'], // 48. Kh1 Qxg3??
        ['c8', 'g8'], ['h7', 'g8'], // 49. Qg8+! Kxg8
        ['f7', 'g7'], ['g8', 'g7'], // 50. Rxg7+! Kxg7 (=) 1/2-1/2
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    if (board.draw !== 'stalemate') {
        return ['Stalemate not recognized'];
    }
    const notations = [
        ['d4', 'Nf6'],
        ['c4', 'e6'],
        ['Nc3', 'Bb4'],
        ['e3', 'c5'],
        ['Bd3', '0-0'],
        ['Nf3', 'd5'],
        ['0-0', 'dxc4'],
        ['Bxc4', 'Nbd7'],
        ['Qe2', 'a6'],
        ['a3', 'cxd4'],
        ['axb4', 'dxc3'],
        ['bxc3', 'Qc7'],
        ['e4', 'e5'],
        ['Bb2', 'Nb6'],
        ['Bb3', 'Bg4'],
        ['Ra5', 'Rac8'],
        ['c4', 'Nbd7'],
        ['h3', 'Bxf3'],
        ['Qxf3', 'Rfe8'],
        ['Rd1', 'Ra8'],
        ['c5', 'Rad8'],
        ['Ba4', 'Re7'],
        ['Rd6', 'b5'],
        ['Bc2', 'Nxc5'],
        ['Rxd8+', 'Qxd8'],
        ['Qe3', 'Ncd7'],
        ['Qd3', 'Qb6'],
        ['Bc1', 'h6'],
        ['Be3', 'Qb7'],
        ['f3', 'Nb8'],
        ['Ra2', 'Rd7'],
        ['Qa3', 'Kh7'],
        ['Kh2', 'Qc7'],
        ['Bd3', 'Nh5'],
        ['Rc2', 'Qd8'],
        ['Bf1', 'Rd1'],
        ['Rc1', 'Rd6'],
        ['Qa2', 'Qf6'],
        ['Rc7', 'Nd7'],
        ['Ra7', 'Nf4'],
        ['Qc2', 'h5'],
        ['Qc8', 'Rd1'],
        ['Bxb5', 'Qg5'],
        ['g3', 'axb5'],
        ['Rxd7', 'Re1'],
        ['Rxf7', 'Rxe3'],
        ['h4', 'Re2+'],
        ['Kh1', 'Qxg3'],
        ['Qg8+', 'Kxg8'],
        ['Rxg7+', 'Kxg7 (=)'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
