import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { CCSwitchHome } from '@/components/ccswitch-home';

export const Route = createFileRoute('/en/')({
  head: () => ({
    meta: [
      {
        title: 'CC Switch - Unified Management for AI Coding Tools',
      },
      {
        name: 'description',
        content:
          'Manage providers, local routing, MCP servers, Skills, sessions, and usage for Claude Code, Codex, Gemini CLI, OpenCode, OpenClaw, and Hermes.',
      },
    ],
    links: [
      { rel: 'canonical', href: `${envConfigs.app_url}/en` },
      { rel: 'alternate', hrefLang: 'en', href: `${envConfigs.app_url}/en` },
      { rel: 'alternate', hrefLang: 'zh', href: `${envConfigs.app_url}/zh/` },
      {
        rel: 'alternate',
        hrefLang: 'x-default',
        href: `${envConfigs.app_url}/en`,
      },
    ],
  }),
  component: EnglishHome,
});

function EnglishHome() {
  return <CCSwitchHome language="en" />;
}
