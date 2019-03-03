# ConditionalPeriod

`ConditionalPeriod` is a js class allowing to store 2 numerical/`Duration` intervals resulting in a `Duration`.

It is, actually, a requirement for a project I'm working on. Typically, it concerns the working contracts. Here is an example using integers as conditions:

- If the **category** of the employee is **between 1 and 5**, the *prior notice* is **1 month**.
- If the **category** of the employee is **between 6 and 7**, the *prior notice* is **2 months**.
- If the **category** of the employee is **between 8 and 12**, the *prior notice* is **3 months**.

Here is another example using date intervals as conditions:

- If the **fixed term contract** lasts from **0** to **6 months**, then the *trial period* is **15 days**.
- Above **6 months**, the *trial period* is **1 month**.

Expressing these interval with conditions using `ConditionalPeriod` is super duper easy and can be expressed in 2 ways: Using 4 arguments on the constructor, or using a string syntax.

## Installation

You can use composer: `npm install conditional-period:^1.0`

Or download the repo and add the files (in `/src`) to your project.

## Usage

### Using 4 arguments on the constructor, aka "classic instantiation"

```js
const { Duration } = require('luxon');
const {
    ConditionalCollection,
    ConditionalPeriod,
    ConditionalType
}                  = require('conditional-period');
...
let prior_notices = [
    new ConditionalPeriod(
        ConditionalType.CATEGORY,
        1,
        5,
        Duration.fromISO('P1M')
    ),
    new ConditionalPeriod(
        ConditionalType::CATEGORY,
        6,
        7,
        Duration.fromISO('P2M')
    ),
    new ConditionalPeriod(
        ConditionalType::CATEGORY,
        8,
        12,
        Duration.fromISO('P3M')
    ),
];

prior_notices = ConditionalCollection.fromArray(prior_notices);


let trial_periods = [
    new ConditionalPeriod(
        ConditionalType::DURATION,
        Duration.fromISO(0),
        Duration.fromISO('P6M'),
        Duration.fromISO('P15D')
    ),
    new ConditionalPeriod(
        ConditionalType::DURATION,
        Duration.fromISO('P6M'),
        Duration.fromISO('P99Y'),   // Equivalent to +∞
        Duration.fromISO('P1M')
    ),
];

trial_periods = ConditionalCollection.fromArray(trial_periods);
```


### Using the short string format, aka "badass mode"

```javascript
const {
    ConditionalCollection,
    ConditionalPeriod
}                  = require('conditional-period');
...
let prior_notices = [
    new ConditionalPeriod('C1-5P1M'),
    new ConditionalPeriod('C6-7P2M'),
    new ConditionalPeriod('C8-12P3M'),
];

// OR
prior_notices = new ConditionalCollection;
prior_notices.push(new ConditionalPeriod('C1-5P1M'));
prior_notices.push('C6-7P2M');
prior_notices.push(ConditionalPeriod('C8-12P3M'));

let trial_periods = [
    new ConditionalPeriod('DP0DP6MP15D'),
    new ConditionalPeriod('DP6MP99YP1M')
];

// OR
trial_periods = ConditionalCollection.parse('DP0DP6MP15D,DP6MP99YP1M');
```

### Miscellaneous

You may of may not have noticed it, but every `Duration` argument can be replaced by either its [`ISO8601` duration spec](https://en.wikipedia.org/wiki/ISO_8601#Durations) (the same way you can [instanciate a `Duration`](https://moment.github.io/luxon/docs/class/src/duration.js~Duration.html#static-method-fromISO).

So, here are the 2 same ways to input a `Duration` using `ConditionalPeriod` constructor:

- `Duration.fromISO('P1Y2M3D');`
- `'P1Y2M3D'`

And there are 4 ways to create a `ConditionalCollection`:

- `ConditionalCollection.create(new ConditionalPeriod(…))`, which instanciates it and sets its first value (); // Or ConditionalPeriod string form
- `new ConditionalCollection`, then push to it: `c.push(new ConditionalPeriod(…)); // or ConditionalPeriod string form`
- `ConditionalCollection.parse(…)`, which takes its own `toString()` form
- `ConditionalCollection.fromArray(…)`, which takes an array of `ConditionalPeriod` or its string form

## Need help?
Open an issue.

Now have fun.
