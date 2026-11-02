export interface PartnerCommissionRecordItem {
  id: string;
  settlementId: string;
  eventId: string;
  sourceType: string;
  sourceRef: string;
  baseAmount: string;
  ratio: string;
  amount: string;
  levelOffset: number;
  status: string;
  computedAt: string;
  createdAt: string;
}
