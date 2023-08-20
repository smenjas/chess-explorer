import Board from '../board.js';
import Score from '../score.js';
import Test from '../test.js';

const tests = {};

tests['Quick draw works.'] = () => {
    const board = new Board();
    const moves = [
        ['g1', 'f3'], ['g8', 'f6'], // 1. Nf3 Nf6
        ['f3', 'g1'], ['f6', 'g8'], // 2. Ng1 Ng8
        ['g1', 'f3'], ['g8', 'f6'], // 3. Nf3 Nf6
        ['f3', 'g1'], ['f6', 'g8'], // 4. Ng1 Ng8
        ['g1', 'f3'], ['g8', 'f6'], // 5. Nf3 Nf6
        ['f3', 'g1'], ['f6', 'g8'], // 6. Ng1 Ng8
        ['g1', 'f3'], ['g8', 'f6'], // 7. Nf3 Nf6
        ['f3', 'g1'], ['f6', 'g8'], // 8. Ng1 Ng8 (=)
    ];
    if (board.testMoves(moves) === false) {
        return ['Move failed'];
    }
    if (board.draw !== 'fivefold repetition') {
        return ['Draw not recognized'];
    }
    const notations = [
        ['Nf3', 'Nf6'],
        ['Ng1', 'Ng8'],
        ['Nf3', 'Nf6'],
        ['Ng1', 'Ng8'],
        ['Nf3', 'Nf6'],
        ['Ng1', 'Ng8'],
        ['Nf3', 'Nf6'],
        ['Ng1', 'Ng8 (=)'],
    ];
    const test = [
        [[board.score], notations],
    ];
    return Test.run(Score.notate, test);
};

export default tests;
