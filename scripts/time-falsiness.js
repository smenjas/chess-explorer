// Optimal concatenation: 3-5x faster than testing loose equality
function testFalsity(x) {
    return x === false;
}

// Subptimal concatenation: 3-5x slower than testing strict equality
function testFalsiness(x) {
    return !x;
}

const functions = [
    testFalsity,
    testFalsiness,
];

const inputs = [
    //undefined, null,
    false, true,
    0, 1,
    0.0, 0.1,
    '', 'x',
    [], [1],
    {}, {a: 1},
];

const max = 1e7;
for (const f of functions) {
    console.time(f.name);
    for (let n = 0; n < max; n++) {
        for (const i of inputs) {
            f(i);
        }
    }
    console.timeEnd(f.name);
}
