import type { PageInfo } from './page-info';
import type { PartnerCommissionRecordItem } from './partner-commission-record-item';

export interface PartnerCommissionRecordListEnvelope {
  code: 0;
  traceId: string;
  data: { items: PartnerCommissionRecordItem[]; pageInfo: PageInfo; };
}
