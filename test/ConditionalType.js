const assert = require('assert');
const { ConditionalType } = require('../src/index.js');

describe('ConditionalType tests', function () {

    it('Fails instanciating a ConditionalType', function () {
        assert.throws(() => new ConditionalType, TypeError);
        assert.throws(() => new ConditionalType(1), TypeError);
        assert.throws(() => ConditionalType(), TypeError);
        assert.throws(() => ConditionalType(1), TypeError);
    });

    it('Test ConditionalType constants', function () {
        assert.strictEqual(ConditionalType.CATEGORY, 'C');
        assert.strictEqual(ConditionalType.DURATION, 'D');
        assert.strictEqual(ConditionalType.FOOBAR, undefined);
    });

    it('Fails touching properties to ConditionalType', function () {
        ConditionalType.CATEGORY = 'X';
        ConditionalType.DURATION = 'Y';
        ConditionalType.FOOBAR = 'F';

        assert.notStrictEqual(ConditionalType.CATEGORY, 'X');
        assert.notStrictEqual(ConditionalType.DURATION, 'Y');
        assert.notStrictEqual(ConditionalType.FOOBAR, 'F');
    });


});
