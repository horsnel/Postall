export const categories = [
  { id: "gigs", name: "Gigs", icon: "Zap", description: "Quick one-off jobs and tasks", color: "emerald" },
  { id: "services", name: "Services", icon: "SlidersHorizontal", description: "Professional and freelance services", color: "teal" },
  { id: "jobs", name: "Jobs", icon: "Briefcase", description: "Full-time and part-time employment", color: "cyan" },
  { id: "for-sale", name: "For Sale", icon: "ShoppingCart", description: "Buy and sell items locally", color: "amber" },
  { id: "community", name: "Community", icon: "Users", description: "Events, groups, and activities", color: "rose" },
] as const;

export const tools = [
  { id: "post-task", name: "Post a Task", icon: "CirclePlus", description: "Create a new task listing", color: "emerald" },
  { id: "find-work", name: "Find Work", icon: "Search", description: "Browse and apply for tasks", color: "teal" },
  { id: "sell-item", name: "Sell Item", icon: "ShoppingCart", description: "List items for sale", color: "amber" },
  { id: "ai-assistant", name: "AI Assistant", icon: "Bot", description: "Get AI-powered help", color: "cyan" },
  { id: "price-check", name: "Price Check", icon: "TrendingUp", description: "Research market prices", color: "emerald" },
  { id: "safe-spots", name: "Safe Spots", icon: "Shield", description: "Find safe meeting locations", color: "teal" },
  { id: "verify-id", name: "Verify ID", icon: "BadgeCheck", description: "Verify your identity", color: "cyan" },
  { id: "my-reputation", name: "My Reputation", icon: "Star", description: "View your ratings and reviews", color: "amber" },
  { id: "proof-cam", name: "Proof Cam", icon: "Camera", description: "Capture timestamped proof", color: "emerald" },
  { id: "auto-reply", name: "Auto-Reply", icon: "MessageCircle", description: "Set up auto responses", color: "teal" },
  { id: "scheduler", name: "Scheduler", icon: "Calendar", description: "Schedule meetings and tasks", color: "cyan" },
  { id: "ship-helper", name: "Ship Helper", icon: "Truck", description: "Compare shipping options", color: "amber" },
  { id: "escrow", name: "Escrow", icon: "Lock", description: "Secure payment protection", color: "emerald" },
  { id: "instant-pay", name: "Instant Pay", icon: "Zap", description: "Get paid instantly", color: "teal" },
  { id: "market-insights", name: "Market Insights", icon: "ChartColumnIncreasing", description: "Market trends and data", color: "cyan" },
  { id: "smart-alerts", name: "Smart Alerts", icon: "Bell", description: "Set up custom alerts", color: "amber" },
  { id: "translate", name: "Translate", icon: "Languages", description: "Translate messages", color: "emerald" },
  { id: "route-plan", name: "Route Plan", icon: "MapPin", description: "Plan meeting routes", color: "teal" },
  { id: "team-up", name: "Team Up", icon: "Users", description: "Collaborate on tasks", color: "cyan" },
  { id: "learn-skills", name: "Learn Skills", icon: "GraduationCap", description: "Take skill courses", color: "amber" },
  { id: "freecycle", name: "Freecycle", icon: "Recycle", description: "Give away items for free", color: "emerald" },
  { id: "events", name: "Events", icon: "CalendarDays", description: "Discover local events", color: "cyan" },
  { id: "emergency", name: "Emergency", icon: "Siren", description: "Emergency contacts and tools", color: "rose" },
] as const;

export const cities = [
  { name: "Lagos", country: "Nigeria" },
  { name: "Abuja", country: "Nigeria" },
  { name: "Port Harcourt", country: "Nigeria" },
  { name: "Ibadan", country: "Nigeria" },
  { name: "Benin City", country: "Nigeria" },
  { name: "Kaduna", country: "Nigeria" },
  { name: "Enugu", country: "Nigeria" },
  { name: "Owerri", country: "Nigeria" },
  { name: "Uyo", country: "Nigeria" },
  { name: "Calabar", country: "Nigeria" },
  { name: "Warri", country: "Nigeria" },
  { name: "Aba", country: "Nigeria" },
  { name: "Jos", country: "Nigeria" },
  { name: "Ilorin", country: "Nigeria" },
];

export const urgencyLevels = [
  { value: "low", label: "Low", color: "text-emerald-600 bg-emerald-100" },
  { value: "normal", label: "Normal", color: "text-blue-600 bg-blue-100" },
  { value: "high", label: "High", color: "text-amber-600 bg-amber-100" },
  { value: "urgent", label: "Urgent", color: "text-rose-600 bg-rose-100" },
];

export const taskStatusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  open: "bg-emerald-100 text-emerald-700",
  assigned: "bg-cyan-100 text-cyan-700",
  in_progress: "bg-amber-100 text-amber-700",
  pending_completion: "bg-orange-100 text-orange-700",
  completed: "bg-teal-100 text-teal-700",
  cancelled: "bg-rose-100 text-rose-700",
};

// Currencies supported - Nigerian Naira only via Paystack
export const currencies = [
  { code: "NGN", name: "Nigerian Naira", symbol: "₦", flag: "Globe", type: "fiat" },
] as const;

export const defaultCurrency = currencies[0]; // NGN by default

// Paid listing categories (like Craigslist - certain types cost money to post)
export const paidListingCategories = [
  {
    category: "jobs",
    subcategories: ["full-time", "part-time", "contract", "internship"],
    prices: { standard: 1500, featured: 3000, urgent: 4500 },
    currency: "NGN",
    description: "Job postings by employers",
    freeLimit: 1,
  },
  {
    category: "services",
    subcategories: ["professional", "automotive", "beauty", "cleaning", "repair"],
    prices: { standard: 1000, featured: 2500, urgent: 4000 },
    currency: "NGN",
    description: "Service and business listings",
    freeLimit: 2,
  },
  {
    category: "for-sale",
    subcategories: ["electronics", "vehicles", "furniture", "fashion"],
    prices: { standard: 500, featured: 1500, urgent: 2500 },
    currency: "NGN",
    description: "Premium item listings (vehicles, electronics, high-value items)",
    freeLimit: 5,
    premiumThreshold: 100000, // Items above ₦100k cost extra
    premiumPrice: 2000,
  },
  {
    category: "community",
    subcategories: ["events", "classes", "groups", "activities"],
    prices: { standard: 0, featured: 1000, urgent: 2000 },
    currency: "NGN",
    description: "Community events and activities",
    freeLimit: 10,
  },
  {
    category: "gigs",
    subcategories: ["computer", "creative", "labor", "writing"],
    prices: { standard: 0, featured: 1000, urgent: 2000 },
    currency: "NGN",
    description: "Gig and task listings",
    freeLimit: -1, // Always free to post tasks
  },
] as const;

// Crypto wallets supported for withdrawal
export const supportedCryptoWallets = [
  { chain: "Bitcoin", symbol: "BTC", icon: "₿", networks: ["Bitcoin Mainnet"] },
  { chain: "Ethereum", symbol: "ETH", icon: "Ξ", networks: ["Ethereum Mainnet", "Arbitrum", "Optimism", "Base"] },
  { chain: "USDT (TRC20)", symbol: "USDT", icon: "₮", networks: ["Tron TRC20"] },
  { chain: "USDT (ERC20)", symbol: "USDT", icon: "₮", networks: ["Ethereum ERC20"] },
  { chain: "USDT (BEP20)", symbol: "USDT", icon: "₮", networks: ["BNB BEP20"] },
  { chain: "USDC", symbol: "USDC", icon: "◎", networks: ["Ethereum ERC20", "Solana", "Polygon"] },
] as const;

// Nigerian banks for withdrawal
export const nigerianBanks = [
  "Access Bank", "First Bank", "GTBank", "UBA", "Zenith Bank",
  "Sterling Bank", "Fidelity Bank", "Union Bank", "Wema Bank", "Polaris Bank",
  "Keystone Bank", "Heritage Bank", "Titan Trust Bank", "Taj Bank", "Parallex Bank",
  "OPay", "PalmPay", "Moniepoint", "Kuda Bank", "Chipper Cash",
] as const;

export const sampleTasks = [
  { id: "1", title: "Build a responsive landing page for my restaurant", category: "gigs", budget: 75000, currency: "NGN", city: "Lagos", urgency: "high", postedAgo: "2h ago", applicants: 5 },
  { id: "2", title: "Move furniture to new apartment", category: "gigs", budget: 25000, currency: "NGN", city: "Accra", urgency: "normal", postedAgo: "4h ago", applicants: 3 },
  { id: "3", title: "Design a logo for startup brand", category: "services", budget: 50000, currency: "NGN", city: "Nairobi", urgency: "normal", postedAgo: "6h ago", applicants: 8 },
  { id: "4", title: "Python developer needed for data project", category: "jobs", budget: 200, currency: "USDT", city: "Lagos", urgency: "low", postedAgo: "1d ago", applicants: 12 },
  { id: "5", title: "Plumbing repair needed urgently", category: "services", budget: 40000, currency: "NGN", city: "Accra", urgency: "urgent", postedAgo: "30m ago", applicants: 2 },
  { id: "6", title: "Social media management for small business", category: "jobs", budget: 150000, currency: "NGN", city: "Lagos", urgency: "normal", postedAgo: "3h ago", applicants: 6 },
];

export const sampleListings = [
  { id: "1", title: "iPhone 14 Pro Max - 256GB", price: 650000, currency: "NGN", condition: "Like New", city: "Lagos", category: "for-sale", postedAgo: "1h ago" },
  { id: "2", title: "MacBook Air M2", price: 800000, currency: "NGN", condition: "Good", city: "Accra", category: "for-sale", postedAgo: "3h ago" },
  { id: "3", title: "Samsung 55\" Smart TV", price: 350000, currency: "NGN", condition: "Good", city: "Nairobi", category: "for-sale", postedAgo: "5h ago" },
  { id: "4", title: "Mountain Bike - Trek Marlin 7", price: 400000, currency: "NGN", condition: "New", city: "Lagos", category: "for-sale", postedAgo: "8h ago" },

  { id: "6", title: "Standing Desk - Electric Adjustable", price: 280000, currency: "NGN", condition: "New", city: "Lagos", category: "for-sale", postedAgo: "1d ago" },
];

export const recentActivity = [
  { type: "task_completed", text: "Emeka completed 'Website Redesign' in Lagos", time: "2m ago" },
  { type: "item_sold", text: "iPhone 13 sold for ₦450,000 in Accra", time: "5m ago" },
  { type: "new_task", text: "New task: 'Plumbing Repair' posted in Nairobi", time: "8m ago" },
  { type: "user_verified", text: "Amina earned Verified badge", time: "12m ago" },
  { type: "review_posted", text: "5-star review for 'Interior Design Service'", time: "15m ago" },
  { type: "task_assigned", text: "Kwame assigned to 'Data Entry Project'", time: "20m ago" },
  { type: "item_sold", text: "MacBook Pro sold for ₦900,000 in Lagos", time: "25m ago" },
  { type: "task_completed", text: "Fatima completed 'Logo Design' in Cairo", time: "30m ago" },
];

// Task matching interest statuses
export type InterestStatus = "pending_review" | "accepted" | "rejected" | "withdrawn";

// Chat unlock conditions
export const chatUnlockRules = {
  task: { requires_payment: true, requires_pick: true, description: "Chat unlocks after you pick someone and pay into escrow" },
  service: { requires_payment: false, requires_pick: false, description: "Chat is free for service listings - discuss and agree" },
  listing: { requires_payment: false, requires_pick: false, description: "Chat is free for items - arrange meetup" },
  job: { requires_payment: false, requires_pick: false, description: "Chat is free for job listings - communicate directly" },
  gig: { requires_payment: true, requires_pick: true, description: "Chat unlocks after you pick someone and pay into escrow" },
} as const;

// ─── Nigerian States and Cities ──────────────────────────────────
export const nigerianStates = [
  { name: "Abia", capital: "Umuahia", cities: ["Umuahia", "Aba", "Ohafia", "Arochukwu", "Umuahia North", "Isiala Ngwa"] },
  { name: "Abuja", capital: "Abuja", cities: ["Abuja Central", "Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Kubwa", "Bwari", "Nyanya", "Karshi"] },
  { name: "Adamawa", capital: "Yola", cities: ["Yola", "Mubi", "Jimeta", "Numan", "Ganye", "Toungo"] },
  { name: "Akwa Ibom", capital: "Uyo", cities: ["Uyo", "Ikot Ekpene", "Eket", "Oron", "Abak", "Etinan"] },
  { name: "Anambra", capital: "Awka", cities: ["Awka", "Onitsha", "Nnewi", "Aguata", "Ekwulobia", "Obosi", "Ihiala"] },
  { name: "Bauchi", capital: "Bauchi", cities: ["Bauchi", "Azare", "Jama'are", "Katagum", "Misau", "Tafawa Balewa"] },
  { name: "Bayelsa", capital: "Yenagoa", cities: ["Yenagoa", "Amassoma", "Ogbia", "Brass", "Nembe", "Sagbama"] },
  { name: "Benue", capital: "Makurdi", cities: ["Makurdi", "Gboko", "Otukpo", "Katsina-Ala", "Vandeikya", "Adikpo"] },
  { name: "Borno", capital: "Maiduguri", cities: ["Maiduguri", "Bama", "Gwoza", "Dikwa", "Bi", "Konduga"] },
  { name: "Cross River", capital: "Calabar", cities: ["Calabar", "Ikom", "Ogoja", "Ugep", "Obudu", "Akamkpa"] },
  { name: "Delta", capital: "Asaba", cities: ["Asaba", "Warri", "Sapele", "Ughelli", "Agbor", "Effurun", "Kwale"] },
  { name: "Ebonyi", capital: "Abakaliki", cities: ["Abakaliki", "Afikpo", "Onueke", "Ezza", "Izzi", "Ikwo"] },
  { name: "Edo", capital: "Benin City", cities: ["Benin City", "Auchi", "Ekpoma", "Uromi", "Igueben", "Fugar"] },
  { name: "Ekiti", capital: "Ado-Ekiti", cities: ["Ado-Ekiti", "Ikere-Ekiti", "Ijero-Ekiti", "Omuo-Ekiti", "Otun-Ekiti", "Ise-Ekiti"] },
  { name: "Enugu", capital: "Enugu", cities: ["Enugu", "Nsukka", "Awgu", "Oji River", "Udi", "Agbani", "9th Mile"] },
  { name: "Gombe", capital: "Gombe", cities: ["Gombe", "Kaltungo", "Biliri", "Dukku", "Nafada", "Kumo"] },
  { name: "Imo", capital: "Owerri", cities: ["Owerri", "Orlu", "Okigwe", "Oguta", "Mbaitoli", "Ngor-Okpala"] },
  { name: "Jigawa", capital: "Dutse", cities: ["Dutse", "Hadejia", "Kazaure", "Gumel", "Birnin Kudu", "Roni"] },
  { name: "Kaduna", capital: "Kaduna", cities: ["Kaduna", "Zaria", "Kafanchan", "Kachia", "Birnin Gwari", "Saminaka", "Makarfi"] },
  { name: "Kano", capital: "Kano", cities: ["Kano", "Kumbotso", "Nassarawa", "Dala", "Fagge", "Gwale", "Tarauni", "Bichi"] },
  { name: "Katsina", capital: "Katsina", cities: ["Katsina", "Daura", "Funtua", "Malumfashi", "Safana", "Kankia"] },
  { name: "Kebbi", capital: "Birnin Kebbi", cities: ["Birnin Kebbi", "Argungu", "Yauri", "Zuru", "Gwandu", "Jega"] },
  { name: "Kogi", capital: "Lokoja", cities: ["Lokoja", "Okene", "Kabba", "Idah", "Ogori-Magongo", "Dekina"] },
  { name: "Kwara", capital: "Ilorin", cities: ["Ilorin", "Offa", "Jebba", "Patigi", "Lafiagi", "Share"] },
  { name: "Lagos", capital: "Ikeja", cities: ["Lagos Island", "Victoria Island", "Ikoyi", "Lekki", "Yaba", "Surulere", "Ikeja", "Agege", "Ikeja GRA", "Ikorodu", "Badagry", "Epe", "Ajah", "Ojo", "Mushin", "Alimosho", "Iyana Ipaja", "Maryland", "Ogba", "Gbagada", "Oworonshoki", "Ketu", "Bariga", "Somolu", "Palmgrove", "Obalende", "Marina", "Oshodi", "Isolo", "Amuwo Odofin"] },
  { name: "Nasarawa", capital: "Lafia", cities: ["Lafia", "Keffi", "Akwanga", "Karu", "Wamba", "Nasarawa Eggon"] },
  { name: "Niger", capital: "Minna", cities: ["Minna", "Bida", "Suleja", "Kontagora", "Lapai", "Rijau"] },
  { name: "Ogun", capital: "Abeokuta", cities: ["Abeokuta", "Ijebu Ode", "Sagamu", "Ota", "Igbesa", "Ifo", "Shagamu"] },
  { name: "Ondo", capital: "Akure", cities: ["Akure", "Ondo", "Owo", "Ikare", "Akoko", "Okitipupa", "Idanre"] },
  { name: "Osun", capital: "Osogbo", cities: ["Osogbo", "Ile-Ife", "Ilesa", "Ede", "Iwo", "Ikire", "Ipetumodu"] },
  { name: "Oyo", capital: "Ibadan", cities: ["Ibadan", "Oyo", "Ogbomoso", "Iseyin", "Saki", "Ibarapa", "Eruwa", "Lalupon"] },
  { name: "Plateau", capital: "Jos", cities: ["Jos", "Bukuru", "Pankshin", "Shendam", "Langtang", "Wase"] },
  { name: "Rivers", capital: "Port Harcourt", cities: ["Port Harcourt", "Obio-Akpor", "Eleme", "Bonny", "Okrika", "Degema", "Ikeja", "Rumuola", "Choba", "Aluu", "Rumuokoro"] },
  { name: "Sokoto", capital: "Sokoto", cities: ["Sokoto", "Wurno", "Birnin Kebbi", "Tambuwal", "Gwadabawa", "Illela"] },
  { name: "Taraba", capital: "Jalingo", cities: ["Jalingo", "Wukari", "Serti", "Bali", "Gashaka", "Takum"] },
  { name: "Yobe", capital: "Damaturu", cities: ["Damaturu", "Potiskum", "Gashua", "Nguru", "Geidam", "Buni Yadi"] },
  { name: "Zamfara", capital: "Gusau", cities: ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka", "Bakura", "Shinkafi"] },
] as const;

// Helper to get all cities across all states
export function getAllNigerianCities(): string[] {
  return nigerianStates.flatMap((state) => [...state.cities]);
}

// Helper to get cities for a specific state
export function getCitiesByState(stateName: string): string[] {
  const state = nigerianStates.find((s) => s.name === stateName);
  return state ? [...state.cities] : [];
}

// Format currency helper
export function formatCurrency(amount: number, currency: string = "NGN"): string {
  const curr = currencies.find(c => c.code === currency);
  if (!curr) return `${currency} ${amount.toLocaleString()}`;
  
  if (curr.type === "crypto") {
    return `${curr.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}`;
  }
  
  return `${curr.symbol}${amount.toLocaleString()}`;
}
// Build timestamp: 1776150100
