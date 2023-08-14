import Square from '../square.js';
import Test from '../test.js';

const tests = {};

tests['Square.fileDown() works.'] = () => {
    const tests = [
        [['a'], ''],
        [['b'], 'a'],
        [['c'], 'b'],
        [['d'], 'c'],
        [['e'], 'd'],
        [['f'], 'e'],
        [['g'], 'f'],
        [['h'], 'g'],
        [['H'], ''],
        [['i'], ''],
        [[''], ''],
        [[1], ''],
    ];
    return Test.run(Square.fileDown, tests);
};

tests['Square.fileLeft() works.'] = () => {
    const tests = [
        [['a', 'Black'], 'b'],
        [['b', 'Black'], 'c'],
        [['c', 'Black'], 'd'],
        [['d', 'Black'], 'e'],
        [['e', 'Black'], 'f'],
        [['f', 'Black'], 'g'],
        [['g', 'Black'], 'h'],
        [['h', 'Black'], ''],
        [['H', 'Black'], ''],
        [['i', 'Black'], ''],
        [['', 'Black'], ''],
        [[1, 'Black'], ''],
        [['a', 'White'], ''],
        [['b', 'White'], 'a'],
        [['c', 'White'], 'b'],
        [['d', 'White'], 'c'],
        [['e', 'White'], 'd'],
        [['f', 'White'], 'e'],
        [['g', 'White'], 'f'],
        [['h', 'White'], 'g'],
        [['H', 'White'], ''],
        [['i', 'White'], ''],
        [['', 'White'], ''],
        [[1, 'White'], ''],
    ];
    return Test.run(Square.fileLeft, tests);
};

tests['Square.fileUp() works.'] = () => {
    const tests = [
        [['a'], 'b'],
        [['b'], 'c'],
        [['c'], 'd'],
        [['d'], 'e'],
        [['e'], 'f'],
        [['f'], 'g'],
        [['g'], 'h'],
        [['h'], ''],
        [['A'], ''],
        [['i'], ''],
        [[''], ''],
        [[1], ''],
    ];
    return Test.run(Square.fileUp, tests);
};

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
        [[''], ''],
        [['a'], ''],
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
