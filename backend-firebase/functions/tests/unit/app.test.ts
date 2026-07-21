import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../src/app';
import type { RuntimeConfig } from '../../src/config';

const config: RuntimeConfig = {
  firebaseProjectId: 'demo-umd-website',
  firebaseStorageBucket: 'demo-umd-website.appspot.com',
  apiRegion: 'us-central1',
  cacheMaxAge: 60,
  cacheSMaxAge: 300,
  allowedOrigins: ['https://allowed.example'],
  isEmulator: true,
};

describe('API shell', () => {
  const app = createApp(config);

  it.each(['/health', '/api/health'])('serves %s without public caching', async (path) => {
    const response = await request(app).get(path);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.headers.vary).toContain('Origin');
  });

  it('accepts configured browser origins', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'https://allowed.example');
    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe(
      'https://allowed.example',
    );
  });

  it('accepts clients without an Origin header', async () => {
    expect((await request(app).get('/health')).status).toBe(200);
  });

  it('rejects unconfigured browser origins without cacheable errors', async () => {
    const response = await request(app)
      .get('/health')
      .set('Origin', 'https://denied.example');
    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe('cors/not-allowed');
    expect(response.headers['cache-control']).toBe('no-store');
  });

  it('returns no-store for unknown routes', async () => {
    const response = await request(app).get('/missing');
    expect(response.status).toBe(404);
    expect(response.headers['cache-control']).toBe('no-store');
  });
});
