import type { LedgerEntryItem } from './ledger-entry-item';
import type { PageInfo } from './page-info';
export interface LedgerEntryListEnvelope {
    code: 0;
    traceId: string;
    data?: {
        items: LedgerEntryItem[];
        pageInfo: PageInfo;
    };
}
//# sourceMappingURL=ledger-entry-list-envelope.d.ts.map