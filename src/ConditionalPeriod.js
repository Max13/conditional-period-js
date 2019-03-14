const moment = require('moment');
const ConditionalType = require('./ConditionalType.js');

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
            if (!(moment.isDuration(value)) && typeof value !== 'string') {
                throw new TypeError('The second argument must be a valid moment.duration, or an iso8601 duration string. Input was: (' + typeof value + ')' + (['integer', 'string'].indexOf(typeof value) !== -1 ? value : null));
            }
            value = moment.isDuration(value) ? value : moment.duration(value);
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
            if (!(moment.isDuration(value)) && typeof value !== 'string') {
                throw new TypeError('The third argument must be a valid moment.duration, or an iso8601 duration string. Input was: (' + typeof value + ')' + (['integer', 'string'].indexOf(typeof value) !== -1 ? value : null));
            }
            value = moment.isDuration(value) ? value : moment.duration(value);
        }

        if (
            (this.type === ConditionalType.CATEGORY && value < this.lower)
            || (this.type === ConditionalType.DURATION && value.asSeconds() < this.lower.asSeconds())
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
        if (!(moment.isDuration(value)) && typeof value !== 'string') {
            throw new TypeError('The fourth argument must be a valid moment.duration, or an iso8601 duration string. Input was: (' + typeof value + ')' + (['integer', 'string'].indexOf(typeof value) !== -1 ? value : null));
        }

        return moment.isDuration(value) ? value : moment.duration(value);
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

        if (moment.isDuration(value)) {
            return value.asSeconds() >= this.lower.asSeconds()
                   && value.asSeconds() <= this.upper.asSeconds()
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

        str += moment.isDuration(this.lower) ? this.lower.toISOString() : this.lower + '-';
        str += moment.isDuration(this.upper) ? this.upper.toISOString() : this.upper;
        str += this.result.toISOString();

        return str;
    }
};

module.exports = ConditionalPeriod;
