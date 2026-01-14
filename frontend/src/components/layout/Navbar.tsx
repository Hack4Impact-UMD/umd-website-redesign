import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import h4iLogo from '@/components/assets/h4i_files/h4i_logo.svg';

const navLinks = [
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
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (href: string) => {
    if (window.innerWidth <= 1000) {
      setIsMenuOpen(false);
    }
    if (location.pathname === href) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={() => handleNavClick('/')}
          className="flex items-center"
        >
          <img src={h4iLogo} alt="Hack4Impact UMD Logo" className="h-8 w-auto" />
        </Link>

        <ul className="hidden nav:flex items-center gap-8">
          {navLinks.map((link) =>
            link.dropdown ? (
              <li
                key={link.label}
                className="relative"
                onMouseEnter={() => setIsApplyOpen(true)}
                onMouseLeave={() => setIsApplyOpen(false)}
              >
                <Link
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center gap-1 text-body-small text-foreground hover:text-h4i-blue transition-colors"
                >
                  {link.label}
                  <ChevronDown className="h-4 w-4" />
                </Link>
                <div
                  className={cn(
                    'absolute top-full left-0 mt-2 w-40 rounded-md bg-card border border-border shadow-lg transition-all',
                    isApplyOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                  )}
                >
                  <ul className="py-2">
                    {link.dropdown.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          onClick={() => handleNavClick(item.href)}
                          className="block px-4 py-2 text-body-small text-foreground hover:bg-muted hover:text-h4i-blue transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ) : (
              <li key={link.label}>
                <Link
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-body-small text-foreground hover:text-h4i-blue transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            )
          )}
        </ul>

        <button
          className="nav:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm nav:hidden z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-card border-b border-border nav:hidden z-50">
            <ul className="flex flex-col py-4">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <li key={link.label} className="border-b border-border last:border-0">
                    <button
                      onClick={() => setIsApplyOpen(!isApplyOpen)}
                      className="flex w-full items-center justify-between px-6 py-4 text-lg font-heading font-bold text-foreground"
                    >
                      {link.label}
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 transition-transform',
                          isApplyOpen && 'rotate-180'
                        )}
                      />
                    </button>
                    {isApplyOpen && (
                      <ul className="bg-muted">
                        {link.dropdown.map((item) => (
                          <li key={item.label}>
                            <Link
                              to={item.href}
                              onClick={() => handleNavClick(item.href)}
                              className="block px-8 py-3 text-base text-foreground hover:text-h4i-blue"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={link.label} className="border-b border-border last:border-0">
                    <Link
                      to={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className="block px-6 py-4 text-lg font-heading font-bold text-foreground hover:text-h4i-blue"
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </>
      )}
    </header>
  );
}
