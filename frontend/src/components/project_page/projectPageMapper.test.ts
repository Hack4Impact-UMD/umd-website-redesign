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

  it('passes safe screenshots through in order, with alt text and a frame from their shape', () => {
    const result = buildProjectPageViewModel(
      project({
        screenshots: {
          data: [
            {
              id: 's0',
              attributes: {
                url: '/api/media/projects/1/desktop.png',
                alternativeText: 'Reviewer dashboard',
                width: 1900,
                height: 1000,
              },
            },
            { id: 's1', attributes: { url: 'javascript:alert(1)' } },
            { id: 's2', attributes: { url: '/api/media/projects/1/phone.png', width: 390, height: 844 } },
            { id: 's3', attributes: { url: '/api/media/projects/1/unknown.png' } },
          ],
        },
      }),
    );

    expect(result.screenshots).toEqual([
      {
        src: '/api/media/projects/1/desktop.png',
        alt: 'Reviewer dashboard',
        caption: 'Reviewer dashboard',
        frame: 'browser',
        width: 1900,
        height: 1000,
      },
      { src: '/api/media/projects/1/phone.png', alt: 'Screenshot 3 of Verified Project', frame: 'phone', width: 390, height: 844 },
      // No dimensions: the shape is unknown, so it gets the browser frame.
      { src: '/api/media/projects/1/unknown.png', alt: 'Screenshot 4 of Verified Project', frame: 'browser' },
    ]);
  });

  it('uses a plain generic alt for a lone screenshot, and has none when the API omits them', () => {
    const single = buildProjectPageViewModel(
      project({ screenshots: { data: [{ id: 's', attributes: { url: '/api/media/projects/1/shot.png' } }] } }),
    );
    expect(single.screenshots[0]?.alt).toBe('Screenshot of Verified Project');
    expect(buildProjectPageViewModel(project()).screenshots).toEqual([]);
    expect(buildProjectPageViewModel(project({ screenshots: { data: [] } })).screenshots).toEqual([]);
  });
});
