import { describe, expect, it } from "vitest";
import { buildSaasSeed } from "@/data/mockSaasData";
import { collectionsSeries, mrr, mrrAt, mrrBreakdownAt, mrrMovement } from "@/lib/saasStats";

const NOW = Date.UTC(2026, 10, 1, 12);
const store = buildSaasSeed(NOW);

describe("mrrMovement", () => {
  const rows = mrrMovement(store, 12, NOW);

  it("ends on the live MRR", () => {
    expect(rows.at(-1)!.ending).toBeCloseTo(mrr(store), 1);
  });

  it("chains months: each starting MRR equals the previous ending", () => {
    rows.slice(1).forEach((row, i) => expect(row.starting).toBeCloseTo(rows[i]!.ending, 2));
  });

  it("reconciles: starting + new + expansion + contraction + churn = ending", () => {
    rows.forEach((r) => expect(r.starting + r.newMrr + r.expansion + r.contraction + r.churned).toBeCloseTo(r.ending, 1));
    rows.forEach((r) => {
      expect(r.contraction).toBeLessThanOrEqual(0);
      expect(r.churned).toBeLessThanOrEqual(0);
    });
  });

  it("breakdown sums to mrrAt", () => {
    const at = Date.UTC(2026, 5, 15);
    const sum = [...mrrBreakdownAt(store, at).values()].reduce((s, v) => s + v, 0);
    expect(sum).toBeCloseTo(mrrAt(store, at), 1);
  });
});

describe("collectionsSeries", () => {
  it("returns non-negative monthly totals", () => {
    const rows = collectionsSeries(store, 12, NOW);
    expect(rows).toHaveLength(12);
    rows.forEach((r) => [r.collected, r.outstanding, r.refunded].forEach((v) => expect(v).toBeGreaterThanOrEqual(0)));
    expect(rows.some((r) => r.collected > 0)).toBe(true);
  });
});
