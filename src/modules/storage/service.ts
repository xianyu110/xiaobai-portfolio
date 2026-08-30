import { R2Provider, StorageManager } from '@/core/storage';
import { getAllConfigs, type ConfigMap } from '@/modules/config/service';

/**
 * Storage config is DB-driven (like auth/payment/email): values come from the
 * admin "Storage" settings, merged over env via getAllConfigs(). Keys mirror the
 * original ShipAny Two (`r2_*`).
 */
function isConfigured(configs: ConfigMap): boolean {
  return Boolean(
    configs.r2_access_key && configs.r2_secret_key && configs.r2_bucket_name
  );
}

function buildManager(configs: ConfigMap): StorageManager {
  const manager = new StorageManager();
  manager.addProvider(
    new R2Provider({
      accountId: configs.r2_account_id || '',
      accessKeyId: configs.r2_access_key as string,
      secretAccessKey: configs.r2_secret_key as string,
      bucket: configs.r2_bucket_name as string,
      uploadPath: configs.r2_upload_path,
      region: 'auto',
      endpoint: configs.r2_endpoint, // optional custom endpoint
      publicDomain: configs.r2_domain,
    }),
    true
  );
  return manager;
}

export async function isStorageConfigured(): Promise<boolean> {
  return isConfigured(await getAllConfigs());
}

/**
 * Returns a configured StorageManager, or null when storage is not configured
 * (caller should fall back to local/inline handling).
 */
export async function getStorage(): Promise<StorageManager | null> {
  const configs = await getAllConfigs();
  if (!isConfigured(configs)) return null;
  return buildManager(configs);
}
