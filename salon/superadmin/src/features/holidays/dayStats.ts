// Deterministic mock stats for a given date + branch, used to power the
// holiday calendar's day drill-down (customers, offers, products sold,
// total sales, expenses, and profit/loss). Same date+branch always produces
// the same numbers, so the UI doesn't jitter between renders even though
// there's no real backend yet.

function hashStringToInt(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export interface BranchDayStats {
  branchId: string;
  branchName: string;
  customers: number;
  offers: number;
  productsSold: number;
  totalAmount: number;
  expenses: number;
  profit: number;
}

export function getBranchDayStats(
  dateIso: string,
  branch: { _id: string; name: string }
): BranchDayStats {
  const rand = seededRandom(hashStringToInt(`${dateIso}:${branch._id}`));
  const customers = Math.floor(rand() * 40) + 4; // 4-43
  const offers = Math.floor(rand() * 6); // 0-5
  const productsSold = Math.floor(rand() * 22); // 0-21
  const avgBill = 320 + rand() * 680; // ~320-1000
  const totalAmount = Math.round(customers * avgBill);
  // Fixed daily overhead (staff, rent, utilities) plus a variable cost
  // proportional to revenue (products/materials used).
  const fixedOverhead = 2500 + rand() * 1500; // ~2500-4000
  const variableCostRate = 0.35 + rand() * 0.15; // 35-50% of revenue
  const expenses = Math.round(fixedOverhead + totalAmount * variableCostRate);
  const profit = totalAmount - expenses;
  return { branchId: branch._id, branchName: branch.name, customers, offers, productsSold, totalAmount, expenses, profit };
}

export function getDayStatsForBranches(
  dateIso: string,
  branches: { _id: string; name: string }[]
): BranchDayStats[] {
  return branches.map((b) => getBranchDayStats(dateIso, b));
}
