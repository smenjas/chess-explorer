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

    static runTest(method, test) {
        const [args, expected] = test;
        const actual = method(...args);
        const result = Test.compare(expected, actual);
        if (result === true) {
            return '';
        }
        let failure = `${method.name}(`;
        for (const arg of args) {
            failure += Test.showValue(arg) + ', ';
        }
        failure = failure.substring(0, failure.length - 2);
        failure += `): ${Test.showValue(actual)} !== ${Test.showValue(expected)}`;
        return failure;
    }

    static showArray(array) {
        const values = [];
        for (const value of array) {
            values.push(Test.showValue(value));
        }
        return '[' + values.join(', ') + ']';
    }

    static showValue(value) {
        if (typeof value === 'string') {
            return `'${value}'`;
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
