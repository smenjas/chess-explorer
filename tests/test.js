import Test from '../test.js';

const tests = {};

tests['Test.compare() works.'] = () => {
    const tests = [
        [[null, null], true],
        [[null, undefined], false],
        [[null, false], false],
        [[null, 0], false],
        [[null, ''], false],
        [[undefined, undefined], true],
        [[undefined, false], false],
        [[undefined, 0], false],
        [[undefined, ''], false],
        [[true, true], true],
        [[false, false], true],
        [[true, false], false],
        [[NaN, NaN], true],
        [[NaN, undefined], false],
        [[NaN, null], false],
        [[NaN, false], false],
        [[NaN, 0], false],
        [[0, false], false],
        [[0, 0], true],
        [[0, 1], false],
        [[0.1, 0.1], true],
        [[0.1, 0.2], false],
        [[0n, 0n], true],
        [[0n, 1n], false],
        [['', ''], true],
        [['', 'x'], false],
        [['x', 'x'], true],
        [['x', 'X'], false],
        [[ [], [] ], true],
        [[ [], [1] ], false],
        [[ [1], [1] ], true],
    ];
    return Test.run(Test.compare, tests);
};

tests['Test.compareArrays() works.'] = () => {
    const tests = [
        [[ 0, [] ], false],
        [[ [], 0 ], false],
        [[ [], [] ], true],
        [[ [1], [1] ], true],
        [[ [1], [2] ], false],
        [[ [1], [1, 2] ], false],
        [[ [2, 1], [1, 2] ], false],
        [[ [1, 1, 2], [1, 2, 2] ], false],
        [[ [[]], [[]] ], true],
        [[ [[1]], [[]] ], false],
        [[ [[1]], [[1]] ], true],
        [[ [[1]], [[2]] ], false],
        [[ [[1, 2]], [[1, 2]] ], true],
        [[ [[1, 2]], [[2, 1]] ], false],
        [[ [[1, 1]], [[1, 2]] ], false],
    ];
    return Test.run(Test.compareArrays, tests);
};

tests['Test.showArray() works.'] = () => {
    const tests = [
        [[ [1] ], '[1]'],
        [[ [[]] ], '[[]]'],
        [[ ['A'] ], '[\'A\']'],
        [[ [1, 2] ], '[1, 2]'],
    ];
    return Test.run(Test.showArray, tests);
};

tests['Test.showString() works.'] = () => {
    const tests = [
        [[ '' ], '\'\''],
        [[ 'A' ], '\'A\''],
        [[ 'I\'m' ], '\'I\'m\''],
        [[ '\x00' ], '\'\\u0000\''],
    ];
    return Test.run(Test.showString, tests);
};

tests['Test.showValue() works.'] = () => {
    const tests = [
        [[ undefined ], 'undefined'],
        [[ null ], 'null'],
        [[ true ], 'true'],
        [[ false ], 'false'],
        [[ NaN ], 'NaN'],
        [[ 1 ], '1'],
        [[ '' ], '\'\''],
        [[ 'A' ], '\'A\''],
        [[ 'I\'m' ], '\'I\'m\''],
        [[ [1] ], '[1]'],
        [[ [[]] ], '[[]]'],
        [[ ['A'] ], '[\'A\']'],
        [[ [1, 2] ], '[1, 2]'],
    ];
    return Test.run(Test.showValue, tests);
};

export default tests;
