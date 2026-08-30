import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { buttonVariants } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="px-4 pb-24 sm:pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-dashed px-6 py-12 text-center sm:px-10 sm:py-16">
          <h2 className="mx-auto max-w-3xl font-serif text-4xl leading-[1.1] font-medium tracking-tight sm:text-5xl lg:text-5xl">
            {m['landing.cta.headline']()}
          </h2>
          <p className="text-muted-foreground mx-auto mt-6 max-w-4xl text-base leading-relaxed sm:text-lg">
            {m['landing.cta.subheadline']()}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/settings"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-12 gap-2 rounded-full px-8'
              )}
            >
              {m['landing.cta.button']()}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
