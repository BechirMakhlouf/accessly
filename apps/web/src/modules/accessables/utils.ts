import type { Accessable, AccessableService } from "./types";
import { getServiceIconUrl } from "./service-icons";

export function getIconUrl(accessable: Accessable): string | null {
  const metadata = accessable.metadata as {
    service?: AccessableService;
    iconUrl?: string;
  } | null;
  if (metadata?.iconUrl) return metadata.iconUrl;
  if (metadata?.service) return getServiceIconUrl(metadata.service);
  if (accessable.url) {
    try {
      const domain = new URL(accessable.url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return null;
    }
  }
  return null;
}
