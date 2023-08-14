import Square from '../square.js';
import Test from '../test.js';

const tests = {};

tests['Square.fileToNumber() works.'] = () => {
    const tests = [
        [['a'], 1],
        [['b'], 2],
        [['c'], 3],
        [['d'], 4],
        [['e'], 5],
        [['f'], 6],
        [['g'], 7],
        [['h'], 8],
        [['H'], 0],
        [['i'], 0],
        [[''], 0],
        [[1], 0],
    ];
    return Test.run(Square.fileToNumber, tests);
};

tests['Square.numberToFile() works.'] = () => {
    const tests = [
        [[1], 'a'],
        [[2], 'b'],
        [[3], 'c'],
        [[4], 'd'],
        [[5], 'e'],
        [[6], 'f'],
        [[7], 'g'],
        [[8], 'h'],
        [[0], ''],
    ];
    return Test.run(Square.numberToFile, tests);
};

tests['Square.parse() works.'] = () => {
    const squares = {
        a1: ['a', 1],
        '': [undefined, NaN],
    };
    const failures = [];
    for (const square in squares) {
        const failure = Test.runTest(Square.parse, [[square], squares[square]]);
        if (failure !== '') {
            failures.push(failure);
        }
    }
    return failures;
};

export default tests;
