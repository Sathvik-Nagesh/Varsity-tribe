import Image from 'next/image';

const footerLinks = [
  { label: 'About', href: '#' },
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Contact', href: '#' },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-bg">
      <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6">
        {/* Logo + Tagline */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Image
              src="/logo.png"
              alt="Varsity Tribe"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
            <p className="text-small text-brand-text-secondary">
              A Zerodha Varsity initiative
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-small text-brand-text-secondary transition-colors hover:text-brand-text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-brand-border" />

        {/* Disclaimer */}
        <p className="text-center text-[11px] leading-relaxed text-brand-text-tertiary max-w-2xl mx-auto">
          For educational purposes only — not SEBI-registered financial advice.
        </p>
      </div>
    </footer>
  );
}
