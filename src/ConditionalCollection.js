const { Duration } = require('luxon');
const ConditionalPeriod = require('./ConditionalPeriod.js');
const ConditionalType = require('./ConditionalType.js');

/**
 * This class stores an array of ConditionalPeriod, allowing the user
 * to find() which ConditionalPeriod matches a given value.
 */
class ConditionalCollection {
    /**
     * Construct the internal container and seal the object
     */
    constructor() {
        this.container = [];

        Object.seal(this);
    }

    /**
     * Instanciate an ConditionalCollection and sets its first element
     *
     * @param  ConditionalPeriod|string value The first value to store as:
     *                                            - ConditionalPeriod
     *                                            - the string form of an ConditionalPeriod
     * @return ConditionalCollection
     *
     * @throws TypeError
     */
    static create(value) {
        if (typeof value === 'string') {
            value = ConditionalPeriod.parse(value);
        } else if (!(value instanceof ConditionalPeriod)) {
            throw new TypeError('Only ConditionalPeriod (as object or string form) can be stored. Given: ' + typeof value);
        }

        return (new this).push(value);
    }

    /**
     * Instanciate an ConditionalCollection from its string form
     *
     * @param  string                str
     * @return ConditionalCollection
     *
     * @throws TypeError
     */
    static parse(str) {
        if (typeof str !== 'string') {
            throw new TypeError('First argument of parse() must be a string. ' + typeof str + ' given.');
        }

        let collection = new this;

        for (let periodStr of str.split(',')) {
            collection.push(ConditionalPeriod.parse(periodStr));
        }

        return collection;
    }

    /**
     * Instanciate an ConditionalCollection from an array of ConditionalPeriod
     *
     * @param  Array                 Array of ConditionalPeriod
     * @return ConditionalCollection
     *
     * @throws TypeError
     */
    static fromArray(array) {
        if (!Array.isArray(array)) {
            throw new TypeError('First argument of fromArray() must be an array. ' + typeof array + ' given.');
        }

        let collection = new this;

        for (let i=0, z=array.length; i<z; ++i) {
            if (typeof array[i] === 'string') {
                array[i] = ConditionalPeriod.parse(array[i]);
            }

            if (!(array[i] instanceof ConditionalPeriod)) {
                throw new TypeError('First argument of fromArray() must only contain only ConditionalPeriod or its string form elements. ' + typeof array[i] + ' given at position ' + index + '.');
            }

            collection.push(array[i]);
        }

        return collection;
    }

    /**
     * Instanciate an ConditionalCollection from a JSON string
     *
     * @param  String                 JSON string of a ConditionalCollection
     * @return ConditionalCollection
     *
     * @throws TypeError
     */
    static fromJson(json) {
        if (typeof json !== 'string') {
            throw new TypeError('First argument of fromJson() must be a string. ' + typeof json + ' given.');
        }

        return this.fromArray(JSON.parse(json));
    }

    /**
     * Push a given ConditionalPeriod in the container, at given index or last
     * and returns this.
     *
     * @param  ConditionalPeriod|string value  Value to push as:
     *                                             - as ConditionalPeriod
     *                                             - as string, used to construct a
     *                                               ConditionalPeriod
     * @param  int|null                 offset Index, or null to push at the end
     *
     * @return ConditionalCollection
     *
     * @throws InvalidArgumentException
     */
    push(value, offset = null) {
        if (typeof value === 'string') {
            value = ConditionalPeriod.parse(value);
        } else if (!(value instanceof ConditionalPeriod)) {
            throw new TypeError('Only ConditionalPeriod (as object or string form) can be stored. Given: ' + typeof value);
        }

        if (this.container.length && value.type !== this.container[0].type) {
            throw new TypeError('The ConditionalPeriod set must have the same type as all the periods stored. Given: ' + value.type() === ConditionalType.CATEGORY ? 'ConditionalType.CATEGORY' : 'ConditionalType.DURATION');
        }

        if (offset === null) {
            this.container.push(value);
        } else {
            this.container.splice(offset, 0, value);
        }

        return this;
    }

    /**
     * Find the ConditionalPeriod matching the given value
     * and returns the matched one, or null if none matched.
     *
     * @param  Duration|string|int value Value to find as:
     *                                       - as Duration
     *                                       - as string, used to construct a
     *                                         Duration
     *                                       - int, for conditions based on category
     * @return ConditionalPeriod|null
     */
    find(value) {
        if (typeof value === 'string') {
            value = Duration.fromISO(value);
        } else if (!Number.isInteger(value) && !(value instanceof Duration)) {
            throw new TypeError('Only Duration (as object or string form) or integers can be found. Given: ' + typeof value);
        }

        for (let period of this.container) {
            if (period.match(value)) {
                return period;
            }
        }

        return null;
    }

    /**
     * Arrayify this object
     *
     * @return Array Array of ConditionalPeriod
     */
    toArray() {
        let array = [];

        for (let period of this.container) {
            array.push(period.toString());
        }

        return array;
    }

    /**
     * Serialize this object to JSON
     *
     * @return string JSON string of ConditionalCollection
     */
    toJson() {
        return JSON.stringify(this.toArray);
    }

    /**
     * Stringify this object
     *
     * @return string String form of ConditionalCollection
     */
    toString() {
        return this.container.join(',');
    }

    /**
     * Get container length
     *
     * @return int
     */
    get length() {
        return this.container.length;
    }
};

module.exports = ConditionalCollection;
