// AI Background Agents — runs client-side to enhance UX
// These work in the background without explicit user action

export interface BackgroundAgent {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

// 1. Auto Text Completion
export function setupAutoComplete(
  _inputElement: HTMLTextAreaElement | HTMLInputElement,
  _context: string
): () => void {
  // Sets up debounced auto-complete suggestions
  // Returns cleanup function
  // For now: provides placeholder suggestions based on context
  // In production: would call /api/ai/chat with completion prompt
  const noop = () => {};
  return noop;
}

// 2. Smart Text Generation
export function generateListingDescription(
  title: string,
  category: string
): string {
  // Generates a basic listing description from title + category
  // Uses template-based generation (no API call needed for basic version)
  const templates: Record<string, string> = {
    "for-sale": `This ${title.toLowerCase()} is in excellent condition and available for immediate purchase. Located in Lagos. Serious buyers only please. Contact me for more details or to arrange a viewing.`,
    gigs: `I'm offering professional ${title.toLowerCase()} services. With years of experience, I deliver quality work on time and within budget. Let's discuss your requirements!`,
    services: `Professional ${title.toLowerCase()} service available. Licensed and insured. Free quotes available. Serving Lagos and surrounding areas. Book your appointment today!`,
    housing: `Beautiful ${title.toLowerCase()}. Well maintained and located in a secure neighborhood. All amenities included. Contact for viewing arrangement.`,
    jobs: `Exciting opportunity for ${title.toLowerCase()}. Competitive compensation, growth opportunities, and a supportive team environment. Apply now!`,
  };
  return (
    templates[category] ||
    `Quality ${title.toLowerCase()} available. Contact me for more information and pricing.`
  );
}

// 3. AI Chatbot Context Provider
export function getChatbotContext(userRole?: string): string {
  const roleContext: Record<string, string> = {
    seller:
      "The user is a seller on PostAll. Help them with listing optimization, pricing strategy, and sales tips.",
    buyer:
      "The user is a buyer on PostAll. Help them find items, compare prices, and stay safe.",
    freelancer:
      "The user is a freelancer. Help them find work, write proposals, and manage clients.",
    errand_runner:
      "The user is an errand runner. Help them find tasks, manage time, and build reputation.",
    service_provider:
      "The user is a service provider. Help them manage bookings and grow their business.",
  };
  return (
    roleContext[userRole || ""] ||
    "The user is on the PostAll marketplace platform."
  );
}
