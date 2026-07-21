import { membersCollection, projectsCollection } from './data';
import { contentAboutCollection } from './content/about';
import { contentApplyNonprofitCollection } from './content/applyNonprofit';
import { contentApplyStudentCollection } from './content/applyStudent';
import { contentHomeCollection } from './content/home';
import { contentOurWorkCollection } from './content/ourWork';
import { contentSiteSettingsCollection } from './content/siteSettings';

export {
  contentAboutCollection,
  contentApplyNonprofitCollection,
  contentApplyStudentCollection,
  contentHomeCollection,
  contentOurWorkCollection,
  contentSiteSettingsCollection,
  membersCollection,
  projectsCollection,
};

export const collections = [
  projectsCollection,
  membersCollection,
  contentHomeCollection,
  contentAboutCollection,
  contentOurWorkCollection,
  contentApplyStudentCollection,
  contentApplyNonprofitCollection,
  contentSiteSettingsCollection,
];
