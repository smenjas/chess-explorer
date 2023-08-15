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

tests['Square.fileRight() works.'] = () => {
    const tests = [
        [['a', 'Black'], ''],
        [['b', 'Black'], 'a'],
        [['c', 'Black'], 'b'],
        [['d', 'Black'], 'c'],
        [['e', 'Black'], 'd'],
        [['f', 'Black'], 'e'],
        [['g', 'Black'], 'f'],
        [['h', 'Black'], 'g'],
        [['H', 'Black'], ''],
        [['i', 'Black'], ''],
        [['', 'Black'], ''],
        [[1, 'Black'], ''],
        [['a', 'White'], 'b'],
        [['b', 'White'], 'c'],
        [['c', 'White'], 'd'],
        [['d', 'White'], 'e'],
        [['e', 'White'], 'f'],
        [['f', 'White'], 'g'],
        [['g', 'White'], 'h'],
        [['h', 'White'], ''],
        [['H', 'White'], ''],
        [['i', 'White'], ''],
        [['', 'White'], ''],
        [[1, 'White'], ''],
    ];
    return Test.run(Square.fileRight, tests);
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

tests['Square.findAdjacent() works.'] = () => {
    const tests = [
        [['a', 1], ['a2', 'b1', 'b2']],
        [['a', 8], ['a7', 'b7', 'b8']],
        [['d', 4], ['c3', 'c4', 'c5', 'd3', 'd5', 'e3', 'e4', 'e5']],
        [['e', 1], ['d1', 'd2', 'e2', 'f1', 'f2']],
        [['e', 8], ['d7', 'd8', 'e7', 'f7', 'f8']],
        [['h', 1], ['g1', 'g2', 'h2']],
        [['h', 8], ['g7', 'g8', 'h7']],
    ];
    return Test.run(Square.findAdjacent, tests);
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
