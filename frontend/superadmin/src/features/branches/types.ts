export interface Branch {
  _id: string;
  name: string;
  address?: string;
  phone?: string;
  active?: boolean;
}

export interface BranchInput {
  name: string;
  address?: string;
  phone?: string;
  active: boolean;
}
