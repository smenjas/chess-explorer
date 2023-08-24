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
        [[{from: 'e1', to: 'd1', moved: 'WK', captured: '', disambiguator: '', check: false, draw: false, mate: false}], 'Kd1'],
        [[{from: 'e1', to: 'c1', moved: 'WK', captured: '', disambiguator: '', check: false, draw: false, mate: false}], '0-0-0'],
        [[{from: 'e1', to: 'g1', moved: 'WK', captured: '', disambiguator: '', check: false, draw: false, mate: false}], '0-0'],
        [[{from: 'e8', to: 'c8', moved: 'BK', captured: '', disambiguator: '', check: false, draw: false, mate: false}], '0-0-0'],
        [[{from: 'e8', to: 'g8', moved: 'BK', captured: '', disambiguator: '', check: false, draw: false, mate: false}], '0-0'],
        [[{from: 'e8', to: 'e7', moved: 'BK', captured: '', disambiguator: '', check: false, draw: false, mate: false}], 'Ke7'],
        [[{from: 'h7', to: 'g6', moved: 'BP', captured: 'WP', disambiguator: '', check: false, draw: false, mate: false}], 'hxg6'],
        [[{from: 'g1', to: 'f3', moved: 'WN', captured: '', disambiguator: '', check: false, draw: false, mate: false}], 'Nf3'],
        [[{from: 'f8', to: 'b4', moved: 'BB', captured: '', disambiguator: '', check: false, draw: false, mate: false}], 'Bb4'],
        [[{from: 'b8', to: 'd7', moved: 'BN', captured: '', disambiguator: 'b', check: false, draw: false, mate: false}], 'Nbd7'],
        [[{from: 'b5', to: 'd7', moved: 'WQ', captured: 'BN', disambiguator: '', check: true, draw: false, mate: false}], 'Qxd7+'],
        [[{from: 'd7', to: 'd8', moved: 'WQ', captured: '', disambiguator: '', check: true, draw: false, mate: true}], 'Qd8#'],
        [[{from: 'h1', to: 'g1', moved: 'WK', captured: 'BR', disambiguator: '', check: false, draw: true, mate: false}], 'Kxg1 (=)'],
    ];
    return Test.run(Score.notateMove, tests);
};

const score = [
    {from: 'e2', to: 'e4', moved: 'WP', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'e7', to: 'e5', moved: 'BP', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'b1', to: 'c3', moved: 'WN', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'f7', to: 'f6', moved: 'BP', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'd1', to: 'h5', moved: 'WQ', captured: '', disambiguator: '', check: true, draw: false, mate: false},
    {from: 'g7', to: 'g6', moved: 'BP', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'h5', to: 'g6', moved: 'WQ', captured: 'BP', disambiguator: '', check: true, draw: false, mate: false},
    {from: 'h7', to: 'g6', moved: 'BP', captured: 'WQ', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'f1', to: 'b5', moved: 'WB', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'a7', to: 'a6', moved: 'BP', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'b5', to: 'c4', moved: 'WB', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'b7', to: 'b5', moved: 'BP', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'c4', to: 'd5', moved: 'WB', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'c7', to: 'c6', moved: 'BP', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'd5', to: 'e6', moved: 'WB', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'd7', to: 'e6', moved: 'BP', captured: 'WB', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'g1', to: 'f3', moved: 'WN', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'g8', to: 'h6', moved: 'BN', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'd2', to: 'd3', moved: 'WP', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'd8', to: 'd4', moved: 'BQ', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'c1', to: 'e3', moved: 'WB', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'f8', to: 'b4', moved: 'BB', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'e1', to: 'c1', moved: 'WK', captured: '', disambiguator: '', check: false, draw: false, mate: false},
    {from: 'e8', to: 'g8', moved: 'BK', captured: '', disambiguator: '', check: false, draw: false, mate: false},
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
