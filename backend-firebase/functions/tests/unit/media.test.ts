import { describe, expect, it } from 'vitest';
import { parsePublicMediaPath, toPublicMediaUrl } from '../../src/utils/media';

describe('public media paths', () => {
  it('normalizes supported storage paths', () => {
    expect(toPublicMediaUrl('projects/62/hero image.png')).toBe(
      '/api/media/projects/62/hero%20image.png',
    );
    expect(parsePublicMediaPath('members/144/avatar.png')).toBe(
      'members/144/avatar.png',
    );
  });

  it.each([
    '../secret.png',
    'projects/../secret.png',
    'projects/%2e%2e/secret.png',
    'projects/%252e%252e%252fsecret.png',
    'projects/%5csecret.png',
    'projects/%255csecret.png',
    'projects/%00secret.png',
    'projects/%E0%A4%A',
    'private/secret.png',
  ])('rejects unsafe path %s', (path) => {
    expect(parsePublicMediaPath(path)).toBeNull();
  });

  it('does not leak invalid raw media values back to callers', () => {
    expect(toPublicMediaUrl('/api/media/projects/%2e%2e/secret.png')).toBeNull();
    expect(toPublicMediaUrl('javascript:alert(1)')).toBeNull();
  });

  it('preserves valid external HTTP(S) assets', () => {
    expect(toPublicMediaUrl('https://example.org/logo.png')).toBe(
      'https://example.org/logo.png',
    );
  });
});
