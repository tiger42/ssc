window.SSC = window.SSC || {};

SSC.Test = (() => {
    'use strict';

    let failed = 0;
    let passed = 0;

    const ok = () => {
        passed++;
        document.write(' <b style="color: green;">OK</b>');

        return true;
    };

    const fail = () => {
        failed++;
        document.write(' <b style="color: red;">FAILED</b>');

        return false;
    };

    return {
        assert : (expr, desc) => {
            if (typeof expr != 'boolean') {
                throw new TypeError('Parameter "expr" must be Boolean');
            }
            if (desc) {
                document.write(desc + ' ');
            }
            return expr && ok() || fail();
        },

        assertSame : (expected, actual, desc) => {
            return SSC.Test.assert(expected === actual, desc);
        },

        writeTestResult : () => {
            document.write('<br /><hr />');
            if (failed) {
                document.write(`<b>${failed}</b> of <b>${failed + passed}</b> test${(failed + passed) > 1 ? 's ' : ' '}`);
                document.write(`<b style="color: red;">FAILED</b>`);
                alert('Errors found!');
            } else {
                document.write(`All <b>${passed}</b> tests <b style="color: green;">PASSED</b>`);
            }
        }
    };
})();
