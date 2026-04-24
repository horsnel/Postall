export type Locale = "en" | "pidgin" | "yo" | "ig" | "ha";

export interface LocaleInfo {
  code: Locale;
  name: string;
  flag: string;
}

export const locales: LocaleInfo[] = [
  { code: "en", name: "English", flag: "\ud83c\uddec\ud83c\udde7" },
  { code: "pidgin", name: "Pidgin", flag: "\ud83c\uddf3\ud83c\uddec" },
  { code: "yo", name: "Yoruba", flag: "\ud83c\uddf3\ud83c\uddec" },
  { code: "ig", name: "Igbo", flag: "\ud83c\uddf3\ud83c\uddec" },
  { code: "ha", name: "Hausa", flag: "\ud83c\uddf3\ud83c\uddec" },
];

export type TranslationKey =
  // Navigation
  | "nav.home"
  | "nav.browse"
  | "nav.post"
  | "nav.messages"
  | "nav.notifications"
  | "nav.profile"
  | "nav.settings"
  | "nav.wallet"
  | "nav.dashboard"
  | "nav.login"
  | "nav.signUp"
  | "nav.signUpFree"
  | "nav.logOut"
  | "nav.sell"
  | "nav.howItWorks"
  | "nav.contactUs"
  | "nav.safety"
  | "nav.terms"
  | "nav.privacy"
  | "nav.about"
  | "nav.help"
  // Categories
  | "cat.tasks"
  | "cat.services"
  | "cat.jobs"
  | "cat.forSale"

  | "cat.community"
  | "cat.allCategories"
  | "cat.gigs"

  // Actions
  | "action.search"
  | "action.searchPlaceholder"
  | "action.filter"
  | "action.sort"
  | "action.save"
  | "action.share"
  | "action.report"
  | "action.contact"
  | "action.apply"
  | "action.applyNow"
  | "action.viewDetails"
  | "action.makeOffer"
  // Status
  | "status.pending"
  | "status.active"
  | "status.completed"
  | "status.cancelled"
  | "status.verified"
  | "status.new"
  | "status.featured"
  | "status.urgent"
  // Common
  | "common.loading"
  | "common.error"
  | "common.success"
  | "common.cancel"
  | "common.confirm"
  | "common.submit"
  | "common.delete"
  | "common.edit"
  | "common.back"
  | "common.next"
  | "common.price"
  | "common.location"
  | "common.recentlyViewed"
  | "common.reviews"
  | "common.free"
  | "common.paid"
  // View
  | "view.grid"
  | "view.list"
  // Marketplace
  | "market.listings"
  | "market.postTask"
  | "market.findWork"
  | "market.sellItem"
  | "market.buyNow"
  | "market.addToCart"
  // Time
  | "time.justNow"
  | "time.minutesAgo"
  | "time.hoursAgo"
  | "time.daysAgo"
  | "time.today"
  | "time.yesterday"
  // Greetings
  | "greet.welcomeBack"
  | "greet.goodMorning"
  | "greet.goodAfternoon"
  | "greet.goodEvening"
  // Footer
  | "footer.aboutUs"
  | "footer.contact"
  | "footer.privacyPolicy"
  | "footer.termsOfService"
  | "footer.helpCenter";

type Translations = Record<TranslationKey, string>;

export const translations: Record<Locale, Translations> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.browse": "Browse",
    "nav.post": "Post",
    "nav.messages": "Messages",
    "nav.notifications": "Notifications",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.wallet": "Wallet",
    "nav.dashboard": "Dashboard",
    "nav.login": "Sign In",
    "nav.signUp": "Sign Up",
    "nav.signUpFree": "Sign Up Free",
    "nav.logOut": "Log Out",
    "nav.sell": "Sell",
    "nav.howItWorks": "How It Works",
    "nav.contactUs": "Contact Us",
    "nav.safety": "Safety",
    "nav.terms": "Terms",
    "nav.privacy": "Privacy",
    "nav.about": "About",
    "nav.help": "Help",
    // Categories
    "cat.tasks": "Tasks",
    "cat.services": "Services",
    "cat.jobs": "Jobs",
    "cat.forSale": "For Sale",
    "cat.community": "Community",
    "cat.allCategories": "All Categories",
    "cat.gigs": "Gigs",
    // Actions
    "action.search": "Search",
    "action.searchPlaceholder": "Search...",
    "action.filter": "Filter",
    "action.sort": "Sort",
    "action.save": "Save",
    "action.share": "Share",
    "action.report": "Report",
    "action.contact": "Contact",
    "action.apply": "Apply",
    "action.applyNow": "Apply Now",
    "action.viewDetails": "View Details",
    "action.makeOffer": "Make Offer",
    // Status
    "status.pending": "Pending",
    "status.active": "Active",
    "status.completed": "Completed",
    "status.cancelled": "Cancelled",
    "status.verified": "Verified",
    "status.new": "New",
    "status.featured": "Featured",
    "status.urgent": "Urgent",
    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.submit": "Submit",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.back": "Back",
    "common.next": "Next",
    "common.price": "Price",
    "common.location": "Location",
    "common.recentlyViewed": "Recently Viewed",
    "common.reviews": "Reviews",
    "common.free": "Free",
    "common.paid": "Paid",
    // View
    "view.grid": "Grid",
    "view.list": "List",
    // Marketplace
    "market.listings": "Listings",
    "market.postTask": "Post a Task",
    "market.findWork": "Find Work",
    "market.sellItem": "Sell Item",
    "market.buyNow": "Buy Now",
    "market.addToCart": "Add to Cart",
    // Time
    "time.justNow": "Just now",
    "time.minutesAgo": "minutes ago",
    "time.hoursAgo": "hours ago",
    "time.daysAgo": "days ago",
    "time.today": "Today",
    "time.yesterday": "Yesterday",
    // Greetings
    "greet.welcomeBack": "Welcome back",
    "greet.goodMorning": "Good morning",
    "greet.goodAfternoon": "Good afternoon",
    "greet.goodEvening": "Good evening",
    // Footer
    "footer.aboutUs": "About Us",
    "footer.contact": "Contact",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.helpCenter": "Help Center",
  },

  pidgin: {
    // Navigation
    "nav.home": "Home",
    "nav.browse": "Dey Browse",
    "nav.post": "Post Am",
    "nav.messages": "Message",
    "nav.notifications": "Alert",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.wallet": "Wallet",
    "nav.dashboard": "Dashboard",
    "nav.login": "Enter",
    "nav.signUp": "Join",
    "nav.signUpFree": "Join Free",
    "nav.logOut": "Comot",
    "nav.sell": "Sell Am",
    "nav.howItWorks": "How E Dey Work",
    "nav.contactUs": "Reach Us",
    "nav.safety": "Safety",
    "nav.terms": "Terms",
    "nav.privacy": "Privacy",
    "nav.about": "About",
    "nav.help": "Help",
    // Categories
    "cat.tasks": "Work Dey",
    "cat.services": "Service",
    "cat.jobs": "Jobs",
    "cat.forSale": "Dem Dey Sell",
    "cat.community": "Community",
    "cat.allCategories": "All Category",
    "cat.gigs": "Small Work",
    // Actions
    "action.search": "Find Am",
    "action.searchPlaceholder": "Find somtin...",
    "action.filter": "Sieve Am",
    "action.sort": "Arrange Am",
    "action.save": "Keep Am",
    "action.share": "Share Am",
    "action.report": "Report Am",
    "action.contact": "Reach Am",
    "action.apply": "Try Am",
    "action.applyNow": "Try Am Now",
    "action.viewDetails": "See Am Well",
    "action.makeOffer": "Price Am",
    // Status
    "status.pending": "Still Dey Wait",
    "status.active": "E Dey On",
    "status.completed": "Don Finish",
    "status.cancelled": "Dem Don Cancel",
    "status.verified": "Dem Don Confirm",
    "status.new": "New One",
    "status.featured": "Star Pick",
    "status.urgent": "Urgent O",
    // Common
    "common.loading": "E dey load...",
    "common.error": "Something spoil",
    "common.success": "E don work",
    "common.cancel": "No Do Am",
    "common.confirm": "Yes Do Am",
    "common.submit": "Send Am",
    "common.delete": "Comot Am",
    "common.edit": "Edit Am",
    "common.back": "Go Back",
    "common.next": "Next One",
    "common.price": "Price",
    "common.location": "Wia E Dey",
    "common.recentlyViewed": "Wey You Just See",
    "common.reviews": "Review",
    "common.free": "Free",
    "common.paid": "Dem Don Pay",
    // View
    "view.grid": "Grid",
    "view.list": "List",
    // Marketplace
    "market.listings": "Tings We Dey",
    "market.postTask": "Post Work",
    "market.findWork": "Find Work",
    "market.sellItem": "Sell Your Thing",
    "market.buyNow": "Buy Now",
    "market.addToCart": "Put Inside Cart",
    // Time
    "time.justNow": "Just now now",
    "time.minutesAgo": "mins ago",
    "time.hoursAgo": "hours ago",
    "time.daysAgo": "days ago",
    "time.today": "Today",
    "time.yesterday": "Yesterday",
    // Greetings
    "greet.welcomeBack": "You don come back",
    "greet.goodMorning": "Morning o",
    "greet.goodAfternoon": "Afternoon o",
    "greet.goodEvening": "Evening o",
    // Footer
    "footer.aboutUs": "About Us",
    "footer.contact": "Contact Us",
    "footer.privacyPolicy": "Privacy Policy",
    "footer.termsOfService": "Terms of Service",
    "footer.helpCenter": "Help Center",
  },

  yo: {
    // Navigation
    "nav.home": "Ile",
    "nav.browse": "Wa Wo",
    "nav.post": "Fi Sil\u1eb9",
    "nav.messages": "\u00c0y\u1ecdw\u00f3",
    "nav.notifications": "\u00cck\u00e9d\u00e8",
    "nav.profile": "Profaili",
    "nav.settings": "\u00c0y\u00e0w\u1ecd",
    "nav.wallet": "Apam\u1ecdw\u1ecd",
    "nav.dashboard": "Dasibodu",
    "nav.login": "W\u1ecdr\u1ecd",
    "nav.signUp": "\u0300for\u1ecdr\u1ecd",
    "nav.signUpFree": "\u0300for\u1ecdr\u1ecd \u1eccf\u1eb9",
    "nav.logOut": "J\u1ebde",
    "nav.sell": "T\u00e0",
    "nav.howItWorks": "B\u00ed \u00d3 \u1e62e N \u1e62i\u1e63\u1eb9\u0301",
    "nav.contactUs": "Kan Si Wa",
    "nav.safety": "\u00c0b\u1ecd\u0300",
    "nav.terms": "\u00c0d\u00e9h\u00f9n",
    "nav.privacy": "\u00c0\u1e63\u00ecr\u00f2",
    "nav.about": "N\u00edpa",
    "nav.help": "\u00ccr\u00e0nw\u1ecd\u0301",
    // Categories
    "cat.tasks": "I\u1e63\u1eb9",
    "cat.services": "Ise",
    "cat.jobs": "Ise-i\u1e63\u1eb9",
    "cat.forSale": "N\u00e0 T\u00ed \u0300nf\u1ecb",
    "cat.community": "Ij\u1ecdp\u1ecd",
    "cat.allCategories": "Gbogbo \u1eb8\u0300k\u00e0",
    "cat.gigs": "I\u1e63\u1eb9\u0301 K\u00e9k\u1eb9\u0300k\u00e9",
    // Actions
    "action.search": "Wa",
    "action.searchPlaceholder": "Wa nkan...",
    "action.filter": "\u00c0y\u00e0w\u1ecd",
    "action.sort": "T\u1ecdn",
    "action.save": "Fi P\u00e1d\u1eb9",
    "action.share": "Pin",
    "action.report": "S\u1ecdr\u1ecd",
    "action.contact": "Kan Si",
    "action.apply": "Foruk\u1ecdsil\u1eb9",
    "action.applyNow": "Foruk\u1ecdsil\u1eb9 N\u00ed",
    "action.viewDetails": "Wo \u00c0y\u1ecdk\u00e1",
    "action.makeOffer": "\u00c0f\u1ecdn N\u00e0",
    // Status
    "status.pending": "\u00cc n\u2019wo",
    "status.active": "N\u2019l\u1ec3",
    "status.completed": "Pari",
    "status.cancelled": "Fagil\u1eb9",
    "status.verified": "Iy\u1eb9s\u00ed",
    "status.new": "Tuntun",
    "status.featured": "Ayanf\u1eb9",
    "status.urgent": "P\u00e0t\u00e0k\u00ec",
    // Common
    "common.loading": "\u00cc n gb\u00e0s\u1ecdk\u1ecd...",
    "common.error": "Nkan ba j\u1eb9",
    "common.success": "O y\u1eb9",
    "common.cancel": "Fagil\u1eb9",
    "common.confirm": "J\u1eb9",
    "common.submit": "Fi Sil\u1eb9",
    "common.delete": "Pa\u1eb9",
    "common.edit": "\u00c0y\u1ecdp\u1ecd",
    "common.back": "Pad\u00e0",
    "common.next": "T\u1ecdka",
    "common.price": " Ow\u00f3",
    "common.location": "Ib\u00ec",
    "common.recentlyViewed": "A Ti Wo T\u1eb9\u0301l\u1eb9\u0300",
    "common.reviews": "\u00c0w\u00f2fin",
    "common.free": "\u1eccf\u1eb9",
    "common.paid": "A Ti San",
    // View
    "view.grid": "Grid",
    "view.list": "List",
    // Marketplace
    "market.listings": "Nkan T\u00ed W\u1ecdn",
    "market.postTask": "Fi I\u1e63\u1eb9 Sil\u1eb9",
    "market.findWork": "Wa I\u1e63\u1eb9",
    "market.sellItem": "Ta Nkan",
    "market.buyNow": "Ra N\u00ec",
    "market.addToCart": "Fi Sinu K\u00e1\u00e0t\u00ec",
    // Time
    "time.justNow": "L\u1eb9s\u1eb9k\u1eb9s\u1eb9",
    "time.minutesAgo": "i\u1e63\u1eb9j\u00fa s\u1eb9y\u00edn",
    "time.hoursAgo": "w\u00e1k\u00e0t\u00ed s\u1eb9y\u00edn",
    "time.daysAgo": "\u1ecds\u1eb9 s\u1eb9y\u00edn",
    "time.today": "\u1eccn\u00ec",
    "time.yesterday": "\u00c0n\u00e1",
    // Greetings
    "greet.welcomeBack": "K\u00e0 \u00e0b\u1ecbr\u1ecd",
    "greet.goodMorning": "E ku \u1ecds\u1eb9 kan",
    "greet.goodAfternoon": "E ku \u1ecds\u1eb9 m\u1eb9ta",
    "greet.goodEvening": "E ku irole",
    // Footer
    "footer.aboutUs": "N\u00ec T\u00ed A J\u1eb9",
    "footer.contact": "Kan Si Wa",
    "footer.privacyPolicy": "\u00ccgb\u1ecd\u1eb9 \u00c0d\u00e0\u00e1\u1e63\u1eb9",
    "footer.termsOfService": "\u00ccgb\u1ecd\u1eb9 I\u1e63\u1eb9",
    "footer.helpCenter": "Ile-Iranw\u1ecd",
  },

  ig: {
    // Navigation
    "nav.home": "Ulo",
    "nav.browse": "Ch\u1ecdgh\u1ecbr\u1ecba",
    "nav.post": "Dee Ihe",
    "nav.messages": "Ozi",
    "nav.notifications": "Mkpesa",
    "nav.profile": "Profile",
    "nav.settings": "N\u1ecdt\u1ee5\u1ee5",
    "nav.wallet": "Akpa Ego",
    "nav.dashboard": "Dashboard",
    "nav.login": "Bata",
    "nav.signUp": "Dee Aka",
    "nav.signUpFree": "Dee Aka N\u1ee5f\u1ee5",
    "nav.logOut": "P\u1ee5\u1ecd",
    "nav.sell": "Re",
    "nav.howItWorks": "Kedu Ka O Si Ar\u1ee5",
    "nav.contactUs": "Kp\u1ecdt\u1ee5r\u1ee5 Any\u1ecb",
    "nav.safety": "Nche",
    "nav.terms": "Usoro",
    "nav.privacy": "Nzuzo",
    "nav.about": "Maka",
    "nav.help": "Enyemaka",
    // Categories
    "cat.tasks": "\u1eccr\u1ee5",
    "cat.services": "\u1eccr\u1ee5 \u1ecbr\u1ee5",
    "cat.jobs": "\u1eccr\u1ee5 \u1ecbr\u1ee5",
    "cat.forSale": "Ihe E Re",
    "cat.community": "\u1ee4m\u1ee5nne",
    "cat.allCategories": "Nd\u1ecb \u1ecdt\u1ee5t\u1ee5",
    "cat.gigs": "\u1eccr\u1ee5 obere",
    // Actions
    "action.search": "Ch\u1ecdp\u1ee5ta",
    "action.searchPlaceholder": "Ch\u1ecdp\u1ee5ta ihe...",
    "action.filter": "Sie",
    "action.sort": "Dobe",
    "action.save": "Dee Ya",
    "action.share": "Kpee",
    "action.report": "Kpesa",
    "action.contact": "Nweta",
    "action.apply": "Tinye Akwukwo",
    "action.applyNow": "Tinye Akwukwo Ugbua",
    "action.viewDetails": "H\u1ee5 Ihe Nile",
    "action.makeOffer": "Inye Ego",
    // Status
    "status.pending": "I na-echere",
    "status.active": "Na-ar\u1ee5",
    "status.completed": "Emechara",
    "status.cancelled": "Kagbuo",
    "status.verified": "H\u1ee5r\u1ee5r\u1ee5",
    "status.new": "Mmad\u1ee5 \u1ecdh\u1ee5r\u1ee5",
    "status.featured": "Eto Etu",
    "status.urgent": "Ije nd\u1ecb \u1ecdgw\u1ee5",
    // Common
    "common.loading": "I na-ebubata...",
    "common.error": "Ihe mechara",
    "common.success": "Ihe mere nke \u1ecdma",
    "common.cancel": "Kagbuo",
    "common.confirm": "Kwenye",
    "common.submit": "Bugara",
    "common.delete": "Kpochap\u1ee5",
    "common.edit": "Dee Ule",
    "common.back": "Laa Az\u1ee5",
    "common.next": "N\u1ecb\u1ecbanye",
    "common.price": "Ego",
    "common.location": "Ebe",
    "common.recentlyViewed": "Ihe I H\u1ee5r\u1ee5 Nso Nso",
    "common.reviews": "Nlebanya",
    "common.free": "N\u1ee5f\u1ee5",
    "common.paid": "Ego E La",
    // View
    "view.grid": "Grid",
    "view.list": "List",
    // Marketplace
    "market.listings": "Ihe Nile",
    "market.postTask": "Dee \u1eccr\u1ee5",
    "market.findWork": "Ch\u1ecd\u1ecd \u1eccr\u1ee5",
    "market.sellItem": "Re Ihe",
    "market.buyNow": "Zua Ugbua",
    "market.addToCart": "Tinye Na Bag",
    // Time
    "time.justNow": "Ugbua",
    "time.minutesAgo": "nkeji gafere",
    "time.hoursAgo": "awa gafere",
    "time.daysAgo": "\u1ee5b\u1ecdst\u1ecb gafere",
    "time.today": "Taa",
    "time.yesterday": "Nnyaaf\u1ee5",
    // Greetings
    "greet.welcomeBack": "N\u1eebl\u1ee5 la Az\u1ee5",
    "greet.goodMorning": "\u1eeet\u1ee5t\u1ee5 \u1ecdma",
    "greet.goodAfternoon": "Ehihie \u1ecdma",
    "greet.goodEvening": "Mgbede \u1ecdma",
    // Footer
    "footer.aboutUs": "Maka Any\u1ecb",
    "footer.contact": "Kp\u1ecdt\u1ee5r\u1ee5 Any\u1ecb",
    "footer.privacyPolicy": "Iwu Nzuzo",
    "footer.termsOfService": "Iwu \u1eccr\u1ee5",
    "footer.helpCenter": "\u1eccn\u1ee5 \u1ecdg\u1ee5g\u1ee5 Enyemaka",
  },

  ha: {
    // Navigation
    "nav.home": "Gida",
    "nav.browse": "Bincika",
    "nav.post": "Sa",
    "nav.messages": "Sa\u2019",
    "nav.notifications": "Sanarwa",
    "nav.profile": "Profail",
    "nav.settings": "Saituna",
    "nav.wallet": "Aljin",
    "nav.dashboard": "Dasabodu",
    "nav.login": "Shiga",
    "nav.signUp": "Yi Rajista",
    "nav.signUpFree": "Yi Rajista Kyauta",
    "nav.logOut": "Fita",
    "nav.sell": "Sayarwa",
    "nav.howItWorks": "Yadda Yake Aiki",
    "nav.contactUs": "Tuntube Mu",
    "nav.safety": "Tsaro",
    "nav.terms": "Sharu\u0257\u0257a",
    "nav.privacy": "Sirri",
    "nav.about": "Game Mu",
    "nav.help": "Taimako",
    // Categories
    "cat.tasks": "Ayyuka",
    "cat.services": "Sabis",
    "cat.jobs": "Aikace",
    "cat.forSale": "Abin Sayarwa",
    "cat.community": "Al\u2019umma",
    "cat.allCategories": "Dukkan Rukuni",
    "cat.gigs": "Ayyukan \u0198arami",
    // Actions
    "action.search": "Bincike",
    "action.searchPlaceholder": "Bincika abu...",
    "action.filter": "Tace",
    "action.sort": "Yi jerin",
    "action.save": "Ajiye",
    "action.share": "Raba",
    "action.report": "Bayar da Rijista",
    "action.contact": "Tuntubi",
    "action.apply": "Aika",
    "action.applyNow": "Aika Yanzu",
    "action.viewDetails": "Duba Cikakkun Bayani",
    "action.makeOffer": "Ba da Farashi",
    // Status
    "status.pending": "Ana Jira",
    "status.active": "Tana Aiki",
    "status.completed": "An Kammala",
    "status.cancelled": "An Soke",
    "status.verified": "An Tabbatar",
    "status.new": "Sabuwa",
    "status.featured": "Tari",
    "status.urgent": "Gaggawa",
    // Common
    "common.loading": "Ana \u0300n\u0300sayarwa...",
    "common.error": "Abu ya faru",
    "common.success": "Nasara",
    "common.cancel": "Soke",
    "common.confirm": "Tabbatar",
    "common.submit": "Aika",
    "common.delete": "\u0300Cire",
    "common.edit": "Gyara",
    "common.back": "Bayan",
    "common.next": "Gaba",
    "common.price": "Farashi",
    "common.location": "Wuri",
    "common.recentlyViewed": "Kwanan Nan Ka Duba",
    "common.reviews": "Bita",
    "common.free": "Kyauta",
    "common.paid": "An Biya",
    // View
    "view.grid": "Grid",
    "view.list": "List",
    // Marketplace
    "market.listings": "Jerin Abubuwa",
    "market.postTask": "Sa Ayyuka",
    "market.findWork": "Nemo Aiki",
    "market.sellItem": "Sayar da Abu",
    "market.buyNow": "Sayi Yanzu",
    "market.addToCart": "Shiga Cikin Kanti",
    // Time
    "time.justNow": "A baya nan",
    "time.minutesAgo": "mintuna da suka wuce",
    "time.hoursAgo": "awowi da suka wuce",
    "time.daysAgo": "kwanaki da suka wuce",
    "time.today": "Yau",
    "time.yesterday": "Jiya",
    // Greetings
    "greet.welcomeBack": "Barka da zuwa",
    "greet.goodMorning": "Barka da safe",
    "greet.goodAfternoon": "Barka da rana",
    "greet.goodEvening": "Barka da yamma",
    // Footer
    "footer.aboutUs": "Game Mu",
    "footer.contact": "Tuntube Mu",
    "footer.privacyPolicy": "Manufar Sirri",
    "footer.termsOfService": "Yanayin Aiki",
    "footer.helpCenter": "Mazaunin Taimako",
  },
};
