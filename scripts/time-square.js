// Optimal implementation of fileToNumber(): >4x faster than calling charCodeAt()
function f2nSwitch(file) {
    switch (file) {
    case 'a': return 1;
    case 'b': return 2;
    case 'c': return 3;
    case 'd': return 4;
    case 'e': return 5;
    case 'f': return 6;
    case 'g': return 7;
    case 'h': return 8;
    default: return 0;
    }
}

// Suboptimal implementation of fileToNumber(): >4x slower than using switch
function f2nCode(file) {
    const code = file.charCodeAt(0);
    if (code < 97 || code > 104) {
        return 0;
    }
    return code - 96;
}

// Suboptimal implementation of fileToNumber(): ~5x slower than using switch
const files = {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8};
function f2nObject(file) {
    return files[file] ?? 0;
}

// Pessimal implementation of fileToNumber(): >5x slower than using switch
const filesMap = new Map([['a', 1], ['b', 2], ['c', 3], ['d', 4], ['e', 5], ['f', 6], ['g', 7], ['h', 8]]);
function f2nMap(file) {
    return filesMap.get(file) ?? '';
}

// Suboptimal implementation of numberToFile(): 6-10% slower than calling
// String.fromCharCode()
function n2fSwitch(fileNumber) {
    switch (fileNumber) {
    case 1: return 'a';
    case 2: return 'b';
    case 3: return 'c';
    case 4: return 'd';
    case 5: return 'e';
    case 6: return 'f';
    case 7: return 'g';
    case 8: return 'h';
    default: return '';
    }
}

// Optimal implementation of numberToFile(): 6-10% faster than using switch
function n2fCode(fileNumber) {
    if (fileNumber < 1 || fileNumber > 8) {
        return '';
    }
    return String.fromCharCode(fileNumber + 96);
}

// Suboptimal implementation of numberToFile(): 6-10% slower than calling
// String.fromCharCode()
const fileNumbers = {1: 'a', 2: 'b', 3: 'c', 4: 'd', 5: 'e', 6: 'f', 7: 'g', 8: 'h'};
function n2fObject(fileNumber) {
    return fileNumbers[fileNumber] ?? '';
}

// Pessimal implementation of numberToFile(): ~70% slower than calling
// String.fromCharCode()
const fileNumbersMap = new Map([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e'], [6, 'f'], [7, 'g'], [8, 'h']]);
function n2fMap(fileNumber) {
    return fileNumbersMap.get(fileNumber) ?? '';
}

// Optimal implementation of parse(): almost 2x faster than using array destructuring
function parseIndex(square) {
    const file = square[0];
    const rank = parseInt(square[1]);
    return [file, rank];
}

// Suboptimal implementation of parse(): almost 2x slower than using square bracket notation
function parseDestructure(square) {
    const [file, rank] = square;
    return [file, parseInt(rank)];
}

const functions = {
    file: [
        f2nSwitch,
        f2nCode,
        f2nObject,
        f2nMap,
    ],
    number: [
        n2fSwitch,
        n2fCode,
        n2fObject,
        n2fMap,
    ],
    parse: [
        parseIndex,
        parseDestructure,
    ],
};

const inputs = {
    file: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', ''],
    number: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    parse: [
        'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
        'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8',
        'c1', 'c2', 'a3', 'c4', 'c5', 'c6', 'c7', 'c8',
        'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8',
        'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8',
        'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8',
        'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8',
    ],
};

const max = 1e7;
for (const type in functions) {
    const input = inputs[type];
    for (const f of functions[type]) {
        console.time(f.name);
        for (let n = 0; n < max; n++) {
            for (const i of input) {
                f(i);
            }
        }
        console.timeEnd(f.name);
    }
}
