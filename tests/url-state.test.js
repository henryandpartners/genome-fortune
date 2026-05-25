import { describe, test, expect } from 'vitest';
import { encodeReading, decodeReading } from '../share/url-state.js';

describe('encodeReading / decodeReading', () => {
    test('round-trips a single subject reading', () => {
        const input = { name: 'Alice', date: '2000-01-15', time: '08:30', place: '' };
        const query = encodeReading(input);
        const decoded = decodeReading(query);
        expect(decoded).toEqual(input);
    });

    test('handles missing optional fields', () => {
        const input = { name: 'Bob', date: '1985-07-04' };
        const query = encodeReading(input);
        const decoded = decodeReading(query);
        expect(decoded.name).toBe('Bob');
        expect(decoded.date).toBe('1985-07-04');
        expect(decoded.time).toBe('');
        expect(decoded.place).toBe('');
    });

    test('encodes unicode names safely', () => {
        const input = { name: '日本語', date: '1990-03-21' };
        const query = encodeReading(input);
        // Round-trip must equal the input
        expect(decodeReading(query).name).toBe('日本語');
        // Query must be URL-safe (no raw unicode bytes)
        expect(query).not.toMatch(/[^A-Za-z0-9_\-?=&%.~]/);
    });

    test('decodeReading on empty query returns null', () => {
        expect(decodeReading('')).toBe(null);
        expect(decodeReading('?')).toBe(null);
    });

    test('decodeReading on missing required field returns null', () => {
        // no name
        expect(decodeReading('?d=2000-01-01')).toBe(null);
        // no date
        expect(decodeReading('?n=Alice')).toBe(null);
    });
});
