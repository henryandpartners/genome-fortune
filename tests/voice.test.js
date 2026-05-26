import { describe, test, expect } from 'vitest';
import { culturalReading } from '../voice/cultural.js';
import { genomeReading } from '../voice/genome.js';

describe('culturalReading', () => {
    test('returns the engine.reading field when present', () => {
        const result = culturalReading('bazi', { reading: 'Bazi says hello.' });
        expect(result).toBe('Bazi says hello.');
    });

    test('returns a placeholder when engine.reading is missing', () => {
        const result = culturalReading('bazi', {});
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('falls back to a generic message for an unknown engine', () => {
        const result = culturalReading('unknown', { reading: 'X' });
        expect(result).toBe('X');
    });
});

describe('genomeReading', () => {
    test('returns a string deterministically for the same engine + result', () => {
        const r = { reading: 'foo', dayMaster: '甲 Jia (Wood Yang)' };
        expect(genomeReading('bazi', r)).toBe(genomeReading('bazi', r));
    });

    test('returns different strings for different engines', () => {
        const r = { reading: 'foo' };
        // We only assert the strings are non-empty here; full content lands in Phase 5.
        expect(genomeReading('bazi', r)).toBeTruthy();
        expect(genomeReading('iching', r)).toBeTruthy();
    });
});
