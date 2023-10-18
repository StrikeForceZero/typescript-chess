import {
    describe,
    expect,
    it,
} from '@jest/globals';
import {
    count,
    ensureArray,
    groupBy,
    groupByMapped,
    isNotEmpty,
    last,
    lastOrThrow,
    sum,
    sumBy,
    tallyBy,
} from '../array';

describe('array utils', () => {
    describe('ensureArray', () => {
        it('should ensureArray', () => {
            expect(ensureArray([])).toStrictEqual([]);
            expect(ensureArray([1,2,3])).toStrictEqual([1,2,3]);
            expect(ensureArray(1)).toStrictEqual([1]);
        });
    });
    describe('isNotEmpty', () => {
        it('should isNotEmpty', () => {
            expect(isNotEmpty([])).toBe(false);
            expect(isNotEmpty([1])).toBe(true);
        });
    });
    describe('last', () => {
        it('should last', () => {
            expect(last([1])).toBe(1);
            expect(last([])).toBe(undefined);
        });
        it('should last infer types', () => {
            function noOp(..._args: unknown []) {}
            const foos: number[] = [];
            if (isNotEmpty(foos)) {
                // should not throw tsc error otherwise types are wrong
                const _foo: number = last(foos);
                noOp(_foo);
            }
        });
    });
    describe('lastOrThrow', () => {
        it('should lastOrThrow', () => {
            expect(lastOrThrow([1])).toBe(1);
            expect(() => lastOrThrow([])).toThrow();
        });
    });
    describe('sum', () => {
        it('should sum', () => {
            expect(sum([1,2,3])).toBe(6);
        });
    });

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
});
