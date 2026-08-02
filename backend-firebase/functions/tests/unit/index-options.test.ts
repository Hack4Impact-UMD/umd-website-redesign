import { describe, expect, it } from 'vitest';
import { apiRuntimeOptions } from '../../src/index';

describe('apiRuntimeOptions', () => {
  it('locks the captured live Gen2 runtime parity settings', () => {
    expect(apiRuntimeOptions).toEqual({
      region: 'us-central1',
      memory: '512MiB',
      timeoutSeconds: 60,
      cpu: 1,
      concurrency: 80,
      maxInstances: 3,
    });
    expect(Object.isFrozen(apiRuntimeOptions)).toBe(true);
  });
});
