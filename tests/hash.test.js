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

    test('handles unicode characters', () => {
        expect(() => hashString('日本語')).not.toThrow();
        expect(hashString('日本語')).toBe(hashString('日本語'));
    });
});
