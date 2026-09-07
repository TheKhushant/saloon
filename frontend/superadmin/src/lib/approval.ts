// Shared across Services/Products/Offers - the three catalog resources that
// superadmin/admin create and that need explicit approval before a customer
// can see them on the storefront. See ApprovalStatus.java on the backend.
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export const approvalBadgeClass: Record<ApprovalStatus, string> = {
  PENDING: "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-300",
  APPROVED: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  REJECTED: "border-red-500/30 bg-red-500/15 text-red-700 dark:text-red-300",
};

export const approvalLabel: Record<ApprovalStatus, string> = {
  PENDING: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};
