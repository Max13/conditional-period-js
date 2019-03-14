const assert = require('chai').assert;
const { ConditionalPeriod, ConditionalType } = require('../src/index.js');
const moment = require('moment');

describe('ConditionalPeriod tests', function () {

    it('Fails instanciating a ConditionalPeriod with incorrect type', function () {
        let lower = 1,
            upper = 3,
            result = moment.duration('P1D'),
            exception = /^The first argument must be one of the ConditionalType constants \(ConditionalType\.CATEGORY or ConditionalType\.DURATION\)/;

        assert.throws(() => new ConditionalPeriod, /^ConditionalPeriod must be instanciated with 4 arguments/);
        assert.throws(() => new ConditionalPeriod(null, lower, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(-1, lower, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(0, lower, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(1, lower, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(2, lower, upper, result), exception);
        assert.throws(() => new ConditionalPeriod({}, lower, upper, result), exception);
        assert.throws(() => new ConditionalPeriod([], lower, upper, result), exception);
    });

    it('Fails instanciating a Category ConditionalPeriod with incorrect lower', function () {
        let type = ConditionalType.CATEGORY,
            upper = 3,
            result = moment.duration('P1D'),
            exception = /^The second argument must be a valid category \(Non null, positive integer\)/;

        assert.throws(() => new ConditionalPeriod(type, null, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(type, -1, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(type, 0, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(type, {}, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(type, [], upper, result), exception);
    });

    it('Fails instanciating a Duration ConditionalPeriod with incorrect lower', function () {
        let type = ConditionalType.DURATION,
            upper = moment.duration('P1D'),
            result = moment.duration('P1D'),
            exception = /^The second argument must be a valid moment.duration, or an iso8601 duration string/;

        assert.throws(() => new ConditionalPeriod(type, null, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(type, -1, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(type, 0, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(type, {}, upper, result), exception);
        assert.throws(() => new ConditionalPeriod(type, [], upper, result), exception);
    });

    it('Fails instanciating a Category ConditionalPeriod with incorrect upper', function () {
        let type = ConditionalType.CATEGORY,
            lower = 3,
            result = moment.duration('P1D'),
            exception = /^The third argument must be a valid category \(Non null, positive integer\)/;

        assert.throws(() => new ConditionalPeriod(type, lower, null, result), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, -1, result), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, 0, result), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, 1, result), /^The third argument must be greater than or equal to lower/);
        assert.throws(() => new ConditionalPeriod(type, lower, 2, result), /^The third argument must be greater than or equal to lower/);
        assert.throws(() => new ConditionalPeriod(type, lower, {}, result), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, [], result), exception);
    });

    it('Fails instanciating a Duration ConditionalPeriod with incorrect upper', function () {
        let type = ConditionalType.DURATION,
            lower = moment.duration('P3D'),
            result = moment.duration('P1D'),
            exception = /^The third argument must be a valid moment.duration, or an iso8601 duration string/;

        assert.throws(() => new ConditionalPeriod(type, lower, null, result), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, -1, result), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, 0, result), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, moment.duration('P1D'), result), /^The third argument must be greater than or equal to lower/);
        assert.throws(() => new ConditionalPeriod(type, lower, moment.duration('P2D'), result), /^The third argument must be greater than or equal to lower/);
        assert.throws(() => new ConditionalPeriod(type, lower, {}, result), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, [], result), exception);
    });

    it('Fails instanciating a Category ConditionalPeriod with incorrect result', function () {
        let type = ConditionalType.CATEGORY,
            lower = 1,
            upper = 2,
            exception = /^The fourth argument must be a valid moment.duration, or an iso8601 duration string/;

        assert.throws(() => new ConditionalPeriod(type, lower, upper, null), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, upper, -1), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, upper, 0), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, upper, 1), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, upper, 2), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, upper, {}), exception);
        assert.throws(() => new ConditionalPeriod(type, lower, upper, []), exception);
    });

    it('Can instanciate a Category ConditionalPeriod', function () {
        let c = new ConditionalPeriod(ConditionalType.CATEGORY, 1, 2, moment.duration('P1D'));

        assert.isTrue(c instanceof ConditionalPeriod);
        assert.strictEqual(c.type, ConditionalType.CATEGORY);
        assert.strictEqual(c.lower, 1);
        assert.strictEqual(c.upper, 2);
        assert.strictEqual(c.result.asSeconds(), moment.duration('P1D').asSeconds());
    });

    it('Can instanciate a Duration ConditionalPeriod with Duration', function () {
        let c = new ConditionalPeriod(
            ConditionalType.DURATION,
            moment.duration('P1D'),
            moment.duration('P2D'),
            moment.duration('P3D'),
        );

        assert.isTrue(c instanceof ConditionalPeriod);
        assert.strictEqual(c.type, ConditionalType.DURATION);
        assert.strictEqual(c.lower.asSeconds(), moment.duration('P1D').asSeconds());
        assert.strictEqual(c.upper.asSeconds(), moment.duration('P2D').asSeconds());
        assert.strictEqual(c.result.asSeconds(), moment.duration('P3D').asSeconds());
    });

    it('Can instanciate a Duration ConditionalPeriod with iso8601 string', function () {
        let c = new ConditionalPeriod(
            ConditionalType.DURATION,
            'P1D',
            'P2D',
            'P3D',
        );

        assert.isTrue(c instanceof ConditionalPeriod);
        assert.strictEqual(c.type, ConditionalType.DURATION);
        assert.strictEqual(c.lower.asSeconds(), moment.duration('P1D').asSeconds());
        assert.strictEqual(c.upper.asSeconds(), moment.duration('P2D').asSeconds());
        assert.strictEqual(c.result.asSeconds(), moment.duration('P3D').asSeconds());
    });

    it('Fails modifying instanciated ConditionalPeriod', function () {
        let type = ConditionalPeriod.DURATION,
            lower = 2,
            upper = 4,
            result = moment.duration('P6D'),
            cp = new ConditionalPeriod(ConditionalType.CATEGORY, 1, 2, moment.duration('P3D'));

        cp.type = type;
        cp.lower = lower;
        cp.upper = upper;
        cp.result = result;

        assert.notStrictEqual(cp.type, type);
        assert.notStrictEqual(cp.lower, lower);
        assert.notStrictEqual(cp.upper, upper);
        assert.isFalse(cp.result.asSeconds() === result.asSeconds());
    });

    it('Fails parseToArray with malformed invalid values', function () {
        let exception = /^Argument passed to parseToArray\(\) must be a string/;

        assert.throws(() => ConditionalPeriod.parseToArray(null), exception);
        assert.throws(() => ConditionalPeriod.parseToArray(-1), exception);
        assert.throws(() => ConditionalPeriod.parseToArray(0), exception);
        assert.throws(() => ConditionalPeriod.parseToArray(1), exception);
        assert.throws(() => ConditionalPeriod.parseToArray(2), exception);
        assert.throws(() => ConditionalPeriod.parseToArray({}), exception);
        assert.throws(() => ConditionalPeriod.parseToArray([]), exception);

        assert.throws(() => ConditionalPeriod.parseToArray('ABCDE'), /^Invalid string format: Can't find argument 1/);
        assert.throws(() => ConditionalPeriod.parseToArray('AB-DE'), /^Invalid string format: Can't find argument 2/);
        assert.throws(() => ConditionalPeriod.parseToArray('ABPDE'), /^Invalid string format: Can't find argument 2/);
    });

    it('Correctly parseToArray', function () {
        assert.deepEqual(ConditionalPeriod.parseToArray('C2-4P6D'), ['C', 2, 4, 'P6D']);
        assert.deepEqual(ConditionalPeriod.parseToArray('DP2DP4DP6D'), ['D', 'P2D', 'P4D', 'P6D']);
    });

    it('Correctly parse string form', function () {
        let c1 = ConditionalPeriod.parse('C2-4P6D'),
            c2 = ConditionalPeriod.parse('DP2DP4DP6D');

        assert.isTrue(c1 instanceof ConditionalPeriod);
        assert.strictEqual(c1.type, ConditionalType.CATEGORY);
        assert.strictEqual(c1.lower, 2);
        assert.strictEqual(c1.upper, 4);
        assert.strictEqual(c1.result.asSeconds(), moment.duration('P6D').asSeconds());

        assert.isTrue(c2 instanceof ConditionalPeriod);
        assert.strictEqual(c2.type, ConditionalType.DURATION);
        assert.strictEqual(c2.lower.asSeconds(), moment.duration('P2D').asSeconds());
        assert.strictEqual(c2.upper.asSeconds(), moment.duration('P4D').asSeconds());
        assert.strictEqual(c2.result.asSeconds(), moment.duration('P6D').asSeconds());
    });

    it('Fails match out of Category ConditionalPeriod boundaries', function () {
        let cp = new ConditionalPeriod(ConditionalType.CATEGORY, 3, 6, moment.duration('P1D'));

        assert.isFalse(cp.match(1));
        assert.isFalse(cp.match(2));
        assert.isFalse(cp.match(7));
        assert.isFalse(cp.match(8));
    });

    it('Matches in Category ConditionalPeriod boundaries', function () {
        let cp = new ConditionalPeriod(ConditionalType.CATEGORY, 3, 6, moment.duration('P1D'));

        assert.isTrue(cp.match(3));
        assert.isTrue(cp.match(4));
        assert.isTrue(cp.match(5));
        assert.isTrue(cp.match(6));
    });

    it('Fails match out of Duration ConditionalPeriod boundaries with Duration', function () {
        let cp = new ConditionalPeriod(ConditionalType.DURATION, moment.duration('P3D'), moment.duration('P6D'), moment.duration('P15D'));

        assert.isFalse(cp.match(moment.duration('P1D')));
        assert.isFalse(cp.match(moment.duration('P2D')));
        assert.isFalse(cp.match(moment.duration('P7D')));
        assert.isFalse(cp.match(moment.duration('P8D')));
    });

    it('Matches in Duration ConditionalPeriod boundaries with Duration', function () {
        let cp = new ConditionalPeriod(ConditionalType.DURATION, moment.duration('P3D'), moment.duration('P6D'), moment.duration('P15D'));

        assert.isTrue(cp.match(moment.duration('P3D')));
        assert.isTrue(cp.match(moment.duration('P4D')));
        assert.isTrue(cp.match(moment.duration('P5D')));
        assert.isTrue(cp.match(moment.duration('P6D')));
    });

    it('Fails match out of Duration ConditionalPeriod boundaries with iso8601', function () {
        let cp = new ConditionalPeriod(ConditionalType.DURATION, moment.duration('P3D'), moment.duration('P6D'), moment.duration('P15D'));

        assert.isFalse(cp.match('P1D'));
        assert.isFalse(cp.match('P2D'));
        assert.isFalse(cp.match('P7D'));
        assert.isFalse(cp.match('P8D'));
    });

    it('Matches in Duration ConditionalPeriod boundaries with iso8601', function () {
        let cp = new ConditionalPeriod(ConditionalType.DURATION, moment.duration('P3D'), moment.duration('P6D'), moment.duration('P15D'));

        assert.isTrue(cp.match('P3D'));
        assert.isTrue(cp.match('P4D'));
        assert.isTrue(cp.match('P5D'));
        assert.isTrue(cp.match('P6D'));
    });

    it('Correctly toString() for Category ConditionalPeriod', function () {
        let cpString = 'C1-2P1Y',
            cp = new ConditionalPeriod(ConditionalType.CATEGORY, 1, 2, moment.duration('P1Y'));

        assert.strictEqual(cpString, cp.toString());
        assert.strictEqual(cpString, String(cp));
    });

    it('Correctly toString() for Duration ConditionalPeriod', function () {
        let cpString = 'DP1YP1Y2M3DP1Y2M3DT1H2M3S',
            cp = new ConditionalPeriod(ConditionalType.DURATION, moment.duration('P1Y'), moment.duration('P1Y2M3D'), moment.duration('P1Y2M3DT1H2M3S'));

        assert.strictEqual(cpString, cp.toString());
        assert.strictEqual(cpString, String(cp));
    });

});
