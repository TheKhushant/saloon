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
