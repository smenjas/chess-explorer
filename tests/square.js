import Square from '../square.js';
import Test from '../test.js';

const tests = {};

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
