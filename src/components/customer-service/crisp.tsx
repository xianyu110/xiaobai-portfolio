/**
 * Crisp live chat widget.
 * @see https://docs.crisp.chat/
 */
export function Crisp({ websiteId }: { websiteId: string }) {
  if (!websiteId) return null;
  return (
    <script
      id="crisp-widget"
      async
      dangerouslySetInnerHTML={{
        __html: `window.$crisp=[];window.CRISP_WEBSITE_ID="${websiteId}";(function(){var d=document;var s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`,
      }}
    />
  );
}
