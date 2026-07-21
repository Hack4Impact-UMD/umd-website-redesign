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

  it('exposes the fail-closed Home publishing controls', () => {
    const home = collections.find(({ id }) => id === 'content_home') as unknown as {
      properties: { payload: { properties: Record<string, any> } };
    };
    const payload = home.properties.payload.properties;

    expect(payload.testimonials.properties.mode.enumValues).toEqual(
      expect.arrayContaining([{ id: 'published', label: 'Published' }]),
    );
    expect(payload.testimonials.properties.items.of.properties.verified.dataType).toBe('boolean');
    expect(payload.hero.properties.slides.of.properties.mobileImage.storage.storagePath).toContain(
      'hero-slides',
    );
    expect(payload.newsletter.properties.subscribeSuccessMessage).toBeUndefined();
    expect(payload.newsletter.properties.subscribeUrl.url).toBe(true);
    expect(payload.sponsors.properties.tiers.of.properties.sponsors.of.properties.visible.dataType).toBe(
      'boolean',
    );
  });

  it('constrains shared social settings to supported icons and URL inputs', () => {
    const settings = collections.find(({ id }) => id === 'content_site_settings') as unknown as {
      properties: { payload: { properties: Record<string, any> } };
    };
    const navLinks = settings.properties.payload.properties.navbar.properties.links;
    const social = settings.properties.payload.properties.footer.properties.socialLinks.of.properties;
    expect(navLinks.validation).toEqual({ required: true, min: 1 });
    expect(social.href.url).toBe(true);
    expect(social.icon.enumValues.map(({ id }: { id: string }) => id)).toEqual([
      'Instagram', 'Github', 'Linkedin', 'Facebook',
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
