import { describe, test, expect } from 'vitest';
import { hashString } from '../lib/hash.js';

describe('hashString', () => {
    test('returns 0 for empty string', () => {
        expect(hashString('')).toBe(0);
    });

    test('returns a deterministic integer for the same input', () => {
        const a = hashString('Alice');
        const b = hashString('Alice');
        expect(a).toBe(b);
        expect(Number.isInteger(a)).toBe(true);
    });

    test('returns different values for different inputs', () => {
        expect(hashString('Alice')).not.toBe(hashString('Bob'));
    });

    test('does not throw for unicode input and is self-consistent', () => {
        expect(() => hashString('日本語')).not.toThrow();
        expect(hashString('日本語')).toBe(hashString('日本語'));
    });
});

describe('hashString pinned values (regression guard)', () => {
    test('hashes "Alice" to the expected 32-bit integer', () => {
        expect(hashString('Alice')).toBe(63350368);
    });

    test('hashes "Bob" to the expected 32-bit integer', () => {
        expect(hashString('Bob')).toBe(66965);
    });

    test('hashes unicode "日本語" to the expected 32-bit integer', () => {
        expect(hashString('日本語')).toBe(25921943);
    });
});
