import { toPublicMediaUrl } from '../utils/media';
import { toIsoDateTimeString } from '../utils/date';

const normalizeHome = (data: any): any => {
  if (!data || typeof data !== 'object') return data;

  const heroSlides = Array.isArray(data.hero?.slides)
    ? data.hero.slides.map((slide: any) => ({
        ...slide,
        image: toPublicMediaUrl(slide?.image),
      }))
    : data.hero?.slides;

  const sponsorTiers = Array.isArray(data.sponsors?.tiers)
    ? data.sponsors.tiers.map((tier: any) => ({
        ...tier,
        sponsors: Array.isArray(tier?.sponsors)
          ? tier.sponsors.map((sponsor: any) => ({
              ...sponsor,
              logo: toPublicMediaUrl(sponsor?.logo),
            }))
          : tier?.sponsors,
      }))
    : data.sponsors?.tiers;

  return {
    ...data,
    hero: data.hero
      ? {
          ...data.hero,
          slides: heroSlides,
        }
      : data.hero,
    sponsors: data.sponsors
      ? {
          ...data.sponsors,
          tiers: sponsorTiers,
        }
      : data.sponsors,
  };
};

const normalizeAbout = (data: any): any => {
  if (!data || typeof data !== 'object') return data;

  const valueItems = Array.isArray(data.values?.items)
    ? data.values.items.map((item: any) => ({
        ...item,
        image: toPublicMediaUrl(item?.image),
      }))
    : data.values?.items;

  return {
    ...data,
    header: data.header
      ? {
          ...data.header,
          image: toPublicMediaUrl(data.header.image),
        }
      : data.header,
    values: data.values
      ? {
          ...data.values,
          items: valueItems,
        }
      : data.values,
  };
};

const normalizeOurWork = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  return {
    ...data,
    header: data.header
      ? {
          ...data.header,
          image: toPublicMediaUrl(data.header.image),
        }
      : data.header,
  };
};

const normalizeApplyStudent = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  return {
    ...data,
    hero: data.hero
      ? {
          ...data.hero,
          image: toPublicMediaUrl(data.hero.image),
        }
      : data.hero,
    intro: data.intro
      ? {
          ...data.intro,
          image: toPublicMediaUrl(data.intro.image),
        }
      : data.intro,
  };
};

const normalizeApplyNonprofit = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  return {
    ...data,
    hero: data.hero
      ? {
          ...data.hero,
          image: toPublicMediaUrl(data.hero.image),
        }
      : data.hero,
    intro: data.intro
      ? {
          ...data.intro,
          image: toPublicMediaUrl(data.intro.image),
        }
      : data.intro,
  };
};

const normalizeSiteSettings = (data: any): any => {
  if (!data || typeof data !== 'object') return data;
  return {
    ...data,
    branding: data.branding
      ? {
          ...data.branding,
          logo: toPublicMediaUrl(data.branding.logo),
        }
      : data.branding,
  };
};

const normalizeByContentKey = (contentKey: string, data: any): any => {
  switch (contentKey) {
    case 'home':
      return normalizeHome(data);
    case 'about':
      return normalizeAbout(data);
    case 'our-work':
      return normalizeOurWork(data);
    case 'apply/student':
      return normalizeApplyStudent(data);
    case 'apply/nonprofit':
      return normalizeApplyNonprofit(data);
    case 'site-settings':
      return normalizeSiteSettings(data);
    default:
      return data;
  }
};

export const normalizeContentMedia = (contentKey: string, data: any): any => {
  if (!data || typeof data !== 'object') return data;

  if ('payload' in data && data.payload && typeof data.payload === 'object') {
    return {
      ...data,
      verifiedAt: toIsoDateTimeString(data.verifiedAt),
      payload: normalizeByContentKey(contentKey, data.payload),
    };
  }

  if ('mode' in data) {
    return {
      ...data,
      verifiedAt: toIsoDateTimeString(data.verifiedAt),
    };
  }

  return normalizeByContentKey(contentKey, data);
};
