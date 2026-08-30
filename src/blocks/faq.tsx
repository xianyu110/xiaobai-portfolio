import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQ_KEYS = [
  'stack',
  'payment',
  'database',
  'customize',
  'license',
] as const;

export function FAQ() {
  return (
    <section id="faq" className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-medium tracking-tight sm:text-5xl">
            {m['landing.faq.title']()}
          </h2>
          <p className="text-muted-foreground mt-5">
            {m['landing.faq.description']()}
          </p>
        </div>
        <Accordion className="w-full">
          {FAQ_KEYS.map((key) => (
            <AccordionItem key={key} value={key}>
              <AccordionTrigger className="cursor-pointer py-6 text-left text-base font-medium hover:no-underline">
                {tDynamic(`landing.faq.${key}.question`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                {tDynamic(`landing.faq.${key}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
