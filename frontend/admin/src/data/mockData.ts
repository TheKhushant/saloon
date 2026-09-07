export interface Branch {
  id: string;
  branch_name: string;
  city: string;
  address: string;
  contact_number: string;
  status: "active" | "paused" | "disabled";
}

export interface Booking {
  id: string;
  customerName: string;
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
  totalSpent: number;
  active: boolean;
  notes?: string;
  /** Customer's home branch; unset = visits any branch. */
  branchId?: string;
}

export type ProductCategory = "Face Care" | "Hair Care" | "Body Care" | "Beard Care" | "Tools";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  image: string;
  active: boolean;
  description?: string;
  assignedBranchIds?: string[];
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
}

// export const branches: Branch[] = [
//   { id: "B001", branch_name: "Shankar Nagar", city: "Nagpur", address: "Shankar Nagar Square, Nagpur", contact_number: "+919811111111", status: "active" },
//   { id: "B002", branch_name: "Hingna", city: "Nagpur", address: "Hingna Road, Nagpur", contact_number: "+919811111112", status: "active" },
//   { id: "B003", branch_name: "Sadar", city: "Nagpur", address: "Sadar, Nagpur", contact_number: "+919811111113", status: "active" },
//   { id: "B004", branch_name: "Mahal Chowk", city: "Nagpur", address: "Mahal Chowk, Nagpur", contact_number: "+919811111114", status: "active" },
// ];

export const menSalonServices = [
  "Haircut",
  "Beard Trim",
  "Hot Towel Shave",
  "Hair Color",
  "Head Massage",
  "Kids Haircut",
  "Hair Spa",
  "Skin Fade",
  "Facial for Men",
  "Mustache Trim",
];

export interface Service {
  id: string;
  name: string;
  category?: string;
  durationMinutes: number;
  price: number;
  active: boolean;
  description?: string;
  /** Branch this service is offered at. Undefined means "all branches". */
  branchId?: string;
}

// export const services: Service[] = [
//   { id: "SV001", name: "Haircut", category: "Hair", durationMinutes: 30, price: 149, active: true },
//   { id: "SV002", name: "Beard Trim", category: "Beard", durationMinutes: 15, price: 99, active: true },
//   { id: "SV003", name: "Hot Towel Shave", category: "Beard", durationMinutes: 25, price: 149, active: true },
//   { id: "SV004", name: "Hair Color", category: "Hair", durationMinutes: 45, price: 399, active: true },
//   { id: "SV005", name: "Head Massage", category: "Spa", durationMinutes: 20, price: 199, active: true },
//   { id: "SV006", name: "Kids Haircut", category: "Hair", durationMinutes: 20, price: 99, active: true },
//   { id: "SV007", name: "Hair Spa", category: "Spa", durationMinutes: 40, price: 349, active: true },
//   { id: "SV008", name: "Skin Fade", category: "Hair", durationMinutes: 35, price: 199, active: true, branchId: "B001" },
//   { id: "SV009", name: "Facial for Men", category: "Skin", durationMinutes: 30, price: 299, active: true, branchId: "B003" },
//   { id: "SV010", name: "Mustache Trim", category: "Beard", durationMinutes: 10, price: 49, active: true },
// ];

export interface Barber {
  id: string;
  name: string;
  phone: string;
  email?: string;
  specialties?: string[];
  active: boolean;
  branchId: string;
}

// export const barbers: Barber[] = [
//   { id: "BR001", name: "Ramesh Kadam", phone: "+919822001001", specialties: ["Haircut", "Skin Fade"], active: true, branchId: "B001" },
//   { id: "BR002", name: "Suraj Bhoyar", phone: "+919822001002", specialties: ["Beard Trim", "Hot Towel Shave"], active: true, branchId: "B001" },
//   { id: "BR003", name: "Amit Ingle", phone: "+919822001003", specialties: ["Haircut", "Hair Color"], active: true, branchId: "B002" },
//   { id: "BR004", name: "Vinod Chaudhary", phone: "+919822001004", specialties: ["Head Massage", "Hair Spa"], active: true, branchId: "B002" },
//   { id: "BR005", name: "Deepak Sahare", phone: "+919822001005", specialties: ["Haircut", "Beard Trim"], active: true, branchId: "B003" },
//   { id: "BR006", name: "Manoj Thakre", phone: "+919822001006", specialties: ["Facial for Men", "Skin Fade"], active: false, branchId: "B003" },
//   { id: "BR007", name: "Pravin Gaikwad", phone: "+919822001007", specialties: ["Haircut", "Kids Haircut"], active: true, branchId: "B004" },
//   { id: "BR008", name: "Sachin Rahangdale", phone: "+919822001008", specialties: ["Hot Towel Shave", "Mustache Trim"], active: true, branchId: "B004" },
// ];

export type DiscountType = "percentage" | "fixed";

export interface Offer {
  id: string;
  title: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  active: boolean;
  expiresAt?: string;
  description?: string;
  /** Branch this offer is available at. Undefined means "all branches". */
  branchId?: string;
}

// export const offers: Offer[] = [
//   { id: "OF001", title: "New customer welcome", code: "WELCOME10", discountType: "percentage", discountValue: 10, active: true, description: "10% off for new customers" },
//   { id: "OF002", title: "Summer special", code: "SUMMER15", discountType: "percentage", discountValue: 15, active: true, expiresAt: "2026-08-22", description: "15% off this summer", branchId: "B001" },
//   { id: "OF003", title: "Refer a friend", code: "REFER5", discountType: "fixed", discountValue: 5, active: true, description: "₹5.00 off when you refer a friend" },
//   { id: "OF004", title: "Groom-to-Be promo", code: "GROOM20", discountType: "percentage", discountValue: 20, active: false, expiresAt: "2026-07-13", description: "20% off for grooms-to-be", branchId: "B003" },
// ];

// export const bookings: Booking[] = [
//   { id: "BK001", customerName: "Rohan Deshmukh", branch: "Shankar Nagar", service: "Haircut", date: "2026-07-21", time: "10:00", status: "Confirmed" },
//   { id: "BK002", customerName: "Aman Verma", branch: "Hingna", service: "Beard Trim", date: "2026-07-21", time: "11:30", status: "Confirmed" },
//   { id: "BK003", customerName: "Suresh Patil", branch: "Sadar", service: "Hot Towel Shave", date: "2026-07-21", time: "14:00", status: "Pending" },
//   { id: "BK004", customerName: "Vikram Rao", branch: "Mahal Chowk", service: "Skin Fade", date: "2026-07-20", time: "09:00", status: "Completed" },
//   { id: "BK005", customerName: "Nikhil Joshi", branch: "Shankar Nagar", service: "Hair Color", date: "2026-07-20", time: "08:00", status: "Completed" },
//   { id: "BK006", customerName: "Rahul Sharma", branch: "Hingna", service: "Head Massage", date: "2026-07-19", time: "13:00", status: "Cancelled" },
//   { id: "BK007", customerName: "Ganesh Kale", branch: "Sadar", service: "Hair Spa", date: "2026-07-21", time: "15:30", status: "Confirmed" },
//   { id: "BK008", customerName: "Prashant Meshram", branch: "Mahal Chowk", service: "Kids Haircut", date: "2026-07-21", time: "16:00", status: "Pending" },
//   { id: "BK009", customerName: "Sandeep Wankhede", branch: "Shankar Nagar", service: "Mustache Trim", date: "2026-07-18", time: "12:00", status: "Completed" },
//   { id: "BK010", customerName: "Kunal Tiwari", branch: "Hingna", service: "Facial for Men", date: "2026-07-21", time: "10:30", status: "Confirmed" },
// ];

// export const customers: Customer[] = [
//   { id: "C001", name: "Rohan Deshmukh", phone: "+919922001001", email: "rohan.deshmukh@email.com", totalBookings: 12, lastBooking: "2026-07-21", totalSpent: 3200, active: true, branchId: "B001" },
//   { id: "C002", name: "Aman Verma", phone: "+919922001002", email: "aman.verma@email.com", totalBookings: 8, lastBooking: "2026-07-21", totalSpent: 2100, active: true, branchId: "B002" },
//   { id: "C003", name: "Suresh Patil", phone: "+919922001003", email: "suresh.patil@email.com", totalBookings: 5, lastBooking: "2026-07-21", totalSpent: 1450, active: true, branchId: "B003" },
//   { id: "C004", name: "Vikram Rao", phone: "+919922001004", email: "vikram.rao@email.com", totalBookings: 15, lastBooking: "2026-07-20", totalSpent: 4800, active: true, branchId: "B004" },
//   { id: "C005", name: "Nikhil Joshi", phone: "+919922001005", email: "nikhil.joshi@email.com", totalBookings: 3, lastBooking: "2026-07-20", totalSpent: 900, active: true, branchId: "B001" },
//   { id: "C006", name: "Rahul Sharma", phone: "+919922001006", email: "rahul.sharma@email.com", totalBookings: 7, lastBooking: "2026-07-19", totalSpent: 1800, active: false, notes: "Prefers evening slots", branchId: "B002" },
//   { id: "C007", name: "Ganesh Kale", phone: "+919922001007", email: "ganesh.kale@email.com", totalBookings: 20, lastBooking: "2026-07-21", totalSpent: 6200, active: true, branchId: "B003" },
//   { id: "C008", name: "Prashant Meshram", phone: "+919922001008", email: "prashant.meshram@email.com", totalBookings: 2, lastBooking: "2026-07-21", totalSpent: 400, active: true, branchId: "B004" },
//   { id: "C009", name: "Sandeep Wankhede", phone: "+919922001009", email: "sandeep.wankhede@email.com", totalBookings: 9, lastBooking: "2026-07-18", totalSpent: 2600, active: true, notes: "Regular customer, tips well" },
//   { id: "C010", name: "Kunal Tiwari", phone: "+919922001010", email: "kunal.tiwari@email.com", totalBookings: 4, lastBooking: "2026-07-21", totalSpent: 1100, active: true },
// ];

// export const bookingsPerDay = [
//   { day: "Mon", bookings: 18 },
//   { day: "Tue", bookings: 24 },
//   { day: "Wed", bookings: 32 },
//   { day: "Thu", bookings: 28 },
//   { day: "Fri", bookings: 45 },
//   { day: "Sat", bookings: 52 },
//   { day: "Sun", bookings: 15 },
// ];

// export const topServices = [
//   { name: "Haircut", count: 156 },
//   { name: "Beard Trim", count: 132 },
//   { name: "Hot Towel Shave", count: 98 },
//   { name: "Skin Fade", count: 87 },
//   { name: "Hair Color", count: 64 },
//   { name: "Head Massage", count: 52 },
//   { name: "Hair Spa", count: 41 },
// ];
