import { Crisp } from './crisp';
import { Tawk } from './tawk';

/**
 * Customer-service chat widgets — renders enabled providers.
 * Config data is passed as props (fetched via the root-route loader).
 */
export function CustomerService({
  crispWebsiteId,
  tawkPropertyId,
  tawkWidgetId,
}: {
  crispWebsiteId?: string;
  tawkPropertyId?: string;
  tawkWidgetId?: string;
}) {
  return (
    <>
      {crispWebsiteId ? <Crisp websiteId={crispWebsiteId} /> : null}
      {tawkPropertyId && tawkWidgetId ? (
        <Tawk propertyId={tawkPropertyId} widgetId={tawkWidgetId} />
      ) : null}
    </>
  );
}
