export interface SettlementRunResult {
    /** Events processed in the batch. */
    processed: string;
    /** Events settled with distributions. */
    settled: string;
    /** Events skipped (no active binding or no allocation). */
    skipped: string;
    /** Events that failed during settlement. */
    failed: string;
}
//# sourceMappingURL=settlement-run-result.d.ts.map