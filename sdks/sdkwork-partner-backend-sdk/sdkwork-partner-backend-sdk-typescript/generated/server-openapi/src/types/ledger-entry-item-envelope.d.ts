import type { LedgerEntryItem } from './ledger-entry-item';
export interface LedgerEntryItemEnvelope {
    code: 0;
    traceId: string;
    data?: {
        item: LedgerEntryItem;
    };
}
//# sourceMappingURL=ledger-entry-item-envelope.d.ts.map