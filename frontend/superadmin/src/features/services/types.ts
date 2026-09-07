// import type { ApprovalStatus } from "@/lib/approval";

// export interface Service {
//   _id: string;
//   name: string;
//   category?: string;
//   durationMinutes: number;
//   price: number;
//   active: boolean;
//   /** Set by a branch admin/superadmin via the approve/reject actions below.
//    *  Only APPROVED (and active) services reach the customer-facing app. */
//   approvalStatus: ApprovalStatus;
//   description?: string;
//   /** Branch this service is offered at. Omitted/undefined means "all branches". */
//   branchId?: string;
// }

// export interface ServiceInput {
//   name: string;
//   category?: string;
//   durationMinutes: number;
//   price: number;
//   active: boolean;
//   description?: string;
//   branchId?: string;
// }
import type { ApprovalStatus } from "@/lib/approval";

export interface Service {
  _id: string;
  name: string;
  category?: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  /** Set by a branch admin/superadmin via the approve/reject actions below.
   *  Only APPROVED (and active) services reach the customer-facing app. */
  approvalStatus: ApprovalStatus;
  description?: string;
  /** Branch this service is offered at. Omitted/undefined means "all branches". */
  branchId?: string;
  image?: string;
}

export interface ServiceInput {
  name: string;
  category?: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  description?: string;
  branchId?: string;
  image?: string;
}