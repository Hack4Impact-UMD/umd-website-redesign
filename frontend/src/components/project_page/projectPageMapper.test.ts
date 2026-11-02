import { describe, expect, it } from 'vitest';

import type { ProjectEntity } from '@/api';
import { buildProjectPageViewModel, plainTextParagraphs } from './projectPageMapper';

const project = (overrides: Partial<ProjectEntity['attributes']> = {}): ProjectEntity => ({
  id: 'project-1',
  attributes: {
    title: 'Verified Project',
    path: 'verified-project',
    startDate: '2025-09-01',
    summary: 'A verified summary.',
    blurb: '<p>First verified paragraph.</p><p>Second &amp; final paragraph.</p>',
    isFeatured: false,
    isCurrentProject: false,
    repoURL: undefined,
    hostedProjectURL: undefined,
    imageAltText: undefined,
    image: { data: [] },
    members: { data: [] },
    ...overrides,
  },
});

describe('plainTextParagraphs', () => {
  it('converts supported legacy rich text into escaped, readable paragraphs', () => {
    expect(plainTextParagraphs('<p>First &amp; second.</p><div>Third<br>line.</div>')).toEqual([
      'First & second.',
      'Third line.',
    ]);
  });
});

describe('buildProjectPageViewModel', () => {
  it('uses only fields present in the Firebase project record', () => {
    const result = buildProjectPageViewModel(project());

    expect(result).toMatchObject({
      title: 'Verified Project',
      seasonLabel: 'Fall 2025',
      summary: 'A verified summary.',
      overviewParagraphs: ['First verified paragraph.', 'Second & final paragraph.'],
      isCurrentProject: false,
      heroImageSrc: undefined,
      partnerName: undefined,
      repoURL: undefined,
      hostedProjectURL: undefined,
    });
    expect(result).not.toHaveProperty('metrics');
    expect(result).not.toHaveProperty('testimonials');
    expect(result).not.toHaveProperty('features');
    expect(result).not.toHaveProperty('techStack');
  });

  it('keeps safe media and links while failing closed on unsafe URLs', () => {
    const result = buildProjectPageViewModel(project({
      repoURL: 'javascript:alert(1)',
      hostedProjectURL: 'https://example.org/app',
      image: { data: [{ id: 'media-1', attributes: { url: 'projects/verified/preview.png' } }] },
      nonprofit: { data: { id: 'npo-1', attributes: { name: 'Verified Partner' } } },
    }));

    expect(result.repoURL).toBeUndefined();
    expect(result.hostedProjectURL).toBe('https://example.org/app');
    expect(result.heroImageSrc).toContain('/media/projects/verified/preview.png');
    expect(result.partnerName).toBe('Verified Partner');
  });

  it('passes a safe screenshot through with its alt text, and falls back to a generic alt', () => {
    const withAlt = buildProjectPageViewModel(
      project({
        screenshot: {
          data: {
            id: 'project-1_screenshot',
            attributes: { url: '/api/media/projects/1/screenshot.png', alternativeText: 'Reviewer dashboard' },
          },
        },
      }),
    );
    expect(withAlt.screenshot).toEqual({ src: '/api/media/projects/1/screenshot.png', alt: 'Reviewer dashboard' });

    const withoutAlt = buildProjectPageViewModel(
      project({ screenshot: { data: { id: 's', attributes: { url: '/api/media/projects/1/screenshot.png' } } } }),
    );
    expect(withoutAlt.screenshot?.alt).toBe('Screenshot of Verified Project');
  });

  it('has no screenshot when the API omits it, sends null, or sends an unsafe URL', () => {
    expect(buildProjectPageViewModel(project()).screenshot).toBeUndefined();
    expect(buildProjectPageViewModel(project({ screenshot: { data: null } })).screenshot).toBeUndefined();
    expect(
      buildProjectPageViewModel(
        project({ screenshot: { data: { id: 's', attributes: { url: 'javascript:alert(1)' } } } }),
      ).screenshot,
    ).toBeUndefined();
  });
});
