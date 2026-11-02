import type { PartnerCenterItem } from './partner-center-item';

export interface PartnerCenterEnvelope {
  code: 0;
  traceId: string;
  data: { item: PartnerCenterItem; };
}
