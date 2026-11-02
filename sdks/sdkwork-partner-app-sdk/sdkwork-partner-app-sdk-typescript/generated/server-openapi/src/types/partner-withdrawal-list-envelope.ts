import type { PageInfo } from './page-info';
import type { PartnerWithdrawalItem } from './partner-withdrawal-item';

export interface PartnerWithdrawalListEnvelope {
  code: 0;
  traceId: string;
  data: { items: PartnerWithdrawalItem[]; pageInfo: PageInfo; };
}
