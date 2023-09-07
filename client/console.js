// This is for verbose log messages, that I don't want to show in the terminal
// or some browsers.
export default class Console {
    static groupCollapsed(label) {
        if (typeof window === 'undefined') {
            return;
        }
        if (/Chrom/.test(navigator.userAgent) === false) {
            return;
        }
        console.groupCollapsed(label);
    }

    static groupEnd(label) {
        if (typeof window === 'undefined') {
            return;
        }
        if (/Chrom/.test(navigator.userAgent) === false) {
            return;
        }
        console.groupEnd(label);
    }

    static log(...args) {
        if (typeof window === 'undefined') {
            return;
        }
        if (/Chrom/.test(navigator.userAgent) === false) {
            return;
        }
        console.log(...args);
    }
}
