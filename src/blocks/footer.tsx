import type { SVGProps } from 'react';

import { m } from '@/paraglide/messages.js';
import {
  SiteFooter,
  type FooterColumn,
  type FooterSocial,
} from '@/components/site-footer';

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54 0-.27-.01-1.15-.02-2.09-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.72.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.56 0-1.23.44-2.24 1.16-3.03-.12-.29-.5-1.44.11-3 0 0 .95-.3 3.1 1.16.9-.25 1.86-.37 2.82-.38.96.01 1.92.13 2.82.38 2.15-1.46 3.1-1.16 3.1-1.16.61 1.56.23 2.71.11 3 .72.79 1.16 1.8 1.16 3.03 0 4.32-2.64 5.27-5.15 5.55.4.35.76 1.03.76 2.08 0 1.5-.01 2.72-.01 3.09 0 .3.2.65.78.54 4.47-1.49 7.68-5.7 7.68-10.67C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function Footer() {
  const columns: FooterColumn[] = [
    {
      title: m['landing.footer.feature'](),
      links: [
        {
          label: m['landing.footer.settings'](),
          href: '/settings',
          external: true,
        },
        { label: m['landing.footer.admin'](), href: '/admin', external: true },
      ],
    },
    {
      title: m['landing.footer.resources'](),
      links: [
        { label: m['landing.footer.blog'](), href: '/blog' },
        {
          label: m['landing.footer.github'](),
          href: 'https://github.com',
          external: true,
        },
      ],
    },
    {
      title: m['landing.footer.legal'](),
      links: [
        { label: m['landing.footer.privacy'](), href: '/privacy-policy' },
        { label: m['landing.footer.terms'](), href: '/terms-of-service' },
      ],
    },
  ];

  const socials: FooterSocial[] = [
    { icon: GithubIcon, href: 'https://github.com', label: 'GitHub' },
    { icon: XIcon, href: 'https://x.com', label: 'X' },
  ];

  return (
    <SiteFooter
      tagline={m['landing.footer.tagline']()}
      columns={columns}
      socials={socials}
    />
  );
}
