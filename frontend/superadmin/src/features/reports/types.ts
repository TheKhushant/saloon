export interface RevenuePoint {
  date: string;
  revenue: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface NamedCount {
  name: string;
  count: number;
  // Index signature needed so this can be passed to NamedBarChart's generic
  // `data` prop (which needs one for its dynamic nameKey/dataKey access) -
  // TS requires named interfaces to declare this explicitly, unlike plain
  // object literals.
  [key: string]: string | number;
}

export interface ReportSummary {
  totalBookings: number;
  totalRevenue: number;
  avgTicket: number;
  cancellationRate: number;
  revenueTrend: RevenuePoint[];
  bookingsByStatus: StatusCount[];
  topServices: NamedCount[];
  topBarbers: NamedCount[];
}
