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
        [['WK', 'e1', 'd1', '', '', false, false, false], 'Kd1'],
        [['WK', 'e1', 'c1', '', '', false, false, false], '0-0-0'],
        [['WK', 'e1', 'g1', '', '', false, false, false], '0-0'],
        [['BK', 'e8', 'c8', '', '', false, false, false], '0-0-0'],
        [['BK', 'e8', 'g8', '', '', false, false, false], '0-0'],
        [['BK', 'e8', 'e7', '', '', false, false, false], 'Ke7'],
        [['BP', 'h7', 'g6', 'WP', '', false, false, false], 'hxg6'],
        [['WN', 'g1', 'f3', '', '', false, false, false], 'Nf3'],
        [['BB', 'f8', 'b4', '', '', false, false, false], 'Bb4'],
        [['BN', 'b8', 'd7', '', 'b', false, false, false], 'Nbd7'],
        [['WQ', 'b5', 'd7', 'BN', '', true, false, false], 'Qxd7+'],
        [['WQ', 'd7', 'd8', '', '', true, false, true], 'Qd8#'],
        [['WK', 'h1', 'g1', 'BR', '', false, true, false], 'Kxg1 (=)'],
    ];
    return Test.run(Score.notateMove, tests);
};

const score = [
    ['WP', 'e2', 'e4', '', '', false, false, false],
    ['BP', 'e7', 'e5', '', '', false, false, false],
    ['WN', 'b1', 'c3', '', '', false, false, false],
    ['BP', 'f7', 'f6', '', '', false, false, false],
    ['WQ', 'd1', 'h5', '', '', true, false, false],
    ['BP', 'g7', 'g6', '', '', false, false, false],
    ['WQ', 'h5', 'g6', 'BP', '', true, false, false],
    ['BP', 'h7', 'g6', 'WQ', '', false, false, false],
    ['WB', 'f1', 'b5', '', '', false, false, false],
    ['BP', 'a7', 'a6', '', '', false, false, false],
    ['WB', 'b5', 'c4', '', '', false, false, false],
    ['BP', 'b7', 'b5', '', '', false, false, false],
    ['WB', 'c4', 'd5', '', '', false, false, false],
    ['BP', 'c7', 'c6', '', '', false, false, false],
    ['WB', 'd5', 'e6', '', '', false, false, false],
    ['BP', 'd7', 'e6', 'WB', '', false, false, false],
    ['WN', 'g1', 'f3', '', '', false, false, false],
    ['BN', 'g8', 'h6', '', '', false, false, false],
    ['WP', 'd2', 'd3', '', '', false, false, false],
    ['BQ', 'd8', 'd4', '', '', false, false, false],
    ['WB', 'c1', 'e3', '', '', false, false, false],
    ['BB', 'f8', 'b4', '', '', false, false, false],
    ['WK', 'e1', 'c1', '', '', false, false, false],
    ['BK', 'e8', 'g8', '', '', false, false, false],
];

tests['Score.notate() works.'] = () => {
    const notations = [
        ['e4', 'e5'],
        ['Nc3', 'f6'],
        ['Qh5+', 'g6'],
        ['Qxg6+', 'hxg6'],
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

tests['Score.render() works.'] = () => {
    let list = '<ol>';
    list += '<li>e4 e5</li>';
    list += '<li>Nc3 f6</li>';
    list += '<li>Qh5+ g6</li>';
    list += '<li>Qxg6+ hxg6</li>';
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
    return Test.run(Score.render, tests);
};

export default tests;
