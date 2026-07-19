import { describe, expect, it } from 'vitest';
import { normalizeContentSave } from '../../src/collections/content/shared';
import { collections } from '../../src/collections';

describe('content collection controls', () => {
  it('registers all six content collections once', () => {
    expect(collections.map(({ id }) => id).filter((id) => id.startsWith('content_'))).toEqual([
      'content_home',
      'content_about',
      'content_our_work',
      'content_apply_student',
      'content_apply_nonprofit',
      'content_site_settings',
    ]);
  });

  it('requires verification before first publication', () => {
    expect(() => normalizeContentSave({ mode: 'published', payload: { title: 'Ready' } })).toThrow(
      /fresh verification date/,
    );
  });

  it('invalidates verification when an already-published payload changes', () => {
    expect(
      normalizeContentSave(
        { mode: 'published', verifiedAt: new Date(), payload: { title: 'Changed' } },
        { mode: 'published', verifiedAt: new Date(), payload: { title: 'Original' } },
      ),
    ).toMatchObject({ mode: 'placeholder', verifiedAt: null });
  });

  it('allows placeholder and hidden modes without a payload', () => {
    expect(normalizeContentSave({ mode: 'placeholder' })).toEqual({ mode: 'placeholder' });
    expect(normalizeContentSave({ mode: 'hidden' })).toEqual({ mode: 'hidden' });
  });

  it('clears verification when leaving published mode and requires fresh verification to return', () => {
    const verifiedAt = new Date('2026-07-19T12:00:00Z');
    expect(
      normalizeContentSave(
        { mode: 'hidden', verifiedAt, payload: { title: 'Changed while hiding' } },
        { mode: 'published', verifiedAt, payload: { title: 'Same' } },
      ),
    ).toMatchObject({ mode: 'hidden', verifiedAt: null });
    expect(() =>
      normalizeContentSave(
        { mode: 'published', verifiedAt, payload: { title: 'Same' } },
        { mode: 'placeholder', verifiedAt, payload: { title: 'Same' } },
      ),
    ).toThrow(/new verification date/);
  });

  it('rejects publishing an open application state without a safe destination', () => {
    expect(() =>
      normalizeContentSave({
        mode: 'published',
        verifiedAt: new Date('2026-07-19T12:00:00Z'),
        payload: { applicationStatus: { state: 'open', label: 'Applications open' } },
      }),
    ).toThrow(/safe HTTPS application URL/);
  });
});
