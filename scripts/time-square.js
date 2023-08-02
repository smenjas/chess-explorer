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

// Optimal implementation of parse(): ~30% faster than using array destructuring
function parseIndex(square) {
    const file = square[0];
    const rank = parseInt(square[1]);
    return [file, rank];
}

// Suboptimal implementation of parse(): ~30% slower than using square bracket notation
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
    parse: ['bb', 'bk', 'bn', 'bp', 'bq', 'br', 'wb', 'wk', 'wn', 'wp', 'wq', 'wr', ''],
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
