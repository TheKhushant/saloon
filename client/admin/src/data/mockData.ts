export interface Vendor {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  status: "Active" | "Paused" | "Disabled";
  branches: number;
}

export interface Branch {
  id: string;
  vendorId: string;
  name: string;
  city: string;
  address: string;
  contactNumber: string;
  status: "Active" | "Paused" | "Disabled";
}

export interface Booking {
  id: string;
  customerName: string;
  vendor: string;
  branch: string;
  service: string;
  date: string;
  time: string;
  status: "Confirmed" | "Completed" | "Cancelled" | "Pending";
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalBookings: number;
  lastBooking: string;
}

export interface Template {
  id: string;
  name: string;
  preview: string;
  status: "Active" | "Disabled";
}

export interface HostEntry {
  id: string;
  vendorId: string;
  branchId: string;
  assignedTemplate: string;
  hostingStatus: "Active" | "Paused" | "Disabled";
}

export const vendors: Vendor[] = [
  { id: "V001", name: "Glow Beauty Salon", ownerName: "Sarah Ahmed", phone: "+971501234567", email: "sarah@glowbeauty.com", status: "Active", branches: 3 },
  { id: "V002", name: "Luxe Hair Studio", ownerName: "Fatima Khan", phone: "+971502345678", email: "fatima@luxehair.com", status: "Active", branches: 2 },
  { id: "V003", name: "Serenity Spa", ownerName: "Aisha Malik", phone: "+971503456789", email: "aisha@serenityspa.com", status: "Paused", branches: 1 },
  { id: "V004", name: "The Nail Bar", ownerName: "Layla Hassan", phone: "+971504567890", email: "layla@nailbar.com", status: "Active", branches: 4 },
  { id: "V005", name: "Radiance Salon", ownerName: "Noura Ali", phone: "+971505678901", email: "noura@radiance.com", status: "Disabled", branches: 1 },
  { id: "V006", name: "Belle Beauty", ownerName: "Mariam Omar", phone: "+971506789012", email: "mariam@bellebeauty.com", status: "Active", branches: 2 },
  { id: "V007", name: "Crown & Glory", ownerName: "Huda Salim", phone: "+971507890123", email: "huda@crownglory.com", status: "Active", branches: 1 },
  { id: "V008", name: "Pearl Aesthetics", ownerName: "Reem Nasser", phone: "+971508901234", email: "reem@pearl.com", status: "Paused", branches: 2 },
];

export const branches: Branch[] = [
  { id: "B001", vendorId: "V001", name: "Glow Downtown", city: "Dubai", address: "Downtown Blvd, Tower 3", contactNumber: "+971501111111", status: "Active" },
  { id: "B002", vendorId: "V001", name: "Glow Marina", city: "Dubai", address: "Marina Walk, Unit 5", contactNumber: "+971501111112", status: "Active" },
  { id: "B003", vendorId: "V001", name: "Glow JBR", city: "Dubai", address: "JBR, The Walk", contactNumber: "+971501111113", status: "Paused" },
  { id: "B004", vendorId: "V002", name: "Luxe Mall of Emirates", city: "Dubai", address: "Mall of Emirates, Level 2", contactNumber: "+971502222221", status: "Active" },
  { id: "B005", vendorId: "V002", name: "Luxe Abu Dhabi", city: "Abu Dhabi", address: "Corniche Road", contactNumber: "+971502222222", status: "Active" },
  { id: "B006", vendorId: "V003", name: "Serenity Palm", city: "Dubai", address: "Palm Jumeirah, Crescent", contactNumber: "+971503333331", status: "Paused" },
  { id: "B007", vendorId: "V004", name: "Nail Bar City Walk", city: "Dubai", address: "City Walk, Block 4", contactNumber: "+971504444441", status: "Active" },
  { id: "B008", vendorId: "V004", name: "Nail Bar Sharjah", city: "Sharjah", address: "Sahara Centre", contactNumber: "+971504444442", status: "Active" },
];

export const bookings: Booking[] = [
  { id: "BK001", customerName: "Mona Al Rashid", vendor: "Glow Beauty Salon", branch: "Glow Downtown", service: "Hair Color", date: "2026-03-10", time: "10:00", status: "Confirmed" },
  { id: "BK002", customerName: "Dana Ibrahim", vendor: "Luxe Hair Studio", branch: "Luxe Mall of Emirates", service: "Blowout", date: "2026-03-10", time: "11:30", status: "Confirmed" },
  { id: "BK003", customerName: "Salma Youssef", vendor: "The Nail Bar", branch: "Nail Bar City Walk", service: "Gel Manicure", date: "2026-03-10", time: "14:00", status: "Pending" },
  { id: "BK004", customerName: "Rania Khouri", vendor: "Glow Beauty Salon", branch: "Glow Marina", service: "Facial", date: "2026-03-09", time: "09:00", status: "Completed" },
  { id: "BK005", customerName: "Hala Mansour", vendor: "Belle Beauty", branch: "Belle Al Quoz", service: "Bridal Makeup", date: "2026-03-09", time: "08:00", status: "Completed" },
  { id: "BK006", customerName: "Noor Saeed", vendor: "Crown & Glory", branch: "Crown DIFC", service: "Keratin Treatment", date: "2026-03-08", time: "13:00", status: "Cancelled" },
  { id: "BK007", customerName: "Yasmin Farouk", vendor: "Glow Beauty Salon", branch: "Glow JBR", service: "Highlights", date: "2026-03-10", time: "15:30", status: "Confirmed" },
  { id: "BK008", customerName: "Lina Barakat", vendor: "Serenity Spa", branch: "Serenity Palm", service: "Deep Tissue Massage", date: "2026-03-10", time: "16:00", status: "Pending" },
  { id: "BK009", customerName: "Amira Taha", vendor: "The Nail Bar", branch: "Nail Bar Sharjah", service: "Pedicure", date: "2026-03-07", time: "12:00", status: "Completed" },
  { id: "BK010", customerName: "Jumana Fares", vendor: "Luxe Hair Studio", branch: "Luxe Abu Dhabi", service: "Hair Extensions", date: "2026-03-10", time: "10:30", status: "Confirmed" },
];

export const customers: Customer[] = [
  { id: "C001", name: "Mona Al Rashid", phone: "+971551234567", email: "mona@email.com", totalBookings: 12, lastBooking: "2026-03-10" },
  { id: "C002", name: "Dana Ibrahim", phone: "+971552345678", email: "dana@email.com", totalBookings: 8, lastBooking: "2026-03-10" },
  { id: "C003", name: "Salma Youssef", phone: "+971553456789", email: "salma@email.com", totalBookings: 5, lastBooking: "2026-03-10" },
  { id: "C004", name: "Rania Khouri", phone: "+971554567890", email: "rania@email.com", totalBookings: 15, lastBooking: "2026-03-09" },
  { id: "C005", name: "Hala Mansour", phone: "+971555678901", email: "hala@email.com", totalBookings: 3, lastBooking: "2026-03-09" },
  { id: "C006", name: "Noor Saeed", phone: "+971556789012", email: "noor@email.com", totalBookings: 7, lastBooking: "2026-03-08" },
  { id: "C007", name: "Yasmin Farouk", phone: "+971557890123", email: "yasmin@email.com", totalBookings: 20, lastBooking: "2026-03-10" },
  { id: "C008", name: "Lina Barakat", phone: "+971558901234", email: "lina@email.com", totalBookings: 2, lastBooking: "2026-03-10" },
];

export const templates: Template[] = [
  { id: "T001", name: "Classic Elegance", preview: "/placeholder.svg", status: "Active" },
  { id: "T002", name: "Modern Minimal", preview: "/placeholder.svg", status: "Active" },
  { id: "T003", name: "Bold & Vibrant", preview: "/placeholder.svg", status: "Active" },
  { id: "T004", name: "Luxury Gold", preview: "/placeholder.svg", status: "Disabled" },
  { id: "T005", name: "Natural Organic", preview: "/placeholder.svg", status: "Active" },
];

export const hostEntries: HostEntry[] = [
  { id: "H001", vendorId: "V001", branchId: "B001", assignedTemplate: "Classic Elegance", hostingStatus: "Active" },
  { id: "H002", vendorId: "V001", branchId: "B002", assignedTemplate: "Classic Elegance", hostingStatus: "Active" },
  { id: "H003", vendorId: "V002", branchId: "B004", assignedTemplate: "Modern Minimal", hostingStatus: "Active" },
  { id: "H004", vendorId: "V003", branchId: "B006", assignedTemplate: "Bold & Vibrant", hostingStatus: "Paused" },
  { id: "H005", vendorId: "V004", branchId: "B007", assignedTemplate: "Luxury Gold", hostingStatus: "Active" },
];

export const bookingsPerDay = [
  { day: "Mon", bookings: 18 },
  { day: "Tue", bookings: 24 },
  { day: "Wed", bookings: 32 },
  { day: "Thu", bookings: 28 },
  { day: "Fri", bookings: 45 },
  { day: "Sat", bookings: 52 },
  { day: "Sun", bookings: 15 },
];

export const topServices = [
  { name: "Hair Color", count: 156 },
  { name: "Blowout", count: 132 },
  { name: "Gel Manicure", count: 118 },
  { name: "Facial", count: 95 },
  { name: "Bridal Makeup", count: 78 },
  { name: "Keratin Treatment", count: 64 },
  { name: "Massage", count: 52 },
];

export const activeVendorsChart = [
  { name: "Glow Beauty", bookings: 89 },
  { name: "Luxe Hair", bookings: 72 },
  { name: "The Nail Bar", bookings: 65 },
  { name: "Belle Beauty", bookings: 48 },
  { name: "Crown & Glory", bookings: 34 },
];
