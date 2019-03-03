const { DateTime, Duration } = require("luxon");

const ConditionalType = Object.freeze({
    CATEGORY: 'C',
    DURATION: 'D',
});

/**
 * This class is used to represent a business logic:
 * A result Duration based on an interval condition:
 *     - Between 2 categories (as int)
 *     - Between 2 durations (as Duration)
 */
class ConditionalPeriod {
    /**
     * Check type value given, returns it transformed if needed
     *
     * @param  ConditionalType type
     * @return ConditionalType
     *
     * @throws TypeError
     */
    checkTypeArgument(value) {
        if ([ConditionalType.CATEGORY, ConditionalType.DURATION].indexOf(value) === -1) {
            throw new TypeError('The first argument must be one of the ConditionalType constants (ConditionalType.CATEGORY or ConditionalType.DURATION). ' + typeof value + ' given.');
        }

        return value;
    }

    /**
     * Check lower value given, returns it transformed if needed
     *
     * @param  Duration|string|int value Lower boundary of the condition interval as:
     *                                       - as Duration
     *                                       - as iso8601 duration string
     *                                       - int, for conditions based on category
     * @return Duration|int
     *
     * @throws TypeError
     */
    checkLowerArgument(value) {
        if (this.type === ConditionalType.CATEGORY) {
            if (!Number.isInteger(value) || value <= 0) {
                throw new TypeError('The second argument must be a valid category (Non null, positive integer). Input was: (' + typeof value + ')' + (['integer', 'string'].indexOf(typeof value) !== -1 ? value : null));
            }
        } else {
            if (!(value instanceof Duration) && typeof value !== 'string') {
                throw new TypeError('The second argument must be a valid Duration, or an iso8601 duration string. Input was: (' + typeof value + ')' + (['integer', 'string'].indexOf(typeof value) !== -1 ? value : null));
            }
            value = value instanceof Duration ? value : Duration.fromISO(value);
        }

        return value;
    }

    /**
     * Check upper value given, returns it transformed if needed
     *
     * @param  Duration|string|int value Upper boundary of the condition interval as:
     *                                       - as Duration
     *                                       - as iso8601 duration string
     *                                       - int, for conditions based on category
     * @return Duration|int
     *
     * @throws TypeError
     */
    checkUpperArgument(value) {
        if (this.type === ConditionalType.CATEGORY) {
            if (!Number.isInteger(value) || value <= 0) {
                throw new TypeError('The third argument must be a valid category (Non null, positive integer). Input was: (' + typeof value + ')' + (['integer', 'string'].indexOf(typeof value) !== -1 ? value : null));
            }
        } else {
            if (!(value instanceof Duration) && typeof value !== 'string') {
                throw new TypeError('The third argument must be a valid Duration, or an iso8601 duration string. Input was: (' + typeof value + ')' + (['integer', 'string'].indexOf(typeof value) !== -1 ? value : null));
            }
            value = value instanceof Duration ? value : Duration.fromISO(value);
        }

        if (
            (this.type === ConditionalType.CATEGORY && value < this.lower)
            || (this.type === ConditionalType.DURATION && value.shiftTo('seconds') < this.lower.shiftTo('seconds'))
        ) {
            throw new TypeError('The third argument must be greater than or equal to lower). lower was (' + this.lower + ') and upper was (' + value + ')');
        }

        return value;
    }

    /**
     * Check result value given, returns it transformed if needed
     *
     * @param  Duration|string result  Result of the condition as:
     *                                     - as Duration
     *                                     - as iso8601 duration string
     * @return Duration
     *
     * @throws TypeError
     */
    checkResultArgument(value) {
        if (!(value instanceof Duration) && typeof value !== 'string') {
            throw new TypeError('The fourth argument must be a valid Duration, or an iso8601 duration string. Input was: (' + typeof value + ')' + (['integer', 'string'].indexOf(typeof value) !== -1 ? value : null));
        }

        return value instanceof Duration ? value : Duration.fromISO(value);
    }

    /**
     * Construct the ConditionalPeriod and freezes itself
     *
     * @param  MX\ConditionalType               $type   One of MX\ConditionalType consts
     * @param  Carbon\CarbonInterval|string|int $lower  Lower boundary of the condition interval as:
     *                                                      - as Carbon\CarbonInterval
     *                                                      - as string, used to construct a
     *                                                        Carbon\CarbonInterval
     *                                                      - int, for conditions based on category
     * @param  Carbon\CarbonInterval|string|int $upper  Upper boundary, included. Same as $lower
     * @param  Carbon\CarbonInterval|string     $result Result of the condition as:
     *                                                      - as Carbon\CarbonInterval
     *                                                      - as string, used to construct a
     *                                                        Carbon\CarbonInterval
     *
     * @throws TypeError                                The argument couldn't be parsed
     */
    constructor(type, lower, upper, result) {
        if (arguments.length !== 4) {
            throw new TypeError('ConditionalPeriod must be instanciated with 4 arguments. ' + arguments.length + ' given.');
        }

        this.type = this.checkTypeArgument(type);
        this.lower = this.checkLowerArgument(lower);
        this.upper = this.checkUpperArgument(upper);
        this.result = this.checkResultArgument(result);

        Object.freeze(this);
    }

    /**
     * Parse a string short format (given by toString()) to an array
     *
     * @param  string str
     * @return array      Array of arguments needed by the constructor
     */
    static parseToArray(str) {
        if (typeof str !== 'string') {
            throw new TypeError('Argument passed to parseToArray() must be a string, ' + typeof $str + ' given.');
        }

        let arg = null,
            arr = [
                str[0],
            ],
            c = 1,
            p = null;

        for (let i=0; i<2; ++i) {
            if ((p = str.indexOf('-', c + 1)) !== -1) {
                arg = str.substr(c, p - c);
                c = p + 1;
            } else if ((p = str.indexOf('P', c + 1)) !== -1) {
                arg = str.substr(c, p - c);
                c = p;
            } else {
                throw new TypeError("Invalid string format: Can't find argument " + (i + 1) + '. Given: ' + str);
            }

            if (Number(arg) == arg) {
                arg = Number(arg);
            }

            arr.push(arg);
        }

        if (c >= str.length) {
            throw new TypeError("Invalid string format: Can't find result. Given: " + str);
        }
        arr.push(str.substr(c));

        return arr;
    }

    /**
     * Parse string format of this class
     *
     * @param  string               short_format String format of the class
     * @return ConditionalPeriod
     *
     * @throws TypeError
     */
    static parse(short_format) {
        let args = this.parseToArray(short_format);

        return new this(...args);
    }

    /**
     * Match the given value to the current condition
     *
     * @param  Duration|string|int value The value to match
     * @return bool
     *
     * @throws TypeError
     */
    match(value) {
        value = this.checkLowerArgument(value);

        if (value instanceof Duration) {
            return value.shiftTo('seconds') >= this.lower.shiftTo('seconds')
                   && value.shiftTo('seconds') <= this.upper.shiftTo('seconds')
        }

        return value >= this.lower && value <= this.upper;
    }

    /**
     * Stringify the object
     *
     * @return string
     */
    toString() {
        let str = this.type;

        str += this.lower instanceof Duration ? this.lower.toISO() : this.lower + '-';
        str += this.upper instanceof Duration ? this.upper.toISO() : this.upper;
        str += this.result.toISO();

        return str;
    }
};

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
     * @return ConditionalCollection
     *
     * @throws TypeError
     */
    static fromArray(array) {
        if (!Array.isArray(array)) {
            throw new TypeError('First argument of fromArray() must be an array. ' + typeof $array + ' given.');
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
            throw new TypeError('Only Duration (as object or string form) or integers can be found. Given: ' + typeof $value);
        }

        for (let period of this.container) {
            if (period.match(value)) {
                return period;
            }
        }

        return null;
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

module.exports = {
    ConditionalCollection:  ConditionalCollection,
    ConditionalType:        ConditionalType,
    ConditionalPeriod:      ConditionalPeriod,
};
