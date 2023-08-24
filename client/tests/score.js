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
        [[{abbr: 'WK', from: 'e1', to: 'd1', captured: '', disambiguator: '', check: false, draw: false, mate: false}], 'Kd1'],
        [[{abbr: 'WK', from: 'e1', to: 'c1', captured: '', disambiguator: '', check: false, draw: false, mate: false}], '0-0-0'],
        [[{abbr: 'WK', from: 'e1', to: 'g1', captured: '', disambiguator: '', check: false, draw: false, mate: false}], '0-0'],
        [[{abbr: 'BK', from: 'e8', to: 'c8', captured: '', disambiguator: '', check: false, draw: false, mate: false}], '0-0-0'],
        [[{abbr: 'BK', from: 'e8', to: 'g8', captured: '', disambiguator: '', check: false, draw: false, mate: false}], '0-0'],
        [[{abbr: 'BK', from: 'e8', to: 'e7', captured: '', disambiguator: '', check: false, draw: false, mate: false}], 'Ke7'],
        [[{abbr: 'BP', from: 'h7', to: 'g6', captured: 'WP', disambiguator: '', check: false, draw: false, mate: false}], 'hxg6'],
        [[{abbr: 'WN', from: 'g1', to: 'f3', captured: '', disambiguator: '', check: false, draw: false, mate: false}], 'Nf3'],
        [[{abbr: 'BB', from: 'f8', to: 'b4', captured: '', disambiguator: '', check: false, draw: false, mate: false}], 'Bb4'],
        [[{abbr: 'BN', from: 'b8', to: 'd7', captured: '', disambiguator: 'b', check: false, draw: false, mate: false}], 'Nbd7'],
        [[{abbr: 'WQ', from: 'b5', to: 'd7', captured: 'BN', disambiguator: '', check: true, draw: false, mate: false}], 'Qxd7+'],
        [[{abbr: 'WQ', from: 'd7', to: 'd8', captured: '', disambiguator: '', check: true, draw: false, mate: true}], 'Qd8#'],
        [[{abbr: 'WK', from: 'h1', to: 'g1', captured: 'BR', disambiguator: '', check: false, draw: true, mate: false}], 'Kxg1 (=)'],
    ];
    return Test.run(Score.notateMove, tests);
};

const score = [
    {abbr: 'WP', from: 'e2', to: 'e4', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'BP', from: 'e7', to: 'e5', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'WN', from: 'b1', to: 'c3', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'BP', from: 'f7', to: 'f6', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'WQ', from: 'd1', to: 'h5', captured: '', disambiguator: '', check: true, draw: false, mate: false},
    {abbr: 'BP', from: 'g7', to: 'g6', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'WQ', from: 'h5', to: 'g6', captured: 'BP', disambiguator: '', check: true, draw: false, mate: false},
    {abbr: 'BP', from: 'h7', to: 'g6', captured: 'WQ', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'WB', from: 'f1', to: 'b5', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'BP', from: 'a7', to: 'a6', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'WB', from: 'b5', to: 'c4', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'BP', from: 'b7', to: 'b5', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'WB', from: 'c4', to: 'd5', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'BP', from: 'c7', to: 'c6', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'WB', from: 'd5', to: 'e6', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'BP', from: 'd7', to: 'e6', captured: 'WB', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'WN', from: 'g1', to: 'f3', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'BN', from: 'g8', to: 'h6', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'WP', from: 'd2', to: 'd3', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'BQ', from: 'd8', to: 'd4', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'WB', from: 'c1', to: 'e3', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'BB', from: 'f8', to: 'b4', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'WK', from: 'e1', to: 'c1', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {abbr: 'BK', from: 'e8', to: 'g8', captured: '', disambiguator: '', check: false, draw: false, mate: false},
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
