import { describe, expect, it } from 'vitest';
import { aboutContentSchema, defaultAboutContent, normalizeAboutContent } from './about';
import {
  applyNonprofitContentSchema,
  applyStudentContentSchema,
  defaultApplyNonprofitContent,
  defaultApplyStudentContent,
  normalizeApplyStudentContent,
} from './apply';
import { defaultHomeContent, homeContentSchema, normalizeHomeContent } from './home';
import { defaultOurWorkContent, normalizeOurWorkContent, ourWorkContentSchema } from './our-work';
import { defaultSiteSettings, normalizeSiteSettings, siteSettingsSchema } from './site-settings';

describe('ContentMode', () => {
  it('keeps every local placeholder complete and contract-valid', () => {
    expect(homeContentSchema.safeParse(defaultHomeContent).success).toBe(true);
    expect(aboutContentSchema.safeParse(defaultAboutContent).success).toBe(true);
    expect(applyStudentContentSchema.safeParse(defaultApplyStudentContent).success).toBe(true);
    expect(applyNonprofitContentSchema.safeParse(defaultApplyNonprofitContent).success).toBe(true);
    expect(ourWorkContentSchema.safeParse(defaultOurWorkContent).success).toBe(true);
    expect(siteSettingsSchema.safeParse(defaultSiteSettings).success).toBe(true);
  });

  it('publishes only a complete payload with a valid verifiedAt', () => {
    const result = normalizeHomeContent({
      mode: 'published',
      verifiedAt: '2026-07-19T12:00:00Z',
      payload: defaultHomeContent,
    });
    expect(result).toMatchObject({ mode: 'published', source: 'published', content: defaultHomeContent });
  });

  it('atomically uses the complete placeholder for an invalid published payload', () => {
    const result = normalizeHomeContent({
      mode: 'published',
      verifiedAt: '2026-07-19T12:00:00Z',
      payload: { ...defaultHomeContent, hero: { heading: 'partial' } },
    });
    expect(result).toMatchObject({ mode: 'placeholder', issue: 'invalid-payload' });
    expect(result.content).toBe(defaultHomeContent);
    expect(homeContentSchema.safeParse(result.content).success).toBe(true);
  });

  it('does not require payload for placeholder or hidden documents', () => {
    expect(normalizeAboutContent({ mode: 'placeholder' }).content).toBe(defaultAboutContent);
    expect(normalizeApplyStudentContent({ mode: 'hidden' })).toMatchObject({
      mode: 'hidden', source: 'hidden', content: null,
    });
  });

  it('fails legacy and missing-verification documents closed across all content keys', () => {
    expect(normalizeOurWorkContent(defaultOurWorkContent)).toMatchObject({ issue: 'legacy-document', source: 'placeholder' });
    expect(normalizeSiteSettings({ mode: 'published', payload: defaultSiteSettings })).toMatchObject({
      issue: 'missing-verification', source: 'placeholder',
    });
    expect(defaultApplyStudentContent.applicationStatus.state).toBe('closed');
  });

  it('fails an open application payload closed when it has no safe destination', () => {
    const result = normalizeApplyStudentContent({
      mode: 'published',
      verifiedAt: '2026-07-19T12:00:00Z',
      payload: {
        ...defaultApplyStudentContent,
        applicationStatus: { state: 'open', label: 'Applications are open' },
      },
    });
    expect(result).toMatchObject({ mode: 'placeholder', issue: 'invalid-payload' });
    expect(result.content).toBe(defaultApplyStudentContent);
  });

  it('keeps Apply placeholders useful without publishing stale campaigns or invented quotes', () => {
    expect(defaultApplyStudentContent.roles).toHaveLength(6);
    expect(defaultApplyStudentContent.timeline.steps).toHaveLength(3);
    expect(defaultApplyStudentContent.testimonials).toEqual([]);
    expect(defaultApplyNonprofitContent.testimonials).toEqual([]);
    expect(defaultApplyNonprofitContent.banner).toEqual({ enabled: false, text: '' });
    expect(JSON.stringify([defaultApplyStudentContent, defaultApplyNonprofitContent])).not.toContain('Fall 2025');
  });
});
