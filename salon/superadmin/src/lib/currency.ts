/**
 * Formats a number as Indian Rupees with Indian digit grouping
 * (e.g. 123456.5 -> "₹1,23,456.50").
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}
