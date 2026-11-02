export interface PartnerCenterItem {
  partnerId: string;
  name: string;
  levelNo: number;
  levelName: string;
  status: string;
  inviteCode: string;
  joinedAt: string | null;
  parentPartnerName: string;
  directTeamSize: string;
  teamSize: string;
  customerCount: string;
  currency: string;
  availableBalance: string;
  frozenBalance: string;
  totalCommission: string;
  withdrawnAmount: string;
  minWithdrawalAmount: string;
}
