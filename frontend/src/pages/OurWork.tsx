import { getContentDocument } from '@/api/content';
import { defaultOurWorkContent, normalizeOurWorkContent } from '@/content/our-work';
import { useApiResource } from '@/hooks';
import OurWorkHeader from '../components/our_work/OurWorkHeader';
import OurWorkProjectLibrary from '../components/our_work/OurWorkProjectLibrary';
import styles from '../styles/our_work/OurWork.module.css';

const loadOurWorkContent = (signal: AbortSignal) => getContentDocument('our-work', signal);

const OurWork = () => {
  const { data, status } = useApiResource(loadOurWorkContent);
  const resolved = status === 'success' ? normalizeOurWorkContent(data) : null;
  const content = resolved?.source === 'hidden' ? null : (resolved?.content ?? defaultOurWorkContent);

  if (!content) {
    return <main aria-label="Our work" />;
  }

  return (
    <main className={styles.page}>
      {status === 'loading' && (
        <p className="sr-only" role="status">Loading current Our Work content.</p>
      )}
      <OurWorkHeader {...content.header} />
      <OurWorkProjectLibrary />
    </main>
  );
};

export default OurWork;
