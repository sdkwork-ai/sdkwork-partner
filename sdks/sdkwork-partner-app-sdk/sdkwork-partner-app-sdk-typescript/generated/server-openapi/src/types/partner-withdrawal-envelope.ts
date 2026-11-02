import type { PartnerWithdrawalItem } from './partner-withdrawal-item';

export interface PartnerWithdrawalEnvelope {
  code: 0;
  traceId: string;
  data: { item: PartnerWithdrawalItem; };
}
