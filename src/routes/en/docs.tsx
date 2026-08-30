import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { CCSwitchDocs } from '@/components/ccswitch-docs';

export const Route = createFileRoute('/en/docs')({
  head: () => ({
    meta: [
      { title: 'Getting Started - CC Switch Docs' },
      {
        name: 'description',
        content:
          'Learn how CC Switch manages AI coding tool providers, extensions, local routing, high availability, and usage.',
      },
    ],
    links: [
      { rel: 'canonical', href: `${envConfigs.app_url}/en/docs` },
      {
        rel: 'alternate',
        hrefLang: 'en',
        href: `${envConfigs.app_url}/en/docs`,
      },
      {
        rel: 'alternate',
        hrefLang: 'zh',
        href: `${envConfigs.app_url}/zh/docs`,
      },
      {
        rel: 'alternate',
        hrefLang: 'x-default',
        href: `${envConfigs.app_url}/en/docs`,
      },
    ],
  }),
  component: EnglishDocs,
});

function EnglishDocs() {
  return <CCSwitchDocs language="en" />;
}
