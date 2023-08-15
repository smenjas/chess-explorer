import Score from '../score.js';
import Test from '../test.js';

const tests = {};

tests['Score.notateCastle() works.'] = () => {
    const tests = [
        [['e1', 'd1'], ''],
        [['e1', 'c1'], '0-0-0'],
        [['e1', 'g1'], '0-0'],
        [['e8', 'c8'], '0-0-0'],
        [['e8', 'g8'], '0-0'],
        [['e8', 'e7'], ''],
    ];
    return Test.run(Score.notateCastle, tests);
};

tests['Score.notateMove() works.'] = () => {
    const tests = [
        [['WK', 'e1', 'd1', ''], 'Kd1'],
        [['WK', 'e1', 'c1', ''], '0-0-0'],
        [['WK', 'e1', 'g1', ''], '0-0'],
        [['BK', 'e8', 'c8', ''], '0-0-0'],
        [['BK', 'e8', 'g8', ''], '0-0'],
        [['BK', 'e8', 'e7', ''], 'Ke7'],
        [['BP', 'h7', 'g6', 'WP'], 'hxg6'],
        [['WN', 'g1', 'f3', ''], 'Nf3'],
        [['BB', 'f8', 'b4', ''], 'Bb4'],
    ];
    return Test.run(Score.notateMove, tests);
};

const score = [
    ['WP', 'e2', 'e4', ''],
    ['BP', 'e7', 'e5', ''],
    ['WN', 'b1', 'c3', ''],
    ['BP', 'f7', 'f6', ''],
    ['WQ', 'd1', 'h5', ''],
    ['BP', 'g7', 'g6', ''],
    ['WQ', 'h5', 'g6', 'BP'],
    ['BP', 'h7', 'g6', 'WQ'],
    ['WB', 'f1', 'b5', ''],
    ['BP', 'a7', 'a6', ''],
    ['WB', 'b5', 'c4', ''],
    ['BP', 'b7', 'b5', ''],
    ['WB', 'c4', 'd5', ''],
    ['BP', 'c7', 'c6', ''],
    ['WB', 'd5', 'e6', ''],
    ['BP', 'd7', 'e6', 'WB'],
    ['WN', 'g1', 'f3', ''],
    ['BN', 'g8', 'h6', ''],
    ['WP', 'd2', 'd3', ''],
    ['BQ', 'd8', 'd4', ''],
    ['WB', 'c1', 'e3', ''],
    ['BB', 'f8', 'b4', ''],
    ['WK', 'e1', 'c1', ''],
    ['BK', 'e8', 'g8', ''],
];

tests['Score.notate() works.'] = () => {
    const notations = [
        ['e4', 'e5'],
        ['Nc3', 'f6'],
        ['Qh5', 'g6'],
        ['Qxg6', 'hxg6'],
        ['Bb5', 'a6'],
        ['Bc4', 'b5'],
        ['Bd5', 'c6'],
        ['Be6', 'dxe6'],
        ['Nf3', 'Nh6'],
        ['d3', 'Qd4'],
        ['Be3', 'Bb4'],
        ['0-0-0', '0-0'],
    ];
    const tests = [
        [[score], notations],
    ];
    return Test.run(Score.notate, tests);
};

tests['Score.draw() works.'] = () => {
    let list = '<ol>';
    list += '<li>e4 e5</li>';
    list += '<li>Nc3 f6</li>';
    list += '<li>Qh5 g6</li>';
    list += '<li>Qxg6 hxg6</li>';
    list += '<li>Bb5 a6</li>';
    list += '<li>Bc4 b5</li>';
    list += '<li>Bd5 c6</li>';
    list += '<li>Be6 dxe6</li>';
    list += '<li>Nf3 Nh6</li>';
    list += '<li>d3 Qd4</li>';
    list += '<li>Be3 Bb4</li>';
    list += '<li>0-0-0 0-0</li>';
    list += '</ol>';
    const tests = [
        [[score], list],
    ];
    return Test.run(Score.draw, tests);
};

export default tests;
