import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { PortfolioHome } from '@/components/portfolio-home';

export const Route = createFileRoute('/')({
  head: () => {
    return {
      meta: [
        {
          title: '小小白的个人简历 · A little portfolio',
        },
        {
          name: 'description',
          content: '一份会动的个人简历：项目经历、创作者作品和生活灵感。',
        },
      ],
      links: [{ rel: 'canonical', href: `${envConfigs.app_url}/` }],
    };
  },
  component: PortfolioHome,
});
