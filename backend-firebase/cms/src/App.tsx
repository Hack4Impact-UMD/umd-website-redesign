import { FireCMSFirebaseApp } from '@firecms/firebase';
import type { FirebaseUserWrapper } from '@firecms/firebase';
import { EmailAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { collections } from './collections';
import { firebaseConfig } from './firebaseConfig';

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
      name="UMD Website CMS"
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
