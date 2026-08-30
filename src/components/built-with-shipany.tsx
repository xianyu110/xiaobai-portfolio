import { envConfigs } from '@/config';
import { cn } from '@/lib/utils';

function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function BuiltWithShipAny({ className }: { className?: string }) {
  const utm = encodeURIComponent(getHostname(envConfigs.app_url));
  const href = `https://shipany.ai/?utm_source=${utm}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-3.5 py-1.5 text-sm font-medium text-neutral-100 transition-colors hover:border-neutral-500 hover:bg-neutral-800',
        className
      )}
    >
      <span>Built with</span>
      <span aria-hidden className="text-red-500">
        ❤️
      </span>
      <span>ShipAny</span>
    </a>
  );
}
