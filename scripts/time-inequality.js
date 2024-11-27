// Optimal comparison: >3x faster than using strict inequalities
function testEquality(n) {
    return n === 1 || n === 8;
}

// Suboptimal comparison: >3x slower than using strict equality, but slightly
// slower than strict inequality
function testInequality(n) {
    return n <= 1 || n >= 8;
}

// Suboptimal comparison: >3x slower than using strict equality, but slightly
// faster than non-strict inequality
function testStrictInequality(n) {
    return n < 2 || n > 7;
}

const functions = [
    testEquality,
    testInequality,
    testStrictInequality,
];

const inputs = [1, 2, 3, 4, 5, 6, 7, 8];

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
