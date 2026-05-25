import { describe, test, expect } from 'vitest';
import { generateDNA, seededRNG } from '../lib/dna.js';

describe('seededRNG', () => {
    test('produces same sequence for same seed', () => {
        const a = seededRNG(42);
        const b = seededRNG(42);
        expect([a(), a(), a()]).toEqual([b(), b(), b()]);
    });

    test('produces different sequences for different seeds', () => {
        const a = seededRNG(1);
        const b = seededRNG(2);
        expect(a()).not.toBe(b());
    });

    test('values are between 0 and 1', () => {
        const rng = seededRNG(99);
        for (let i = 0; i < 20; i++) {
            const v = rng();
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThan(1);
        }
    });
});

describe('generateDNA', () => {
    test('returns a string of the requested length', () => {
        expect(generateDNA('seed', 12).length).toBe(12);
        expect(generateDNA('seed', 48).length).toBe(48);
    });

    test('only contains A, T, C, G', () => {
        const dna = generateDNA('Alice', 48);
        expect(/^[ATCG]+$/.test(dna)).toBe(true);
    });

    test('is deterministic — same seed gives same DNA', () => {
        expect(generateDNA('Alice|2000-01-01', 48))
            .toBe(generateDNA('Alice|2000-01-01', 48));
    });

    test('different seeds give different DNA', () => {
        expect(generateDNA('Alice|2000-01-01', 48))
            .not.toBe(generateDNA('Bob|2000-01-01', 48));
    });
});

describe('generateDNA pinned values (regression guard)', () => {
    test('produces a stable 12-bp sequence for a known seed', () => {
        // If this fails, the PRNG algorithm changed. Update the pin only after
        // verifying the new algorithm is intentionally different.
        const dna = generateDNA('Alice|2000-01-15|08:30', 12);
        expect(dna).toMatch(/^[ATCG]{12}$/);
        // Pinned value — computed from the current Mulberry32 + djb2 seed combo:
        expect(dna).toBe('AGCTTAACTTTG');
    });
});
