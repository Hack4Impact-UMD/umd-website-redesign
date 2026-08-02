import { describe, expect, it } from 'vitest';
import { normalizeContentSave, validateContentPayload } from '../../src/collections/content/shared';
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

  it('keeps singleton content collections to the live main document', () => {
    const home = collections.find(({ id }) => id === 'content_home') as unknown as {
      permissions: { read: boolean; create: boolean; edit: boolean; delete: boolean };
      properties: { payload: { hideFromCollection?: boolean } };
    };

    expect(home.permissions).toEqual({ read: true, create: false, edit: true, delete: false });
    expect(home.properties.payload.hideFromCollection).toBe(true);
  });

  it('exposes the fail-closed Home publishing controls', () => {
    const home = collections.find(({ id }) => id === 'content_home') as unknown as {
      properties: { payload: { properties: Record<string, any> } };
    };
    const payload = home.properties.payload.properties;

    expect(payload.testimonials.properties.mode.enumValues).toEqual(
      expect.arrayContaining([{ id: 'published', label: 'Published' }]),
    );
    expect(payload.impact.properties.mode.enumValues).toEqual(
      expect.arrayContaining([{ id: 'published', label: 'Published' }]),
    );
    expect(payload.impact.properties.stats.of.properties.verified.dataType).toBe('boolean');
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
    const contact = settings.properties.payload.properties.footer.properties.contact.properties;
    expect(navLinks.validation).toEqual({ required: true, min: 1 });
    expect(social.href.url).toBe(true);
    expect(social.href.contentValidation).toBe('https');
    expect(contact.email.contentValidation).toBe('email');
    expect(social.icon.enumValues.map(({ id }: { id: string }) => id)).toEqual([
      'Instagram', 'Github', 'Linkedin', 'Facebook',
    ]);
  });

  it('keeps project and member collection indexes focused on scannable fields', () => {
    const projects = collections.find(({ id }) => id === 'projects') as unknown as {
      properties: Record<string, { hideFromCollection?: boolean; columnWidth?: number }>;
    };
    const members = collections.find(({ id }) => id === 'members') as unknown as {
      properties: Record<string, { hideFromCollection?: boolean; columnWidth?: number }>;
    };

    expect(projects.properties.title.columnWidth).toBe(240);
    expect(projects.properties.summary.hideFromCollection).toBe(true);
    expect(projects.properties.blurb.hideFromCollection).toBe(true);
    expect(projects.properties.memberIds.hideFromCollection).toBe(true);
    expect(projects.properties.image.hideFromCollection).toBe(true);
    expect(members.properties.memberDisplayStatus.columnWidth).toBe(220);
    expect(members.properties.projectIds.hideFromCollection).toBe(true);
    expect(members.properties.componentRolesArr.hideFromCollection).toBe(true);
  });

  it('keeps custom IDs available when creating projects and members', () => {
    const projects = collections.find(({ id }) => id === 'projects') as unknown as {
      permissions: { create: boolean };
      customId: boolean | string;
      hideIdFromForm?: boolean;
    };
    const members = collections.find(({ id }) => id === 'members') as unknown as {
      permissions: { create: boolean };
      customId: boolean | string;
      hideIdFromForm?: boolean;
    };

    expect(projects).toMatchObject({ permissions: { create: true }, customId: true });
    expect(members).toMatchObject({ permissions: { create: true }, customId: true });
    expect(projects.hideIdFromForm).not.toBe(true);
    expect(members.hideIdFromForm).not.toBe(true);
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

  it('rejects a published payload that is missing a configured page section', () => {
    const validatePayload = (payload: unknown) =>
      validateContentPayload(payload, {
        header: { dataType: 'map', properties: { title: { dataType: 'string' } } },
        footer: { dataType: 'map', properties: { email: { dataType: 'string' } } },
      });
    expect(() =>
      normalizeContentSave(
        {
          mode: 'published',
          verifiedAt: new Date('2026-07-19T12:00:00Z'),
          payload: { header: { title: 'Only a header' } },
        },
        undefined,
        validatePayload,
      ),
    ).toThrow(/footer is required/);
  });

  it('rejects malformed nested values even when every top-level section exists', () => {
    expect(() =>
      validateContentPayload(
        { header: {}, footer: { email: '' } },
        {
          header: { dataType: 'map', properties: { title: { dataType: 'string' } } },
          footer: { dataType: 'map', properties: { email: { dataType: 'string' } } },
        },
      ),
    ).toThrow(/header\.title is required/);
  });

  it('supports explicitly optional fields without weakening required siblings', () => {
    expect(() =>
      validateContentPayload(
        { card: { title: 'Ready' } },
        {
          card: {
            dataType: 'map',
            properties: {
              title: { dataType: 'string' },
              image: { dataType: 'string' },
            },
          },
        },
        { optionalPaths: ['card.image'] },
      ),
    ).not.toThrow();
  });

  it.each([
    [
      { link: 'javascript:alert(1)' },
      { link: { dataType: 'string', contentValidation: 'cta' } },
      /safe internal, HTTPS, or email link/,
    ],
    [
      { email: 'not-an-email' },
      { email: { dataType: 'string', contentValidation: 'email' } },
      /valid email address/,
    ],
    [
      { website: 'mailto:chapter@example.org' },
      { website: { dataType: 'string', contentValidation: 'https' } },
      /safe HTTPS URL/,
    ],
    [
      { image: '../private.png' },
      { image: { dataType: 'string', contentValidation: 'media' } },
      /safe media path/,
    ],
  ])('rejects frontend-invalid semantic strings before publication', (payload, properties, message) => {
    expect(() => validateContentPayload(payload, properties)).toThrow(message);
  });
});
