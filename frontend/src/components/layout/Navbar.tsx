import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import h4iLogo from '@/components/assets/h4i_files/h4i_logo.svg';
import { defaultSiteSettings, type SiteSettings } from '@/content/site-settings';
import { resolveMediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';

type SiteLinkProps = {
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaHasPopup?: boolean;
  children: ReactNode;
  className?: string;
  href: string;
  onClick?: () => void;
  current?: boolean;
};

const SiteLink = ({
  ariaControls,
  ariaExpanded,
  ariaHasPopup,
  children,
  className,
  href,
  onClick,
  current,
}: SiteLinkProps) => {
  const sharedProps = {
    className,
    onClick,
    'aria-current': current ? ('page' as const) : undefined,
    'aria-controls': ariaControls,
    'aria-expanded': ariaExpanded,
    'aria-haspopup': ariaHasPopup ? ('true' as const) : undefined,
  };

  return href.startsWith('/') ? (
    <Link to={href} {...sharedProps}>{children}</Link>
  ) : (
    <a href={href} {...sharedProps}>{children}</a>
  );
};

const isCurrentPath = (pathname: string, href: string) =>
  href.startsWith('/') && (pathname === href || pathname.startsWith(`${href}/`));

interface NavbarProps {
  settings?: SiteSettings;
}

export default function Navbar({ settings = defaultSiteSettings }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const logo = resolveMediaUrl(settings.branding.logo) || h4iLogo;

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || (!isMenuOpen && !openDropdown)) return;
      setIsMenuOpen(false);
      setOpenDropdown(null);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [isMenuOpen, openDropdown]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    if (location.pathname === href) window.scrollTo(0, 0);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-[0_1px_2px_1px_rgba(0,0,0,0.1)]">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-24"
      >
        <Link to="/" onClick={() => handleNavClick('/')} className="flex shrink-0 items-center">
          <img
            src={logo}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = h4iLogo;
            }}
            alt="Hack4Impact UMD"
            className="h-[27px] w-auto max-w-[203px]"
          />
        </Link>

        <ul className="hidden items-center gap-10 nav:flex">
          {settings.navbar.links.map((link, index) => {
            const active = isCurrentPath(location.pathname, link.href) ||
              link.dropdown?.some((item) => isCurrentPath(location.pathname, item.href));
            const dropdownId = `desktop-nav-dropdown-${index}`;
            const expanded = openDropdown === link.href;
            return (
              <li
                key={`${link.label}-${link.href}`}
                className="relative"
                onMouseEnter={() => link.dropdown && setOpenDropdown(link.href)}
                onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
                onFocus={() => link.dropdown && setOpenDropdown(link.href)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setOpenDropdown(null);
                }}
              >
                <SiteLink
                  ariaControls={link.dropdown ? dropdownId : undefined}
                  ariaExpanded={link.dropdown ? expanded : undefined}
                  ariaHasPopup={Boolean(link.dropdown)}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  current={Boolean(active)}
                  className={cn(
                    'flex items-center gap-1 rounded-sm py-2 text-label font-bold text-foreground transition-colors hover:text-h4i-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-4',
                    active && 'text-h4i-blue',
                  )}
                >
                  {link.label}
                  {link.dropdown && (
                    <ChevronDown
                      aria-hidden="true"
                      className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
                    />
                  )}
                </SiteLink>
                {link.dropdown && expanded && (
                  <ul
                    id={dropdownId}
                    aria-label={`${link.label} links`}
                    className="absolute right-0 top-full w-48 rounded-md border border-border bg-card py-2 shadow-lg"
                  >
                    {link.dropdown.map((item) => (
                      <li key={`${item.label}-${item.href}`}>
                        <SiteLink
                          href={item.href}
                          onClick={() => handleNavClick(item.href)}
                          current={isCurrentPath(location.pathname, item.href)}
                          className="block px-4 py-2 text-body-small text-foreground transition-colors hover:bg-muted hover:text-h4i-blue focus-visible:bg-muted focus-visible:text-h4i-blue focus-visible:outline-none"
                        >
                          {item.label}
                        </SiteLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>

        <button
          ref={menuButtonRef}
          type="button"
          className="rounded-md p-2 text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue nav:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
        </button>
      </nav>

      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close navigation menu"
            className="fixed inset-x-0 bottom-0 top-[68px] z-40 bg-black/20 backdrop-blur-sm nav:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div id="mobile-navigation" className="absolute left-0 right-0 top-full z-50 border-b border-border bg-card shadow-lg nav:hidden">
            <ul className="flex max-h-[calc(100vh-68px)] flex-col overflow-y-auto py-2">
              {settings.navbar.links.map((link, index) => {
                const dropdownId = `mobile-nav-dropdown-${index}`;
                const expanded = openDropdown === link.href;
                const active = isCurrentPath(location.pathname, link.href) ||
                  link.dropdown?.some((item) => isCurrentPath(location.pathname, item.href));
                return (
                  <li key={`${link.label}-${link.href}`} className="border-b border-border last:border-0">
                    <div className="flex items-center">
                      <SiteLink
                        href={link.href}
                        onClick={() => handleNavClick(link.href)}
                        current={Boolean(active)}
                        className={cn(
                          'flex-1 px-6 py-4 text-lg font-bold text-foreground hover:text-h4i-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-h4i-blue',
                          active && 'text-h4i-blue',
                        )}
                      >
                        {link.label}
                      </SiteLink>
                      {link.dropdown && (
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(expanded ? null : link.href)}
                          className="mr-4 rounded-md p-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue"
                          aria-expanded={expanded}
                          aria-controls={dropdownId}
                          aria-label={`${expanded ? 'Close' : 'Open'} ${link.label} submenu`}
                        >
                          <ChevronDown aria-hidden="true" className={cn('h-5 w-5 transition-transform', expanded && 'rotate-180')} />
                        </button>
                      )}
                    </div>
                    {link.dropdown && expanded && (
                      <ul id={dropdownId} aria-label={`${link.label} links`} className="bg-muted py-1">
                        {link.dropdown.map((item) => (
                          <li key={`${item.label}-${item.href}`}>
                            <SiteLink
                              href={item.href}
                              onClick={() => handleNavClick(item.href)}
                              current={isCurrentPath(location.pathname, item.href)}
                              className="block px-8 py-3 text-base text-foreground hover:text-h4i-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-h4i-blue"
                            >
                              {item.label}
                            </SiteLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
