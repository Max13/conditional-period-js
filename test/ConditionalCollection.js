const assert = require('chai').assert;
const { ConditionalCollection, ConditionalPeriod, ConditionalType } = require('../src/index.js');
const { Duration } = require('luxon');

describe('ConditionalCollection tests', function () {

    it('Can instanciate a ConditionalCollection', function () {
        let c = new ConditionalCollection;

        assert.instanceOf(c, ConditionalCollection);
    });

    it('Fails creating a ConditionalCollection with incorrect values', function () {
        let exception = /^Only ConditionalPeriod \(as object or string form\) can be stored/;

        assert.throws(() => ConditionalCollection.create(null), exception);
        assert.throws(() => ConditionalCollection.create(-1), exception);
        assert.throws(() => ConditionalCollection.create(0), exception);
        assert.throws(() => ConditionalCollection.create(1), exception);
        assert.throws(() => ConditionalCollection.create(2), exception);
        assert.throws(() => ConditionalCollection.create({}), exception);
        assert.throws(() => ConditionalCollection.create([]), exception);
        assert.throws(() => ConditionalCollection.create(Duration.fromISO('P1D')), exception);
        assert.throws(() => ConditionalCollection.create(new ConditionalCollection), exception);
    });

    it('Creating a ConditionalCollection with a Category ConditionalPeriod', function () {
        let cp = new ConditionalPeriod(ConditionalType.CATEGORY, 1, 2, Duration.fromISO('P1D'), true);

        assert.strictEqual(cp.toString(), ConditionalCollection.create(cp.toString()).container[0].toString());
        assert.strictEqual(cp.toString(), ConditionalCollection.create(cp).container[0].toString());
    });

    it('Creating a ConditionalCollection with a Duration ConditionalPeriod', function () {
        let cp = new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P1D'), Duration.fromISO('P2D'), Duration.fromISO('P3D'), true);

        assert.strictEqual(cp.toString(), ConditionalCollection.create(cp.toString()).container[0].toString());
        assert.strictEqual(cp.toString(), ConditionalCollection.create(cp).container[0].toString());
    });

    it('Fails parsing a ConditionalCollection with incorrect values', function () {
        let exception = /^First argument of parse\(\) must be a string/;

        assert.throws(() => ConditionalCollection.parse(null), exception);
        assert.throws(() => ConditionalCollection.parse(-1), exception);
        assert.throws(() => ConditionalCollection.parse(0), exception);
        assert.throws(() => ConditionalCollection.parse(1), exception);
        assert.throws(() => ConditionalCollection.parse(2), exception);
        assert.throws(() => ConditionalCollection.parse({}), exception);
        assert.throws(() => ConditionalCollection.parse([]), exception);
        assert.throws(() => ConditionalCollection.parse(Duration.fromISO('P1D')), exception);
        assert.throws(() => ConditionalCollection.parse(new ConditionalCollection), exception);
        assert.throws(() => ConditionalCollection.parse('ABCDE'), /^Invalid string format/);
    });

    it('Parsing a ConditionalCollection with a Category ConditionalPeriod', function () {
        let c = new ConditionalCollection;

        c.container.push(new ConditionalPeriod(ConditionalType.CATEGORY, 1, 2, Duration.fromISO('P1D'), true));
        c.container.push(new ConditionalPeriod(ConditionalType.CATEGORY, 3, 4, Duration.fromISO('P2D'), true));

        assert.strictEqual(c.toString(), ConditionalCollection.parse('C1-2P1D,C3-4P2D').toString());
    });

    it('Creating a ConditionalCollection with a Duration ConditionalPeriod', function () {
        let c = new ConditionalCollection;

        c.container.push(new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P1D'), Duration.fromISO('P2D'), Duration.fromISO('P1D'), true));
        c.container.push(new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P3D'), Duration.fromISO('P4D'), Duration.fromISO('P2D'), true));

        assert.strictEqual(c.toString(), ConditionalCollection.parse('DP1DP2DP1D,DP3DP4DP2D').toString());
    });

    it('Fails instanciating a ConditionalCollection.fromArray() with incorrect values', function () {
        let exception = /^First argument of fromArray\(\) must be an array/;

        assert.throws(() => ConditionalCollection.fromArray(null), exception);
        assert.throws(() => ConditionalCollection.fromArray(-1), exception);
        assert.throws(() => ConditionalCollection.fromArray(0), exception);
        assert.throws(() => ConditionalCollection.fromArray(1), exception);
        assert.throws(() => ConditionalCollection.fromArray(2), exception);
        assert.throws(() => ConditionalCollection.fromArray({}), exception);
        assert.throws(() => ConditionalCollection.fromArray(Duration.fromISO('P1D')), exception);
        assert.throws(() => ConditionalCollection.fromArray(new ConditionalCollection), exception);
        assert.throws(() => ConditionalCollection.fromArray('ABCDE'), exception);
    });

    it('Instanciate a ConditionalCollection from array (Category)', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.CATEGORY, 1, 2, Duration.fromISO('P1D')),
                new ConditionalPeriod(ConditionalType.CATEGORY, 3, 4, Duration.fromISO('P2D')),
            ],
            c = ConditionalCollection.fromArray(arr);

        assert.instanceOf(c, ConditionalCollection);
        assert.deepEqual(arr, c.container);
    });

    it('Instanciate a ConditionalCollection from array (Duration)', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P1D'), Duration.fromISO('P2D'), Duration.fromISO('P1D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P3D'), Duration.fromISO('P4D'), Duration.fromISO('P2D')),
            ],
            c = ConditionalCollection.fromArray(arr);

        assert.instanceOf(c, ConditionalCollection);
        assert.deepEqual(arr, c.container);
    });

    it('Fails instanciating a ConditionalCollection.fromJSON() with incorrect values', function () {
        let exception = /^First argument of fromJSON\(\) must be a string/;

        assert.throws(() => ConditionalCollection.fromJSON(null), exception);
        assert.throws(() => ConditionalCollection.fromJSON(-1), exception);
        assert.throws(() => ConditionalCollection.fromJSON(0), exception);
        assert.throws(() => ConditionalCollection.fromJSON(1), exception);
        assert.throws(() => ConditionalCollection.fromJSON(2), exception);
        assert.throws(() => ConditionalCollection.fromJSON({}), exception);
        assert.throws(() => ConditionalCollection.fromJSON(Duration.fromISO('P1D')), exception);
        assert.throws(() => ConditionalCollection.fromJSON(new ConditionalCollection), exception);
    });

    it('Instanciate a ConditionalCollection from json (Category)', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.CATEGORY, 1, 2, Duration.fromISO('P1D'), true),
                new ConditionalPeriod(ConditionalType.CATEGORY, 3, 4, Duration.fromISO('P2D'), true),
            ],
            c = ConditionalCollection.fromJSON('["C1-2P1D","C3-4P2D"]');

        assert.instanceOf(c, ConditionalCollection);
        assert.strictEqual(ConditionalCollection.fromArray(arr).toString(), c.toString());
    });

    it('Instanciate a ConditionalCollection from json (Duration)', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P1D'), Duration.fromISO('P2D'), Duration.fromISO('P1D'), true),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P3D'), Duration.fromISO('P4D'), Duration.fromISO('P2D'), true),
            ],
            c = ConditionalCollection.fromJSON('["DP1DP2DP1D","DP3DP4DP2D"]');

        assert.instanceOf(c, ConditionalCollection);
        assert.strictEqual(ConditionalCollection.fromArray(arr).toString(), c.toString());
    });

    it('Fails pushing in a ConditionalCollection with incorrect values', function () {
        let c = new ConditionalCollection,
            exception = /^Only ConditionalPeriod \(as object or string form\) can be stored/;

        assert.throws(() => c.push(null), exception);
        assert.throws(() => c.push(-1), exception);
        assert.throws(() => c.push(0), exception);
        assert.throws(() => c.push(1), exception);
        assert.throws(() => c.push(2), exception);
        assert.throws(() => c.push({}), exception);
        assert.throws(() => c.push([]), exception);
        assert.throws(() => c.push(Duration.fromISO('P1D')), exception);
        assert.throws(() => c.push(new ConditionalCollection), exception);
        assert.throws(() => c.push('ABCDE'), /^Invalid string format/);
    });

    it('Pushing in a ConditionalCollection with a Category ConditionalPeriod', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.CATEGORY, 1, 2, Duration.fromISO('P1D')),
                new ConditionalPeriod(ConditionalType.CATEGORY, 3, 4, Duration.fromISO('P2D')),
            ],
            c = new ConditionalCollection;

        assert.instanceOf(c.push(arr[1]), ConditionalCollection);
        assert.strictEqual(c.container.length, 1);
        assert.instanceOf(c.push(arr[0], 0), ConditionalCollection);
        assert.strictEqual(c.container.length, 2);
        assert.strictEqual(c.toString(), ConditionalCollection.fromArray(arr).toString());
    });

    it('Pushing in a ConditionalCollection with a Duration ConditionalPeriod', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P1D'), Duration.fromISO('P2D'), Duration.fromISO('P1D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P3D'), Duration.fromISO('P4D'), Duration.fromISO('P2D')),
            ],
            c = new ConditionalCollection;

        assert.instanceOf(c.push(arr[1]), ConditionalCollection);
        assert.strictEqual(c.container.length, 1);
        assert.instanceOf(c.push(arr[0], 0), ConditionalCollection);
        assert.strictEqual(c.container.length, 2);
        assert.strictEqual(c.toString(), ConditionalCollection.fromArray(arr).toString());
    });

    it('Fails finding incorrect values in a ConditionalCollection', function () {
        let c = new ConditionalCollection,
            exception = /^Only Duration \(as object or string form\) or integers can be found/;

        assert.throws(() => c.find(null), exception);
        assert.throws(() => c.find({}), exception);
        assert.throws(() => c.find([]), exception);
        assert.throws(() => c.find(new ConditionalCollection), exception);
    });

    it('Fails finding out of Category ConditionalCollection boundaries', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.CATEGORY, 3, 5, Duration.fromISO('P1D')),
                new ConditionalPeriod(ConditionalType.CATEGORY, 6, 8, Duration.fromISO('P2D')),
            ],
            c = ConditionalCollection.fromArray(arr);

        assert.isNull(c.find(1));
        assert.isNull(c.find(2));
        assert.isNull(c.find(9));
        assert.isNull(c.find(10));
    });

    it('Finds in Category ConditionalCollection boundaries', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.CATEGORY, 3, 5, Duration.fromISO('P1D')),
                new ConditionalPeriod(ConditionalType.CATEGORY, 6, 8, Duration.fromISO('P2D')),
            ],
            c = ConditionalCollection.fromArray(arr);

        assert.strictEqual(c.find(3), arr[0]);
        assert.strictEqual(c.find(4), arr[0]);
        assert.strictEqual(c.find(5), arr[0]);
        assert.strictEqual(c.find(6), arr[1]);
        assert.strictEqual(c.find(7), arr[1]);
        assert.strictEqual(c.find(8), arr[1]);
    });

    it('Fails finding out of Duration ConditionalCollection boundaries with Duration', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P3D'), Duration.fromISO('P5D'), Duration.fromISO('P1D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P6D'), Duration.fromISO('P8D'), Duration.fromISO('P2D')),
            ],
            c = ConditionalCollection.fromArray(arr);

        assert.isNull(c.find(Duration.fromISO('P1D')));
        assert.isNull(c.find(Duration.fromISO('P2D')));
        assert.isNull(c.find(Duration.fromISO('P9D')));
        assert.isNull(c.find(Duration.fromISO('P10D')));
    });

    it('Finds in Duration ConditionalCollection boundaries with Duration', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P3D'), Duration.fromISO('P5D'), Duration.fromISO('P1D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P6D'), Duration.fromISO('P8D'), Duration.fromISO('P2D')),
            ],
            c = ConditionalCollection.fromArray(arr);

        assert.strictEqual(c.find(Duration.fromISO('P3D')), arr[0]);
        assert.strictEqual(c.find(Duration.fromISO('P4D')), arr[0]);
        assert.strictEqual(c.find(Duration.fromISO('P5D')), arr[0]);
        assert.strictEqual(c.find(Duration.fromISO('P6D')), arr[1]);
        assert.strictEqual(c.find(Duration.fromISO('P7D')), arr[1]);
        assert.strictEqual(c.find(Duration.fromISO('P8D')), arr[1]);
    });

    it('Fails finding out of Duration ConditionalCollection boundaries with iso8601', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P3D'), Duration.fromISO('P5D'), Duration.fromISO('P1D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P6D'), Duration.fromISO('P8D'), Duration.fromISO('P2D')),
            ],
            c = ConditionalCollection.fromArray(arr);

        assert.isNull(c.find('P1D'));
        assert.isNull(c.find('P2D'));
        assert.isNull(c.find('P9D'));
        assert.isNull(c.find('P10D'));
    });

    it('Finds in Duration ConditionalCollection boundaries with iso8601', function () {
        let arr = [
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P3D'), Duration.fromISO('P5D'), Duration.fromISO('P1D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P6D'), Duration.fromISO('P8D'), Duration.fromISO('P2D')),
            ],
            c = ConditionalCollection.fromArray(arr);

        assert.strictEqual(c.find('P3D'), arr[0]);
        assert.strictEqual(c.find('P4D'), arr[0]);
        assert.strictEqual(c.find('P5D'), arr[0]);
        assert.strictEqual(c.find('P6D'), arr[1]);
        assert.strictEqual(c.find('P7D'), arr[1]);
        assert.strictEqual(c.find('P8D'), arr[1]);
    });

    it('Fails checking equality with invalid types', function () {
        let cp = ConditionalCollection.parse('C1-2P1Y'),
            exception = /^Equality can only be checked with ConditionalCollection/;

        assert.throws(() => cp.equals(null), exception);
        assert.throws(() => cp.equals(-1), exception);
        assert.throws(() => cp.equals(0), exception);
        assert.throws(() => cp.equals(1), exception);
        assert.throws(() => cp.equals(2), exception);
        assert.throws(() => cp.equals({}), exception);
        assert.throws(() => cp.equals([]), exception);
    });

    it('Check Category Conditional Period equality not being equal', function () {
        let c1 = ConditionalCollection.parse('C1-2P1Y'),
            c2 = ConditionalCollection.parse('C3-4P1Y');

        assert.isFalse(c1.equals(c2));
    });

    it('Check Category Conditional Period equality being equal', function () {
        let c1 = ConditionalCollection.parse('C1-2P1Y'),
            c2 = ConditionalCollection.parse('C1-2P1Y');

        assert.isTrue(c1.equals(c2));
    });

    it('Check Duration Conditional Period equality not being equal', function () {
        let c1 = ConditionalCollection.parse('DP1MP2MP1Y,DP2MP3MP2Y'),
            c2 = ConditionalCollection.parse('DP3MP4MP1Y,DP2MP3MP2Y');

        assert.isFalse(c1.equals(c2));
    });

    it('Check Duration Conditional Period equality being equal', function () {
        let c1 = ConditionalCollection.parse('DP1MP2MP1Y,DP2MP3MP2Y'),
            c2 = ConditionalCollection.parse('DP1MP2MP1Y,DP2MP3MP2Y');

        assert.isTrue(c1.equals(c2));
    });

    it('Correctly clones a Category ConditionalPeriod', function () {
        let c = ConditionalCollection.parse('C1-2P1Y'),
            clone = c.clone();

        assert.strictEqual(clone.toString(), c.toString());
    });

    it('Correctly clones a Duration ConditionalPeriod', function () {
        let c = ConditionalCollection.parse('DP1MP2MP1Y,DP2MP3MP2Y'),
            clone = c.clone();

        assert.strictEqual(clone.toString(), c.toString());
    });

    it('Correctly toString() for Category ConditionalCollection', function () {
        let cString = 'C3-5P10D,C6-8P20D,C9-11P30D',
            c = ConditionalCollection.fromArray([
                new ConditionalPeriod(ConditionalType.CATEGORY, 3, 5, Duration.fromISO('P10D')),
                new ConditionalPeriod(ConditionalType.CATEGORY, 6, 8, Duration.fromISO('P20D')),
                new ConditionalPeriod(ConditionalType.CATEGORY, 9, 11, Duration.fromISO('P30D')),
            ]);

        assert.strictEqual(cString, c.toString());
        assert.strictEqual(cString, String(c));
    });

    it('Correctly toString() for Duration ConditionalCollection', function () {
        let cString = 'DP3DP5DP10D,DP6DP8DP20D,DP9DP11DP30D',
            c = ConditionalCollection.fromArray([
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P3D'), Duration.fromISO('P5D'), Duration.fromISO('P10D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P6D'), Duration.fromISO('P8D'), Duration.fromISO('P20D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P9D'), Duration.fromISO('P11D'), Duration.fromISO('P30D')),
            ]);

        assert.strictEqual(cString, c.toString());
        assert.strictEqual(cString, String(c));
    });

    it('Correctly outputs length for Category ConditionalCollection', function () {
        let c = ConditionalCollection.fromArray([
                new ConditionalPeriod(ConditionalType.CATEGORY, 3, 5, Duration.fromISO('P10D')),
                new ConditionalPeriod(ConditionalType.CATEGORY, 6, 8, Duration.fromISO('P20D')),
                new ConditionalPeriod(ConditionalType.CATEGORY, 9, 11, Duration.fromISO('P30D')),
            ]);

        assert.strictEqual(c.length, 3);
    });

    it('Correctly outputs length for Duration ConditionalCollection', function () {
        let c = ConditionalCollection.fromArray([
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P3D'), Duration.fromISO('P5D'), Duration.fromISO('P10D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P6D'), Duration.fromISO('P8D'), Duration.fromISO('P20D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P9D'), Duration.fromISO('P11D'), Duration.fromISO('P30D')),
            ]);

        assert.strictEqual(c.length, 3);
    });

    it('Correctly iterate over it', function () {
        let c = ConditionalCollection.fromArray([
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P3D'), Duration.fromISO('P5D'), Duration.fromISO('P10D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P6D'), Duration.fromISO('P8D'), Duration.fromISO('P20D')),
                new ConditionalPeriod(ConditionalType.DURATION, Duration.fromISO('P9D'), Duration.fromISO('P11D'), Duration.fromISO('P30D')),
            ]),
            i = 0;

        for (const period of c) {
            assert.strictEqual(c.container[i++], period);
        }
    });

});
