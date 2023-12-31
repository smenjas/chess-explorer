export default class Test {
    static compare(a, b) {
        if (a === b) {
            return true;
        }
        if (Number.isNaN(a) && Number.isNaN(b)) {
            return true;
        }
        if (typeof a !== typeof b) {
            return false;
        }
        if (Array.isArray(a)) {
            return Test.compareArrays(a, b);
        }
        if (Test.isObject(a)) {
            return Test.compareObjects(a, b);
        }
        return false;
    }

    static compareArrays(a, b) {
        if (!Array.isArray(a)) {
            return false;
        }
        if (!Array.isArray(b)) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }
        for (const key in a) {
            if (!Test.compare(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }

    static compareObjects(a, b) {
        if (!Test.isObject(a)) {
            return false;
        }
        if (!Test.isObject(b)) {
            return false;
        }
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }
        for (const key in a) {
            if (!(key in b)) {
                return false;
            }
            if (!Test.compare(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }

    static isObject(obj) {
        // Handle undefined, booleans, numbers, NaN, bigints, strings, and symbols.
        if (typeof obj !== 'object') {
            return false;
        }
        // Handle null.
        if (!(obj instanceof Object)) {
            return false;
        }
        if (Array.isArray(obj)) {
            return false;
        }
        if (obj instanceof Map) {
            return false;
        }
        if (obj instanceof Set) {
            return false;
        }
        if (obj instanceof WeakMap) {
            return false;
        }
        if (obj instanceof WeakSet) {
            return false;
        }
        return true;
    }

    static run(method, tests) {
        let failures = [];
        for (const test of tests) {
            const failure = Test.runTest(method, test);
            if (failure !== '') {
                failures.push(failure);
            }
        }
        return failures;
    }

    static runTest(method, test) {
        const [args, expected] = test;
        const actual = method(...args);
        const result = Test.compare(expected, actual);
        if (result === true) {
            return '';
        }
        return Test.showSignature(method, args, expected, actual);
    }

    static showArray(array) {
        const maxLength = 5;
        const values = [];
        if (array.length > maxLength) {
            return `Array(${array.length})`;
        }
        for (const value of array) {
            values.push(Test.showValue(value));
        }
        return '[' + values.join(', ') + ']';
    }

    static showDifference(expected, actual) {
        if (Array.isArray(expected) && Array.isArray(actual)) {
            for (const key in expected) {
                if (!Test.compare(expected[key], actual[key])) {
                    return `${Test.showValue(expected[key])} !== ${Test.showValue(actual[key])}`;
                }
            }
        }
        return `${Test.showValue(expected)} !== ${Test.showValue(actual)}`;
    }

    static showEscapeSequence(code) {
        if (code > 65535) {
            console.warn('Invalid UTF-16 code point:', code);
            return '';
        }
        return '\\u' + code.toString().padStart(4, '0');
    }

    static showSignature(method, args, expected, actual) {
        const argStrings = [];
        for (const arg of args) {
            argStrings.push(Test.showValue(arg));
        }
        return `${method.name}(${argStrings.join(', ')}): ${Test.showDifference(expected, actual)}`;
    }

    static showString(value) {
        let string = '';
        for (const index in value) {
            const code = value.codePointAt(index);
            // See: https://en.wikipedia.org/wiki/Unicode_control_characters
            if (code < 32 || (code > 126 && code < 160)) {
                string += Test.showEscapeSequence(code);
                continue;
            }
            string += value[index];
        }
        return `'${string}'`;
    }

    static showValue(value) {
        if (typeof value === 'string') {
            return Test.showString(value);
        }
        switch (value) {
        case undefined:
            return 'undefined';
        case null:
            return 'null';
        }
        if (Number.isNaN(value)) {
            return 'NaN';
        }
        if (Array.isArray(value)) {
            return Test.showArray(value);
        }
        return value.toString();
    }
}
