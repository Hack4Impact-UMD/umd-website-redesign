import h4iLogo from '@/components/assets/h4i_files/h4i_logo.svg';
import type { SiteSettings } from './types';

export const defaultSiteSettings: SiteSettings = {
  navbar: {
    links: [
      { label: 'About Us', href: '/aboutus' },
      { label: 'Our Work', href: '/ourwork' },
      {
        label: 'Apply',
        href: '/apply/student',
        dropdown: [
          { label: 'For Students', href: '/apply/student' },
          { label: 'For Nonprofits', href: '/apply/nonprofit' },
        ],
      },
      { label: 'Contact Us', href: '/contactus' },
    ],
  },
  footer: {
    newsletterPrompt: 'Follow our verified social channels for chapter and project updates.',
    exploreLinks: [
      { label: 'About Us', href: '/aboutus' },
      { label: 'Our Work', href: '/ourwork' },
      { label: 'Contact Us', href: '/contactus' },
      { label: 'TerpLink', href: 'https://terplink.umd.edu/organization/hack4impact' },
    ],
    applyLinks: [
      { label: 'For Students', href: '/apply/student' },
      { label: 'For Nonprofits', href: '/apply/nonprofit' },
    ],
    socialLinks: [
      { label: 'Instagram', href: 'https://instagram.com/hack4impactumd', icon: 'Instagram' },
      { label: 'GitHub', href: 'https://github.com/Hack4Impact-UMD', icon: 'Github' },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/hack4impact-umd', icon: 'Linkedin' },
      { label: 'Facebook', href: 'https://facebook.com/hack4impactumd', icon: 'Facebook' },
    ],
    contact: {
      addressLines: ['7809 Regents Drive', 'College Park, MD 20742'],
      email: 'umd@hack4impact.org',
    },
  },
  branding: { logo: h4iLogo },
};
