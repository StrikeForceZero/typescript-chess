import {
    describe,
    expect,
    it,
} from '@jest/globals';
import {
    count,
    groupBy,
    groupByMapped,
    sumBy,
    tallyBy,
} from '../array';

describe('sumBy', () => {
    it('should sum', () => {
        expect(sumBy([{ foo: 1 }, { foo: 2 }], value => value.foo)).toBe(3);
    });
});

describe('count', () => {
    it('should count', () => {
        expect(count([{ foo: 1 }, { foo: 2 }], value => value.foo > 1)).toBe(1);
    });
});

describe('tallyBy', () => {
    it('should tally', () => {
        expect(tallyBy([{ foo: 'a' }, { foo: 'b' }, { foo: 'a' }], value => value.foo)).toStrictEqual({'a': 2, 'b': 1});
    });
});

describe('groupBy', () => {
    it('should group by', () => {
        expect(groupBy([{ foo: 'a' }, { foo: 'b' }, { foo: 'a' }], value => value.foo)).toStrictEqual({
            a: [{ foo: 'a' }, { foo: 'a' }],
            b: [{ foo: 'b' }],
        });
    });
});

describe('groupByMapped', () => {
    it('should group by', () => {
        expect(groupByMapped([{ foo: 'a' }, { foo: 'b' }, { foo: 'a' }], value => [value.foo, value.foo])).toStrictEqual({
            a: ['a', 'a'],
            b: ['b'],
        });
    });
});
