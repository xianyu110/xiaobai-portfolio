import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { buttonVariants } from '@/components/ui/button';
import { DotPattern } from '@/components/ui/dot-pattern';

export function Hero() {
  return (
    <section className="relative isolate flex flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-20 sm:pt-40 sm:pb-32">
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]',
          'text-foreground/15'
        )}
      />
      <div className="relative max-w-3xl space-y-8 text-center">
        <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
          {envConfigs.app_name}
        </p>
        <h1 className="text-foreground font-serif text-5xl leading-[1.1] font-normal tracking-tight sm:text-6xl lg:text-7xl">
          {m['landing.hero.headline']()}
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl">
          {m['landing.hero.subheadline']()}
        </p>

        <div className="flex items-center justify-center gap-3 pt-4">
          <Link
            href="/settings"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-12 gap-2 rounded-full px-8'
            )}
          >
            {m['landing.hero.cta']()}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
