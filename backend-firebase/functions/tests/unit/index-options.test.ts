import { describe, expect, it } from 'vitest';
import { API_REGION } from '../../src/config';
import { apiRuntimeOptions } from '../../src/index';

describe('apiRuntimeOptions', () => {
  it('locks the captured live Gen2 runtime parity settings', () => {
    expect(apiRuntimeOptions).toEqual({
      region: API_REGION,
      memory: '512MiB',
      timeoutSeconds: 60,
      cpu: 1,
      concurrency: 80,
      maxInstances: 3,
    });
    expect(Object.isFrozen(apiRuntimeOptions)).toBe(true);
  });
});
