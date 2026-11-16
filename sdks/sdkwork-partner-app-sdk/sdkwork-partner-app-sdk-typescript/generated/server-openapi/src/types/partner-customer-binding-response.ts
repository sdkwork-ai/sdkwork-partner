import type { PartnerCustomerBindingItem } from './partner-customer-binding-item';

export interface PartnerCustomerBindingResponse {
  code: 0;
  traceId: string;
  data: { item: PartnerCustomerBindingItem; };
}
