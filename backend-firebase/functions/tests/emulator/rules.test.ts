import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { deleteObject, ref, uploadBytes } from 'firebase/storage';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';

let environment: RulesTestEnvironment;

beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'demo-umd-website-rules',
    firestore: {
      rules: readFileSync(
        fileURLToPath(new URL('../../../firestore.rules', import.meta.url)),
        'utf8',
      ),
    },
    storage: {
      rules: readFileSync(
        fileURLToPath(new URL('../../../storage.rules', import.meta.url)),
        'utf8',
      ),
    },
  });
});

beforeEach(async () => environment.clearFirestore());
afterAll(async () => environment.cleanup());

describe('Firestore CMS roles', () => {
  it('denies unauthenticated and ordinary users', async () => {
    await assertFails(getDoc(doc(environment.unauthenticatedContext().firestore(), 'projects', '1')));
    await assertFails(
      setDoc(doc(environment.authenticatedContext('user').firestore(), 'projects', '1'), { title: 'No' }),
    );
  });

  it.each(['admin', 'editor'])('allows %s CRUD except relation-bearing deletes', async (role) => {
    const firestore = environment.authenticatedContext(role, { role }).firestore();
    const project = doc(firestore, 'projects', '1');
    const content = doc(firestore, 'content_home', 'main');
    await assertSucceeds(setDoc(project, { title: 'Allowed' }));
    await assertSucceeds(getDoc(project));
    await assertFails(deleteDoc(project));
    await assertSucceeds(setDoc(content, { heading: 'Allowed' }));
    await assertSucceeds(deleteDoc(content));
  });
});

describe('Storage CMS roles and image constraints', () => {
  it('allows role-bearing image uploads and deletes under supported roots', async () => {
    const storage = environment.authenticatedContext('editor', { role: 'editor' }).storage();
    const image = ref(storage, 'projects/1/image.png');
    await assertSucceeds(uploadBytes(image, new Uint8Array([1]), { contentType: 'image/png' }));
    await assertSucceeds(deleteObject(image));
  });

  it('rejects missing roles, unsupported roots, non-images, and oversized uploads', async () => {
    const userStorage = environment.authenticatedContext('user').storage();
    await assertFails(
      uploadBytes(ref(userStorage, 'projects/1/image.png'), new Uint8Array([1]), { contentType: 'image/png' }),
    );

    const storage = environment.authenticatedContext('admin', { role: 'admin' }).storage();
    await assertFails(
      uploadBytes(ref(storage, 'private/image.png'), new Uint8Array([1]), { contentType: 'image/png' }),
    );
    await assertFails(
      uploadBytes(ref(storage, 'members/1/file.txt'), new Uint8Array([1]), { contentType: 'text/plain' }),
    );
    await assertFails(
      uploadBytes(
        ref(storage, 'content/home/too-large.png'),
        new Uint8Array(10 * 1024 * 1024 + 1),
        { contentType: 'image/png' },
      ),
    );
  });
});
