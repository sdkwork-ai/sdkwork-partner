export interface PartnerCustomerBindingItem {
  id: string;
  partnerId: string;
  customerUserId: string;
  bindingType: string;
  status: string;
  boundAt: string;
  boundBy: string;
  unboundAt?: string | null;
  unboundBy?: string | null;
  createdAt: string;
}
