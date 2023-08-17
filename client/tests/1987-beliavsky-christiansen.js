import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

// See: https://en.wikipedia.org/wiki/Swindle_%28chess%29#Multiple_themes
// and: https://www.chessgames.com/perl/chessgame?gid=1089020
// The players agreed to a draw after black's 38th move.
tests['1987 Beliavsky-Christiansen works.'] = () => {
    const board = new Board();
    const moves = [
        ['d2', 'd4'], ['g8', 'f6'], // 1. d4 Nf6
        ['c2', 'c4'], ['e7', 'e6'], // 2. c4 e6
        ['g2', 'g3'], ['f8', 'b4'], // 3. g3 Bb4+
        ['c1', 'd2'], ['d8', 'e7'], // 4. Bd2 Qe7
        ['f1', 'g2'], ['b4', 'd2'], // 5. Bg2 Bxd2+
        ['d1', 'd2'], ['d7', 'd6'], // 6. Qxd2 d6
        ['b1', 'c3'], ['e8', 'g8'], // 7. Nc3 0-0
        ['g1', 'f3'], ['e6', 'e5'], // 8. Nf3 e5
        ['e1', 'g1'], ['f8', 'e8'], // 9. 0-0 Re8
        ['e2', 'e4'], ['c8', 'g4'], // 10. e4 Bg4
        ['d4', 'd5'], ['g4', 'f3'], // 11. d5 Bxf3
        ['g2', 'f3'], ['b8', 'd7'], // 12. Bxf3 Nbd7
        ['b2', 'b4'], ['a7', 'a5'], // 13. b4 a5
        ['a2', 'a3'], ['a8', 'a6'], // 14. a3 Ra6
        ['c3', 'b5'], ['d7', 'b6'], // 15. Nb5 Nb6
        ['a1', 'c1'], ['a5', 'b4'], // 16. Rac1 axb4
        ['a3', 'b4'], ['e7', 'd7'], // 17. axb4 Qd7
        ['d2', 'd3'], ['a6', 'a4'], // 18. Qd3 Ra4
        ['d3', 'b3'], ['e8', 'a8'], // 19. Qb3 Rea8
        ['f1', 'd1'], ['h7', 'h5'], // 20. Rfd1 h5
        ['h2', 'h4'], ['g7', 'g6'], // 21. h4 g6
        ['c1', 'b1'], ['f6', 'g4'], // 22. Rb1 Ng4
        ['f3', 'e2'], ['d7', 'e7'], // 23. Be2 Qe7
        ['b1', 'c1'], ['c7', 'c6'], // 24. Rbc1 c6
        ['d5', 'c6'], ['b7', 'c6'], // 25. dxc6 bxc6
        ['c4', 'c5'], ['d6', 'c5'], // 26. c5 dxc5
        ['b4', 'c5'], ['b6', 'd7'], // 27. bxc5 Nd7
        ['b5', 'd6'], ['d7', 'f6'], // 28. Nd6 Ndf6
        ['e2', 'c4'], ['g4', 'f2'], // 29. Bc4 Nxf2!?
        ['g1', 'f2'], ['a4', 'a3'], // 30. Kxf2 Ra3
        ['c4', 'f7'], ['g8', 'g7'], // 31. Bxf7+ Kg7
        ['b3', 'e6'], ['a3', 'a2'], // 32. Qe6 Ra2+
        ['f2', 'g1'], ['a8', 'a3'], // 33. Kg1 R8a3!
        ['d6', 'e8'], ['g7', 'h6'], // 34. Ne8+ Kh6!
        ['e8', 'f6'], ['a3', 'g3'], // 35. Nxf6 Rxg3+
        ['g1', 'h1'], ['e7', 'f7'], // 36. Kh1 Qxf7!
        ['d1', 'd7'], ['f7', 'f6'], // 37. Rd7! Qxf6
        ['e6', 'f6'], ['a2', 'h2'], // 38. Qxf6! Rh2+!
        ['h1', 'h2'], ['g3', 'g2'], // 39. Kxh2 Rg2+
        ['h2', 'h3'], ['g2', 'g3'], // 40. Kh3 Rg3+!
        ['h3', 'h2'], ['g3', 'g2'], // 41. Kh2 Rg2+!
        ['h2', 'h1'], ['g2', 'g1'], // 42. Kh1 Rg1+!
        ['h1', 'g1'], // 42. Kxg1 (=) 1/2-1/2
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    board.analyze();
    if (board.draw !== true) {
        return ['Stalemate not recognized'];
    }
    const notations = [
        ['d4', 'Nf6'],
        ['c4', 'e6'],
        ['g3', 'Bb4+'],
        ['Bd2', 'Qe7'],
        ['Bg2', 'Bxd2+'],
        ['Qxd2', 'd6'],
        ['Nc3', '0-0'],
        ['Nf3', 'e5'],
        ['0-0', 'Re8'],
        ['e4', 'Bg4'],
        ['d5', 'Bxf3'],
        ['Bxf3', 'Nbd7'],
        ['b4', 'a5'],
        ['a3', 'Ra6'],
        ['Nb5', 'Nb6'],
        ['Rac1', 'axb4'],
        ['axb4', 'Qd7'],
        ['Qd3', 'Ra4'],
        ['Qb3', 'Rea8'],
        ['Rfd1', 'h5'],
        ['h4', 'g6'],
        ['Rb1', 'Ng4'],
        ['Be2', 'Qe7'],
        ['Rbc1', 'c6'],
        ['dxc6', 'bxc6'],
        ['c5', 'dxc5'],
        ['bxc5', 'Nd7'],
        ['Nd6', 'Ndf6'],
        ['Bc4', 'Nxf2'],
        ['Kxf2', 'Ra3'],
        ['Bxf7+', 'Kg7'],
        ['Qe6', 'Ra2+'],
        ['Kg1', 'R8a3'],
        ['Ne8+', 'Kh6'],
        ['Nxf6', 'Rxg3+'],
        ['Kh1', 'Qxf7'],
        ['Rd7', 'Qxf6'],
        ['Qxf6', 'Rh2+'],
        ['Kxh2', 'Rg2+'],
        ['Kh3', 'Rg3+'],
        ['Kh2', 'Rg2+'],
        ['Kh1', 'Rg1+'],
        ['Kxg1'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
