import { FireCMSFirebaseApp } from '@firecms/firebase';
import type { FirebaseUserWrapper } from '@firecms/firebase';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { collections } from './collections';
import { firebaseConfig } from './firebaseConfig';
import h4iWordmark from '../../../frontend/src/components/assets/h4iumd_wordmark_blue.png';

const cmsAuthenticator = async ({ user }: { user: FirebaseUserWrapper | null }) => {
  const firebaseUser = user?.firebaseUser;
  if (!firebaseUser) return false;

  const idTokenResult = await firebaseUser.getIdTokenResult(true);
  const role = idTokenResult.claims.role;

  return role === 'admin' || role === 'editor';
};

export default function App() {
  return (
    <FireCMSFirebaseApp
      name="Hack4Impact UMD CMS"
      logo={h4iWordmark}
      firebaseConfig={firebaseConfig}
      collections={collections}
      authenticator={cmsAuthenticator}
      allowSkipLogin={false}
      signInOptions={[GoogleAuthProvider.PROVIDER_ID, EmailAuthProvider.PROVIDER_ID]}
      basePath="/"
      baseCollectionPath="/c"
    />
  );
}
