import type { PageInfo } from './page-info';
import type { PartnerTeamMemberItem } from './partner-team-member-item';

export interface PartnerTeamListEnvelope {
  code: 0;
  traceId: string;
  data: { items: PartnerTeamMemberItem[]; pageInfo: PageInfo; };
}
