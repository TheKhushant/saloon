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
}

export const products: Product[] = [
  { id: "P001", name: "Beard Oil", category: "Beard Care", price: 349, stock: 42, image: "https://images.unsplash.com/photo-1679003042467-009b786600ac?w=600&h=400&fit=crop&q=80&auto=format", active: true, description: "Nourishing oil for softer, healthier beard growth.", assignedBranchIds: [] },
  { id: "P002", name: "Hair Wax", category: "Hair Care", price: 279, stock: 30, image: "https://images.unsplash.com/photo-1610705267928-1b9f2fa7f1c5?w=600&h=400&fit=crop&q=80&auto=format", active: true, description: "Strong hold matte finish wax.", assignedBranchIds: [] },
  { id: "P003", name: "Shaving Cream", category: "Face Care", price: 199, stock: 55, image: "https://loremflickr.com/600/400/shaving,cream", active: true, description: "Smooth lather for a comfortable, close shave.", assignedBranchIds: [] },
  { id: "P004", name: "Hair Comb", category: "Tools", price: 99, stock: 80, image: "https://loremflickr.com/600/400/comb,barber", active: true, description: "Anti-static wide-tooth grooming comb.", assignedBranchIds: [] },
  { id: "P005", name: "Hair Shampoo (Men)", category: "Hair Care", price: 249, stock: 38, image: "https://images.unsplash.com/photo-1760647422523-f532034a49ce?w=600&h=400&fit=crop&q=80&auto=format", active: false, description: "Deep cleansing shampoo for everyday use.", assignedBranchIds: [] },
  { id: "P006", name: "Hair Gel", category: "Hair Care", price: 189, stock: 46, image: "https://images.unsplash.com/photo-1597354984706-fac992d9306f?w=600&h=400&fit=crop&q=80&auto=format", active: true, description: "Long-lasting shine and hold.", assignedBranchIds: [] },
  { id: "P007", name: "Aftershave Lotion", category: "Face Care", price: 229, stock: 34, image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600&h=400&fit=crop&q=80&auto=format", active: true, description: "Soothing, alcohol-light aftershave.", assignedBranchIds: [] },
  { id: "P008", name: "Hair Trimmer", category: "Tools", price: 899, stock: 15, image: "https://loremflickr.com/600/400/trimmer,clipper", active: true, description: "Cordless precision trimmer for fades and edges.", assignedBranchIds: [] },
  { id: "P009", name: "Face Wash (Men)", category: "Face Care", price: 219, stock: 40, image: "https://images.unsplash.com/photo-1712112797786-d43620cac1fd?w=600&h=400&fit=crop&q=80&auto=format", active: true, description: "Oil-control face wash for daily use.", assignedBranchIds: [] },
  { id: "P010", name: "Talcum Powder", category: "Body Care", price: 129, stock: 60, image: "https://loremflickr.com/600/400/powder,cosmetics", active: true, description: "Cooling, fresh-scented body powder.", assignedBranchIds: [] },
  { id: "P011", name: "Hair Growth Oil", category: "Hair Care", price: 399, stock: 36, image: "https://images.unsplash.com/photo-1699373383871-4ca5636948c1?w=600&h=400&fit=crop&q=80&auto=format", active: true, description: "Ayurvedic blend to reduce hair fall and boost growth.", assignedBranchIds: [] },
  { id: "P012", name: "Head Massage Cream", category: "Hair Care", price: 259, stock: 44, image: "https://images.unsplash.com/photo-1701976857871-a46363644519?w=600&h=400&fit=crop&q=80&auto=format", active: true, description: "Cooling cream for a relaxing head massage.", assignedBranchIds: [] },
  { id: "P013", name: "Head Massage Oil", category: "Hair Care", price: 279, stock: 40, image: "https://loremflickr.com/600/400/oil,spa", active: true, description: "Warm oil blend for scalp relaxation.", assignedBranchIds: [] },
  { id: "P014", name: "Ayurvedic Hair Oil", category: "Hair Care", price: 329, stock: 28, image: "https://loremflickr.com/600/400/ayurveda,herbal", active: true, description: "Herbal oil for stronger, thicker hair.", assignedBranchIds: [] },
  { id: "P015", name: "Hot Oil Treatment", category: "Hair Care", price: 349, stock: 22, image: "https://loremflickr.com/600/400/spa,oil", active: true, description: "Deep conditioning hot oil spa treatment.", assignedBranchIds: [] },
  { id: "P016", name: "Anti-Dandruff Shampoo", category: "Hair Care", price: 259, stock: 50, image: "https://loremflickr.com/600/400/shampoo,haircare", active: true, description: "Clinically tested formula to fight dandruff.", assignedBranchIds: [] },
  { id: "P017", name: "Hair Conditioner", category: "Hair Care", price: 229, stock: 45, image: "https://loremflickr.com/600/400/conditioner,haircare", active: true, description: "Deep conditioning for smooth, manageable hair.", assignedBranchIds: [] },
  { id: "P018", name: "Matte Clay Pomade", category: "Hair Care", price: 319, stock: 32, image: "https://loremflickr.com/600/400/pomade,hairstyle", active: true, description: "Textured matte finish with strong hold.", assignedBranchIds: [] },
  { id: "P019", name: "Hair Serum", category: "Hair Care", price: 349, stock: 26, image: "https://loremflickr.com/600/400/serum,haircare", active: true, description: "Lightweight serum for frizz-free shine.", assignedBranchIds: [] },
  { id: "P020", name: "Onion Hair Oil", category: "Hair Care", price: 299, stock: 38, image: "https://loremflickr.com/600/400/onion,hairoil", active: true, description: "Onion extract oil to reduce hair fall.", assignedBranchIds: [] },
  { id: "P021", name: "Volumizing Hair Spray", category: "Hair Care", price: 269, stock: 29, image: "https://loremflickr.com/600/400/hairspray,style", active: true, description: "Adds volume and long-lasting hold.", assignedBranchIds: [] },
  { id: "P022", name: "Texturizing Hair Clay", category: "Hair Care", price: 339, stock: 24, image: "https://loremflickr.com/600/400/clay,hairstyle", active: true, description: "Natural finish clay for textured looks.", assignedBranchIds: [] },
  { id: "P023", name: "Scalp Scrub", category: "Hair Care", price: 249, stock: 20, image: "https://loremflickr.com/600/400/scalp,scrub", active: true, description: "Exfoliating scrub for a healthy scalp.", assignedBranchIds: [] },
  { id: "P024", name: "Hair Growth Serum", category: "Hair Care", price: 449, stock: 18, image: "https://loremflickr.com/600/400/serum,hairgrowth", active: true, description: "Concentrated serum to support thicker hair.", assignedBranchIds: [] },
  { id: "P025", name: "Keratin Hair Cream", category: "Hair Care", price: 279, stock: 33, image: "https://loremflickr.com/600/400/keratin,haircare", active: true, description: "Keratin-infused cream for smooth styling.", assignedBranchIds: [] },
  { id: "P026", name: "Silver/Grey Hair Color", category: "Hair Care", price: 329, stock: 19, image: "https://loremflickr.com/600/400/haircolor,grooming", active: true, description: "Ammonia-free color for natural-looking grey coverage.", assignedBranchIds: [] },
  { id: "P027", name: "Hair Spa Cream", category: "Hair Care", price: 359, stock: 21, image: "https://loremflickr.com/600/400/hairspa,cream", active: true, description: "Rich spa cream for salon-style hair treatment.", assignedBranchIds: [] },
  { id: "P028", name: "Beard Balm", category: "Beard Care", price: 299, stock: 36, image: "https://loremflickr.com/600/400/beard,balm", active: true, description: "Conditions and shapes your beard with light hold.", assignedBranchIds: [] },
  { id: "P029", name: "Beard Wax", category: "Beard Care", price: 279, stock: 30, image: "https://loremflickr.com/600/400/beard,wax", active: true, description: "Strong hold wax for styling and taming flyaways.", assignedBranchIds: [] },
  { id: "P030", name: "Beard Shampoo", category: "Beard Care", price: 249, stock: 28, image: "https://loremflickr.com/600/400/beard,shampoo", active: true, description: "Gentle cleanser made for facial hair.", assignedBranchIds: [] },
  { id: "P031", name: "Beard Growth Serum", category: "Beard Care", price: 449, stock: 22, image: "https://loremflickr.com/600/400/beard,serum", active: true, description: "Nourishing serum to support fuller beard growth.", assignedBranchIds: [] },
  { id: "P032", name: "Beard Comb", category: "Beard Care", price: 149, stock: 50, image: "https://loremflickr.com/600/400/beard,comb", active: true, description: "Fine-tooth comb for detangling and shaping.", assignedBranchIds: [] },
  { id: "P033", name: "Beard Brush", category: "Beard Care", price: 199, stock: 42, image: "https://loremflickr.com/600/400/beard,brush", active: true, description: "Boar-bristle brush for even oil distribution.", assignedBranchIds: [] },
  { id: "P034", name: "Mustache Wax", category: "Beard Care", price: 179, stock: 34, image: "https://loremflickr.com/600/400/mustache,wax", active: true, description: "Firm hold wax for mustache styling.", assignedBranchIds: [] },
  { id: "P035", name: "Beard Softener Cream", category: "Beard Care", price: 259, stock: 26, image: "https://loremflickr.com/600/400/beard,cream", active: true, description: "Softens coarse beard hair and reduces itchiness.", assignedBranchIds: [] },
  { id: "P036", name: "Beard Straightening Cream", category: "Beard Care", price: 289, stock: 17, image: "https://loremflickr.com/600/400/beard,grooming", active: true, description: "Smooths and straightens unruly beard hair.", assignedBranchIds: [] },
  { id: "P037", name: "Beard Detangler Spray", category: "Beard Care", price: 219, stock: 23, image: "https://loremflickr.com/600/400/beard,spray", active: true, description: "Leave-in spray for easier combing and softness.", assignedBranchIds: [] },
  { id: "P038", name: "Beard & Mustache Dye", category: "Beard Care", price: 229, stock: 15, image: "https://loremflickr.com/600/400/beard,dye", active: true, description: "Natural-looking color for beard and mustache.", assignedBranchIds: [] },
  { id: "P039", name: "Beard Trimmer (Precision)", category: "Tools", price: 1299, stock: 12, image: "https://loremflickr.com/600/400/trimmer,beard", active: true, description: "Precision trimmer with adjustable guard combs.", assignedBranchIds: [] },
  { id: "P040", name: "Face Scrub", category: "Face Care", price: 239, stock: 31, image: "https://loremflickr.com/600/400/facescrub,men", active: true, description: "Exfoliating scrub to remove dead skin and dirt.", assignedBranchIds: [] },
  { id: "P041", name: "Face Moisturizer", category: "Face Care", price: 259, stock: 37, image: "https://loremflickr.com/600/400/moisturizer,men", active: true, description: "Lightweight, non-greasy daily hydration.", assignedBranchIds: [] },
  { id: "P042", name: "Sunscreen SPF 50", category: "Face Care", price: 349, stock: 29, image: "https://loremflickr.com/600/400/sunscreen,men", active: true, description: "Broad-spectrum protection for daily wear.", assignedBranchIds: [] },
  { id: "P043", name: "Under Eye Cream", category: "Face Care", price: 329, stock: 18, image: "https://loremflickr.com/600/400/eyecream,skincare", active: true, description: "Reduces puffiness and dark circles.", assignedBranchIds: [] },
  { id: "P044", name: "Face Serum (Vitamin C)", category: "Face Care", price: 399, stock: 20, image: "https://loremflickr.com/600/400/faceserum,vitaminc", active: true, description: "Brightening serum for even-toned skin.", assignedBranchIds: [] },
  { id: "P045", name: "Charcoal Face Mask", category: "Face Care", price: 279, stock: 24, image: "https://loremflickr.com/600/400/charcoal,facemask", active: true, description: "Deep-cleansing mask to draw out impurities.", assignedBranchIds: [] },
  { id: "P046", name: "Anti-Aging Cream", category: "Face Care", price: 449, stock: 16, image: "https://loremflickr.com/600/400/antiaging,cream", active: true, description: "Firming cream to reduce fine lines.", assignedBranchIds: [] },
  { id: "P047", name: "Aftershave Balm", category: "Face Care", price: 259, stock: 27, image: "https://loremflickr.com/600/400/aftershave,balm", active: true, description: "Soothing balm to calm skin post-shave.", assignedBranchIds: [] },
  { id: "P048", name: "Shaving Gel", category: "Face Care", price: 219, stock: 33, image: "https://loremflickr.com/600/400/shavinggel,men", active: true, description: "Clear gel for precision shaving.", assignedBranchIds: [] },
  { id: "P049", name: "Shaving Foam", category: "Face Care", price: 199, stock: 35, image: "https://loremflickr.com/600/400/shavingfoam,men", active: true, description: "Rich lathering foam for a close shave.", assignedBranchIds: [] },
  { id: "P050", name: "Pre-Shave Oil", category: "Face Care", price: 279, stock: 19, image: "https://loremflickr.com/600/400/preshave,oil", active: true, description: "Softens hair and preps skin before shaving.", assignedBranchIds: [] },
  { id: "P051", name: "Face Wipes (Men)", category: "Face Care", price: 149, stock: 40, image: "https://loremflickr.com/600/400/facewipes,men", active: true, description: "On-the-go cleansing wipes for face and neck.", assignedBranchIds: [] },
  { id: "P052", name: "Blackhead Remover Strips", category: "Face Care", price: 129, stock: 45, image: "https://loremflickr.com/600/400/blackhead,skincare", active: true, description: "Deep pore-cleansing nose strips.", assignedBranchIds: [] },
  { id: "P053", name: "Lip Balm (Men)", category: "Face Care", price: 99, stock: 55, image: "https://loremflickr.com/600/400/lipbalm,men", active: true, description: "Moisturizing balm for chapped lips.", assignedBranchIds: [] },
  { id: "P054", name: "Face Toner", category: "Face Care", price: 229, stock: 22, image: "https://loremflickr.com/600/400/facetoner,skincare", active: true, description: "Alcohol-free toner to refine and refresh skin.", assignedBranchIds: [] },
  { id: "P055", name: "Body Wash", category: "Body Care", price: 249, stock: 44, image: "https://loremflickr.com/600/400/bodywash,men", active: true, description: "Refreshing daily body wash for men.", assignedBranchIds: [] },
  { id: "P056", name: "Body Lotion", category: "Body Care", price: 229, stock: 38, image: "https://loremflickr.com/600/400/bodylotion,men", active: true, description: "Long-lasting hydration for dry skin.", assignedBranchIds: [] },
  { id: "P057", name: "Deodorant Spray", category: "Body Care", price: 199, stock: 50, image: "https://loremflickr.com/600/400/deodorant,men", active: true, description: "All-day freshness and odor protection.", assignedBranchIds: [] },
  { id: "P058", name: "Antiperspirant Roll-On", category: "Body Care", price: 179, stock: 41, image: "https://loremflickr.com/600/400/deodorant,rollon", active: true, description: "48-hour sweat and odor protection.", assignedBranchIds: [] },
  { id: "P059", name: "Body Spray (Cologne)", category: "Body Care", price: 299, stock: 36, image: "https://loremflickr.com/600/400/bodyspray,cologne", active: true, description: "Long-lasting fragrance for everyday wear.", assignedBranchIds: [] },
  { id: "P060", name: "Body Scrub", category: "Body Care", price: 259, stock: 25, image: "https://loremflickr.com/600/400/bodyscrub,men", active: true, description: "Exfoliating scrub for smoother skin.", assignedBranchIds: [] },
  { id: "P061", name: "Hand Cream", category: "Body Care", price: 149, stock: 30, image: "https://loremflickr.com/600/400/handcream,men", active: true, description: "Fast-absorbing cream for rough hands.", assignedBranchIds: [] },
  { id: "P062", name: "Foot Cream", category: "Body Care", price: 179, stock: 22, image: "https://loremflickr.com/600/400/footcream,men", active: true, description: "Repairs cracked heels and dry feet.", assignedBranchIds: [] },
  { id: "P063", name: "Body Butter", category: "Body Care", price: 289, stock: 18, image: "https://loremflickr.com/600/400/bodybutter,men", active: true, description: "Rich moisturizer for intense hydration.", assignedBranchIds: [] },
  { id: "P064", name: "Body Wipes", category: "Body Care", price: 159, stock: 29, image: "https://loremflickr.com/600/400/bodywipes,men", active: true, description: "Refreshing wipes for on-the-go freshness.", assignedBranchIds: [] },
  { id: "P065", name: "Talc-Free Body Powder", category: "Body Care", price: 139, stock: 33, image: "https://loremflickr.com/600/400/bodypowder,men", active: true, description: "Cooling, sweat-absorbing body powder.", assignedBranchIds: [] },
  { id: "P066", name: "Eau De Parfum (Men)", category: "Body Care", price: 699, stock: 14, image: "https://loremflickr.com/600/400/perfume,men", active: true, description: "Long-lasting signature fragrance.", assignedBranchIds: [] },
  { id: "P067", name: "Nose & Ear Trimmer", category: "Tools", price: 699, stock: 20, image: "https://loremflickr.com/600/400/trimmer,grooming", active: true, description: "Painless trimming for nose and ear hair.", assignedBranchIds: [] },
  { id: "P068", name: "Nail Clipper Set", category: "Tools", price: 149, stock: 40, image: "https://loremflickr.com/600/400/nailclipper,grooming", active: true, description: "Stainless steel clippers for precise trims.", assignedBranchIds: [] },
  { id: "P069", name: "Grooming Kit (Travel)", category: "Tools", price: 999, stock: 16, image: "https://loremflickr.com/600/400/groomingkit,men", active: true, description: "All-in-one travel-friendly grooming set.", assignedBranchIds: [] },
  { id: "P070", name: "Safety Razor", category: "Tools", price: 599, stock: 17, image: "https://loremflickr.com/600/400/razor,shaving", active: true, description: "Classic double-edge safety razor for a close shave.", assignedBranchIds: [] },
  { id: "P071", name: "Shaving Brush", category: "Tools", price: 349, stock: 23, image: "https://loremflickr.com/600/400/shavingbrush,grooming", active: true, description: "Soft-bristle brush for rich lather application.", assignedBranchIds: [] },
];

export const branches: Branch[] = [
  { id: "B001", branch_name: "Shankar Nagar", city: "Nagpur", address: "Shankar Nagar Square, Nagpur", contact_number: "+919811111111", status: "active" },
  { id: "B002", branch_name: "Hingna", city: "Nagpur", address: "Hingna Road, Nagpur", contact_number: "+919811111112", status: "active" },
  { id: "B003", branch_name: "Sadar", city: "Nagpur", address: "Sadar, Nagpur", contact_number: "+919811111113", status: "active" },
  { id: "B004", branch_name: "Mahal Chowk", city: "Nagpur", address: "Mahal Chowk, Nagpur", contact_number: "+919811111114", status: "active" },
];

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

export const services: Service[] = [
  { id: "SV001", name: "Haircut", category: "Hair", durationMinutes: 30, price: 149, active: true },
  { id: "SV002", name: "Beard Trim", category: "Beard", durationMinutes: 15, price: 99, active: true },
  { id: "SV003", name: "Hot Towel Shave", category: "Beard", durationMinutes: 25, price: 149, active: true },
  { id: "SV004", name: "Hair Color", category: "Hair", durationMinutes: 45, price: 399, active: true },
  { id: "SV005", name: "Head Massage", category: "Spa", durationMinutes: 20, price: 199, active: true },
  { id: "SV006", name: "Kids Haircut", category: "Hair", durationMinutes: 20, price: 99, active: true },
  { id: "SV007", name: "Hair Spa", category: "Spa", durationMinutes: 40, price: 349, active: true },
  { id: "SV008", name: "Skin Fade", category: "Hair", durationMinutes: 35, price: 199, active: true, branchId: "B001" },
  { id: "SV009", name: "Facial for Men", category: "Skin", durationMinutes: 30, price: 299, active: true, branchId: "B003" },
  { id: "SV010", name: "Mustache Trim", category: "Beard", durationMinutes: 10, price: 49, active: true },
];

export interface Barber {
  id: string;
  name: string;
  phone: string;
  email?: string;
  specialties?: string[];
  active: boolean;
  branchId: string;
}

export const barbers: Barber[] = [
  { id: "BR001", name: "Ramesh Kadam", phone: "+919822001001", specialties: ["Haircut", "Skin Fade"], active: true, branchId: "B001" },
  { id: "BR002", name: "Suraj Bhoyar", phone: "+919822001002", specialties: ["Beard Trim", "Hot Towel Shave"], active: true, branchId: "B001" },
  { id: "BR003", name: "Amit Ingle", phone: "+919822001003", specialties: ["Haircut", "Hair Color"], active: true, branchId: "B002" },
  { id: "BR004", name: "Vinod Chaudhary", phone: "+919822001004", specialties: ["Head Massage", "Hair Spa"], active: true, branchId: "B002" },
  { id: "BR005", name: "Deepak Sahare", phone: "+919822001005", specialties: ["Haircut", "Beard Trim"], active: true, branchId: "B003" },
  { id: "BR006", name: "Manoj Thakre", phone: "+919822001006", specialties: ["Facial for Men", "Skin Fade"], active: false, branchId: "B003" },
  { id: "BR007", name: "Pravin Gaikwad", phone: "+919822001007", specialties: ["Haircut", "Kids Haircut"], active: true, branchId: "B004" },
  { id: "BR008", name: "Sachin Rahangdale", phone: "+919822001008", specialties: ["Hot Towel Shave", "Mustache Trim"], active: true, branchId: "B004" },
];

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

export const offers: Offer[] = [
  { id: "OF001", title: "New customer welcome", code: "WELCOME10", discountType: "percentage", discountValue: 10, active: true, description: "10% off for new customers" },
  { id: "OF002", title: "Summer special", code: "SUMMER15", discountType: "percentage", discountValue: 15, active: true, expiresAt: "2026-08-22", description: "15% off this summer", branchId: "B001" },
  { id: "OF003", title: "Refer a friend", code: "REFER5", discountType: "fixed", discountValue: 5, active: true, description: "₹5.00 off when you refer a friend" },
  { id: "OF004", title: "Groom-to-Be promo", code: "GROOM20", discountType: "percentage", discountValue: 20, active: false, expiresAt: "2026-07-13", description: "20% off for grooms-to-be", branchId: "B003" },
];

export const bookings: Booking[] = [
  { id: "BK001", customerName: "Rohan Deshmukh", branch: "Shankar Nagar", service: "Haircut", date: "2026-07-21", time: "10:00", status: "Confirmed" },
  { id: "BK002", customerName: "Aman Verma", branch: "Hingna", service: "Beard Trim", date: "2026-07-21", time: "11:30", status: "Confirmed" },
  { id: "BK003", customerName: "Suresh Patil", branch: "Sadar", service: "Hot Towel Shave", date: "2026-07-21", time: "14:00", status: "Pending" },
  { id: "BK004", customerName: "Vikram Rao", branch: "Mahal Chowk", service: "Skin Fade", date: "2026-07-20", time: "09:00", status: "Completed" },
  { id: "BK005", customerName: "Nikhil Joshi", branch: "Shankar Nagar", service: "Hair Color", date: "2026-07-20", time: "08:00", status: "Completed" },
  { id: "BK006", customerName: "Rahul Sharma", branch: "Hingna", service: "Head Massage", date: "2026-07-19", time: "13:00", status: "Cancelled" },
  { id: "BK007", customerName: "Ganesh Kale", branch: "Sadar", service: "Hair Spa", date: "2026-07-21", time: "15:30", status: "Confirmed" },
  { id: "BK008", customerName: "Prashant Meshram", branch: "Mahal Chowk", service: "Kids Haircut", date: "2026-07-21", time: "16:00", status: "Pending" },
  { id: "BK009", customerName: "Sandeep Wankhede", branch: "Shankar Nagar", service: "Mustache Trim", date: "2026-07-18", time: "12:00", status: "Completed" },
  { id: "BK010", customerName: "Kunal Tiwari", branch: "Hingna", service: "Facial for Men", date: "2026-07-21", time: "10:30", status: "Confirmed" },
];

export const customers: Customer[] = [
  { id: "C001", name: "Rohan Deshmukh", phone: "+919922001001", email: "rohan.deshmukh@email.com", totalBookings: 12, lastBooking: "2026-07-21", totalSpent: 3200, active: true, branchId: "B001" },
  { id: "C002", name: "Aman Verma", phone: "+919922001002", email: "aman.verma@email.com", totalBookings: 8, lastBooking: "2026-07-21", totalSpent: 2100, active: true, branchId: "B002" },
  { id: "C003", name: "Suresh Patil", phone: "+919922001003", email: "suresh.patil@email.com", totalBookings: 5, lastBooking: "2026-07-21", totalSpent: 1450, active: true, branchId: "B003" },
  { id: "C004", name: "Vikram Rao", phone: "+919922001004", email: "vikram.rao@email.com", totalBookings: 15, lastBooking: "2026-07-20", totalSpent: 4800, active: true, branchId: "B004" },
  { id: "C005", name: "Nikhil Joshi", phone: "+919922001005", email: "nikhil.joshi@email.com", totalBookings: 3, lastBooking: "2026-07-20", totalSpent: 900, active: true, branchId: "B001" },
  { id: "C006", name: "Rahul Sharma", phone: "+919922001006", email: "rahul.sharma@email.com", totalBookings: 7, lastBooking: "2026-07-19", totalSpent: 1800, active: false, notes: "Prefers evening slots", branchId: "B002" },
  { id: "C007", name: "Ganesh Kale", phone: "+919922001007", email: "ganesh.kale@email.com", totalBookings: 20, lastBooking: "2026-07-21", totalSpent: 6200, active: true, branchId: "B003" },
  { id: "C008", name: "Prashant Meshram", phone: "+919922001008", email: "prashant.meshram@email.com", totalBookings: 2, lastBooking: "2026-07-21", totalSpent: 400, active: true, branchId: "B004" },
  { id: "C009", name: "Sandeep Wankhede", phone: "+919922001009", email: "sandeep.wankhede@email.com", totalBookings: 9, lastBooking: "2026-07-18", totalSpent: 2600, active: true, notes: "Regular customer, tips well" },
  { id: "C010", name: "Kunal Tiwari", phone: "+919922001010", email: "kunal.tiwari@email.com", totalBookings: 4, lastBooking: "2026-07-21", totalSpent: 1100, active: true },
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
  { name: "Haircut", count: 156 },
  { name: "Beard Trim", count: 132 },
  { name: "Hot Towel Shave", count: 98 },
  { name: "Skin Fade", count: 87 },
  { name: "Hair Color", count: 64 },
  { name: "Head Massage", count: 52 },
  { name: "Hair Spa", count: 41 },
];
