import request from 'supertest';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { RuntimeConfig } from '../../src/config';

const config: RuntimeConfig = {
  firebaseProjectId: 'demo-umd-website',
  firebaseStorageBucket: 'demo-umd-website.appspot.com',
  apiRegion: 'us-central1',
  cacheMaxAge: 60,
  cacheSMaxAge: 300,
  allowedOrigins: ['http://localhost:3000'],
  isEmulator: true,
};

let app: ReturnType<typeof import('../../src/app')['createApp']>;
let db: typeof import('../../src/firebase')['db'];
let storage: typeof import('../../src/firebase')['storage'];

beforeAll(async () => {
  const appModule = await import('../../src/app');
  const firebaseModule = await import('../../src/firebase');
  app = appModule.createApp(config);
  db = firebaseModule.db;
  storage = firebaseModule.storage;
});

beforeEach(async () => {
  const collections = await db.listCollections();
  for (const collection of collections) {
    const snapshot = await collection.get();
    await Promise.all(snapshot.docs.map((document) => document.ref.delete()));
  }

  await Promise.all([
    db.collection('members').doc('1').set({
      firstName: 'Ada',
      lastName: 'Lovelace',
      memberDisplayStatus: 'Current Member',
      componentRolesArr: [],
      projectIds: ['10'],
    }),
    db.collection('projects').doc('10').set({
      title: 'Recent project',
      path: 'recent-project',
      startDate: '2025-01-01',
      summary: 'Summary',
      blurb: 'Blurb',
      isFeatured: true,
      isCurrentProject: false,
      memberIds: ['1'],
      image: [{ url: 'projects/10/hero.png' }],
    }),
    db.collection('projects').doc('11').set({
      title: 'Older project',
      path: 'older-project',
      startDate: '2024-01-01',
      summary: 'Summary',
      blurb: 'Blurb',
      isFeatured: false,
      isCurrentProject: true,
      memberIds: [],
      image: [],
    }),
    db.collection('content_home').doc('main').set({
      hero: { slides: [{ image: 'content/home/hero.png' }] },
    }),
  ]);

  await storage
    .bucket(config.firebaseStorageBucket)
    .file('projects/10/hero.png')
    .save(Buffer.from('image'), { contentType: 'image/png' });
});

describe('emulator API contract', () => {
  it('sorts before pagination and returns stable metadata', async () => {
    const response = await request(app).get(
      '/api/projects?pagination%5Bpage%5D=1&pagination%5BpageSize%5D=1',
    );
    expect(response.status).toBe(200);
    expect(response.body.data[0].id).toBe('10');
    expect(response.body.meta.pagination).toEqual({
      page: 1,
      pageSize: 1,
      pageCount: 2,
      total: 2,
    });
    expect(response.headers['cache-control']).toContain('public');
  });

  it('returns an empty high page without changing totals', async () => {
    const response = await request(app).get(
      '/projects?pagination%5Bpage%5D=99&pagination%5BpageSize%5D=25',
    );
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual([]);
    expect(response.body.meta.pagination.total).toBe(2);
  });

  it('supports current single-filter query strings', async () => {
    const response = await request(app).get(
      '/projects?fields%5B0%5D=title&populate=*&filters%5BisCurrentProject%5D%5B%24eq%5D=true',
    );
    expect(response.status).toBe(200);
    expect(response.body.data.map((item: { id: string }) => item.id)).toEqual(['11']);
  });

  it('returns no-store 400 responses for invalid filters', async () => {
    const response = await request(app).get(
      '/projects?filters%5BisFeatured%5D%5B%24eq%5D=maybe',
    );
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('query/invalid');
    expect(response.headers['cache-control']).toBe('no-store');
  });

  it('returns members and normalized content/media', async () => {
    const [members, content, media] = await Promise.all([
      request(app).get('/api/members?pagination%5BpageSize%5D=200'),
      request(app).get('/api/content/home'),
      request(app).get('/api/media/projects/10/hero.png'),
    ]);
    expect(members.body.meta.pagination.total).toBe(1);
    expect(content.body.data.hero.slides[0].image).toBe(
      '/api/media/content/home/hero.png',
    );
    expect(media.status).toBe(200);
    expect(media.headers['x-content-type-options']).toBe('nosniff');
  });
});
