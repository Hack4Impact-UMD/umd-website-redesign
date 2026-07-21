import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveMediaUrl } from './media';
import { isSafeCtaUrl } from './urls';

describe('URL safety', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('resolves same-origin and storage media without conflating CTA rules', () => {
    expect(resolveMediaUrl('/api/media/projects/p/image.png')).toBe('/api/media/projects/p/image.png');
    expect(resolveMediaUrl('members/1/avatar.jpg')).toBe('/api/media/members/1/avatar.jpg');
    expect(resolveMediaUrl('/assets/team.jpg')).toBe('/assets/team.jpg');
    expect(resolveMediaUrl('https://cdn.example.org/team.jpg')).toBe('https://cdn.example.org/team.jpg');
    expect(isSafeCtaUrl('mailto:umd@hack4impact.org')).toBe(true);
  });

  it('re-bases same-origin media on a direct API override without duplicating /api', () => {
    vi.stubEnv('VITE_API_URL', 'https://us-central1-example.cloudfunctions.net/api');
    expect(resolveMediaUrl('/api/media/projects/p/image.png')).toBe(
      'https://us-central1-example.cloudfunctions.net/api/media/projects/p/image.png',
    );
  });

  it('rejects traversal, encoded separators, credentials, unsafe protocols, and production HTTP', () => {
    expect(resolveMediaUrl('projects/../secret.png')).toBe('');
    expect(resolveMediaUrl('/api/media/projects%2fsecret.png')).toBe('');
    expect(resolveMediaUrl('https://cdn.example.org/projects/%2fsecret.png')).toBe('');
    expect(resolveMediaUrl('https://cdn.example.org/projects/../secret.png')).toBe('');
    expect(resolveMediaUrl('https://user:pass@example.org/a.png')).toBe('');
    expect(resolveMediaUrl('http://example.org/a.png')).toBe('');
    expect(resolveMediaUrl('javascript:alert(1)')).toBe('');
    expect(isSafeCtaUrl('javascript:alert(1)')).toBe(false);
  });
});
