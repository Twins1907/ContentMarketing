import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import type { BusinessInput } from "@/lib/ai";

// ============================================
// HELPERS
// ============================================

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function cycle<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatPlatformName(platform: string): string {
  const names: Record<string, string> = {
    tiktok: "TikTok",
    instagram: "Instagram",
    youtube: "YouTube",
    twitter: "X (Twitter)",
    linkedin: "LinkedIn",
    reddit: "Reddit",
    facebook: "Facebook",
    pinterest: "Pinterest",
    threads: "Threads",
  };
  return names[platform.toLowerCase()] || capitalize(platform);
}

// ============================================
// TEMPLATE DATA POOLS
// ============================================

const PERSONA_FIRST_NAMES = [
  "Alex", "Jordan", "Sam", "Taylor", "Morgan",
  "Casey", "Riley", "Quinn", "Avery", "Jamie",
];

const OCCUPATIONS_BY_INDUSTRY: Record<string, string[]> = {
  technology: ["Software Engineer", "Product Manager", "UX Designer", "Startup Founder", "IT Consultant"],
  fitness: ["Personal Trainer", "Gym Owner", "Health Coach", "Nutritionist", "Yoga Instructor"],
  food: ["Restaurant Owner", "Food Blogger", "Home Cook", "Catering Manager", "Culinary Student"],
  fashion: ["Fashion Designer", "Retail Manager", "Stylist", "Brand Manager", "E-commerce Owner"],
  education: ["Teacher", "Professor", "Online Course Creator", "Tutor", "Academic Advisor"],
  healthcare: ["Physician", "Nurse Practitioner", "Wellness Coach", "Therapist", "Pharmacist"],
  finance: ["Financial Advisor", "Accountant", "Investment Analyst", "Business Owner", "Entrepreneur"],
  realestate: ["Real Estate Agent", "Property Manager", "Home Stager", "Mortgage Broker", "Real Estate Investor"],
  beauty: ["Esthetician", "Makeup Artist", "Salon Owner", "Beauty Blogger", "Dermatologist"],
  marketing: ["Marketing Manager", "Brand Strategist", "Social Media Manager", "Content Creator", "Growth Hacker"],
  default: ["Small Business Owner", "Freelancer", "Manager", "Entrepreneur", "Consultant"],
};

function getOccupations(industry: string): string[] {
  const key = industry.toLowerCase().replace(/[^a-z]/g, "");
  return OCCUPATIONS_BY_INDUSTRY[key] || OCCUPATIONS_BY_INDUSTRY.default;
}

const INTERESTS_BY_INDUSTRY: Record<string, string[]> = {
  technology: ["AI and machine learning", "SaaS products", "Developer tools", "Tech podcasts", "Open source", "Productivity apps"],
  fitness: ["Workout routines", "Nutrition plans", "Athletic wear", "Recovery science", "Fitness apps", "Meal prepping"],
  food: ["Recipe blogs", "Kitchen gadgets", "Farm-to-table dining", "Food photography", "Cooking shows", "Cultural cuisines"],
  fashion: ["Trend forecasting", "Sustainable fashion", "Street style", "Luxury brands", "Thrift shopping", "Fashion weeks"],
  education: ["Lifelong learning", "EdTech platforms", "Study techniques", "Career development", "Online certifications", "Research methods"],
  healthcare: ["Preventive care", "Mental wellness", "Medical technology", "Health literacy", "Telemedicine", "Holistic health"],
  finance: ["Investment strategies", "Personal budgeting", "Crypto and fintech", "Tax planning", "Financial independence", "Market analysis"],
  realestate: ["Home design", "Property investment", "Interior decorating", "Market trends", "Smart home tech", "Neighborhood guides"],
  beauty: ["Skincare routines", "Clean beauty", "Hair tutorials", "Makeup trends", "Spa experiences", "Anti-aging products"],
  marketing: ["Growth hacking", "SEO strategies", "Content creation", "Brand storytelling", "Analytics tools", "Email marketing"],
  default: ["Industry trends", "Professional development", "Podcasts", "Networking events", "Online courses", "Business books"],
};

function getInterests(industry: string): string[] {
  const key = industry.toLowerCase().replace(/[^a-z]/g, "");
  return INTERESTS_BY_INDUSTRY[key] || INTERESTS_BY_INDUSTRY.default;
}

const PAIN_POINTS_TEMPLATES = [
  "Struggles to find trustworthy {{industry}} solutions",
  "Overwhelmed by too many options in the {{industry}} space",
  "Wants expert guidance but can't afford premium consultants",
  "Needs results quickly but doesn't know where to start",
  "Frustrated by generic advice that doesn't apply to their situation",
  "Skeptical of {{industry}} providers due to past bad experiences",
  "Has limited time to research and compare {{industry}} options",
  "Looking for a community of like-minded people in {{industry}}",
];

const CONTENT_PREFERENCES = [
  "Short-form video (under 60 seconds)",
  "Behind-the-scenes content",
  "How-to tutorials and guides",
  "Real customer testimonials",
  "Data-driven infographics",
  "Interactive polls and Q&As",
  "Before-and-after transformations",
  "Expert interviews and collabs",
  "Day-in-the-life content",
  "Trending audio and challenges",
];

const BUYING_BEHAVIORS = [
  "Researches extensively online before purchasing; reads reviews and comparisons. Values social proof and expert recommendations.",
  "Impulse buyer influenced by social media; responds to limited-time offers. Trusts brands with strong online presence.",
  "Price-conscious comparison shopper; waits for deals and promotions. Responds well to value-based messaging.",
  "Brand loyal once trust is established; prefers repeat purchases. Values consistent quality and customer service.",
  "Early adopter who tries new products readily; influenced by innovation and novelty. Active in online communities.",
];

// ============================================
// PLATFORM-SPECIFIC DATA
// ============================================

interface PlatformMeta {
  postingFrequency: string;
  bestTimes: string[];
  contentFormats: string[];
  keyTactics: string[];
  hashtagCount: number;
}

const PLATFORM_META: Record<string, PlatformMeta> = {
  tiktok: {
    postingFrequency: "1-2 times per day",
    bestTimes: ["7:00 AM", "12:00 PM", "7:00 PM", "10:00 PM"],
    contentFormats: ["Short-form video (15-60s)", "Duets and Stitches", "Trending sounds", "Photo carousels"],
    keyTactics: [
      "Hook viewers in the first 2 seconds",
      "Use trending sounds and hashtags",
      "Post consistently at peak times",
      "Engage with comments within the first hour",
      "Create series content that keeps viewers coming back",
    ],
    hashtagCount: 5,
  },
  instagram: {
    postingFrequency: "1 post per day + 3-5 Stories",
    bestTimes: ["8:00 AM", "11:00 AM", "2:00 PM", "5:00 PM"],
    contentFormats: ["Reels (15-90s)", "Carousel posts", "Stories with polls/quizzes", "Single image posts", "IG Live"],
    keyTactics: [
      "Use Reels for maximum reach",
      "Create shareable carousel content",
      "Leverage Stories for daily engagement",
      "Write compelling captions with CTAs",
      "Collaborate with micro-influencers in your niche",
    ],
    hashtagCount: 8,
  },
  youtube: {
    postingFrequency: "2-3 videos per week (mix of Shorts and long-form)",
    bestTimes: ["9:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"],
    contentFormats: ["YouTube Shorts (under 60s)", "Long-form tutorials (8-15 min)", "Vlogs", "Community posts"],
    keyTactics: [
      "Optimize titles and thumbnails for CTR",
      "Use Shorts to funnel to long-form content",
      "Create searchable evergreen tutorials",
      "Pin comments and engage with viewers",
      "Use end screens and cards for cross-promotion",
    ],
    hashtagCount: 3,
  },
  twitter: {
    postingFrequency: "3-5 tweets per day",
    bestTimes: ["8:00 AM", "12:00 PM", "5:00 PM", "9:00 PM"],
    contentFormats: ["Text threads", "Quote tweets", "Polls", "Image posts", "Short video clips"],
    keyTactics: [
      "Start threads with a strong hook",
      "Engage in trending conversations",
      "Quote tweet industry leaders with your take",
      "Use polls to drive engagement",
      "Build in public to attract followers",
    ],
    hashtagCount: 2,
  },
  linkedin: {
    postingFrequency: "3-5 times per week",
    bestTimes: ["7:30 AM", "10:00 AM", "12:00 PM", "5:30 PM"],
    contentFormats: ["Text posts with formatting", "Document carousels (PDFs)", "Short video (1-2 min)", "Articles", "Polls"],
    keyTactics: [
      "Lead with a bold first line to earn the click",
      "Share personal stories with professional lessons",
      "Post document carousels for high save rates",
      "Comment on others' posts to build visibility",
      "Use LinkedIn polls to spark conversation",
    ],
    hashtagCount: 4,
  },
  reddit: {
    postingFrequency: "3-4 contributions per week",
    bestTimes: ["6:00 AM", "8:00 AM", "12:00 PM"],
    contentFormats: ["Text posts", "AMA sessions", "Helpful comments", "Image posts", "Link shares"],
    keyTactics: [
      "Provide genuine value before any self-promotion",
      "Identify and engage in relevant subreddits",
      "Host AMAs to build authority",
      "Use Reddit's search to find questions you can answer",
      "Follow the 80/20 rule: 80% helpful content, 20% promotion",
    ],
    hashtagCount: 0,
  },
  facebook: {
    postingFrequency: "1 post per day",
    bestTimes: ["9:00 AM", "1:00 PM", "4:00 PM"],
    contentFormats: ["Video posts", "Photo albums", "Facebook Stories", "Live streams", "Group posts"],
    keyTactics: [
      "Prioritize video content for algorithm favor",
      "Create and nurture a Facebook Group",
      "Use Facebook Stories for daily touchpoints",
      "Encourage shares with relatable content",
      "Run targeted boosted posts for key content",
    ],
    hashtagCount: 3,
  },
  pinterest: {
    postingFrequency: "5-10 pins per day",
    bestTimes: ["8:00 PM", "11:00 PM", "2:00 AM", "9:00 AM"],
    contentFormats: ["Standard pins", "Idea pins", "Video pins", "Infographic pins", "Product pins"],
    keyTactics: [
      "Use keyword-rich pin descriptions for SEO",
      "Create tall, eye-catching pin images (2:3 ratio)",
      "Pin consistently using a scheduling tool",
      "Create boards around specific topics",
      "Link pins to landing pages and blog posts",
    ],
    hashtagCount: 5,
  },
  threads: {
    postingFrequency: "1-2 posts per day",
    bestTimes: ["8:00 AM", "12:00 PM", "6:00 PM", "9:00 PM"],
    contentFormats: ["Text posts", "Image posts", "Carousel slides", "Quote posts", "Reply threads"],
    keyTactics: [
      "Cross-promote from Instagram for initial reach",
      "Engage in trending conversations early",
      "Use a conversational, authentic tone",
      "Post hot takes and opinions to spark discussion",
      "Build reply threads to go deeper on topics",
    ],
    hashtagCount: 3,
  },
};

function getPlatformMeta(platform: string): PlatformMeta {
  return PLATFORM_META[platform.toLowerCase()] || PLATFORM_META.instagram;
}

// ============================================
// CONTENT PILLARS TEMPLATES
// ============================================

interface PillarTemplate {
  name: string;
  descriptionTemplate: string;
  topicTemplates: string[];
}

const PILLAR_POOL: PillarTemplate[] = [
  {
    name: "Education & Tips",
    descriptionTemplate: "Share expertise and teach your audience about {{industry}}. Position {{businessName}} as the go-to authority.",
    topicTemplates: [
      "Top 5 {{industry}} mistakes beginners make",
      "How to get started with {{industry}} the right way",
      "{{industry}} myths debunked by experts",
      "Quick tip: The one thing most people overlook in {{industry}}",
      "A beginner's guide to {{industry}} essentials",
    ],
  },
  {
    name: "Behind the Scenes",
    descriptionTemplate: "Pull back the curtain on {{businessName}}. Show the human side, daily operations, and the passion behind the brand.",
    topicTemplates: [
      "A day in the life at {{businessName}}",
      "How we make our {{industry}} process unique",
      "Meet the team behind {{businessName}}",
      "The story behind how {{businessName}} started",
      "Our workspace tour and tools we use daily",
    ],
  },
  {
    name: "Social Proof & Results",
    descriptionTemplate: "Showcase real results, testimonials, and case studies to build trust and credibility for {{businessName}}.",
    topicTemplates: [
      "Client success story: How we helped transform their {{industry}} experience",
      "Before and after: Real results from {{businessName}}",
      "What our customers are saying about {{businessName}}",
      "Case study: The strategy that delivered 3x results",
      "Why 100+ customers trust {{businessName}} for {{industry}}",
    ],
  },
  {
    name: "Engagement & Community",
    descriptionTemplate: "Spark conversations, build community, and foster relationships with {{businessName}}'s audience.",
    topicTemplates: [
      "This or that: {{industry}} edition",
      "What's your biggest {{industry}} challenge? Let us know!",
      "Poll: Which {{industry}} trend are you most excited about?",
      "Tag someone who needs to see this {{industry}} tip",
      "Q&A: Ask us anything about {{industry}}",
    ],
  },
  {
    name: "Trending & Cultural",
    descriptionTemplate: "Tap into trends, current events, and pop culture through the lens of {{businessName}} and {{industry}}.",
    topicTemplates: [
      "How {{businessName}} approaches the latest {{industry}} trend",
      "Our take on the viral {{industry}} debate",
      "Applying this week's trending meme to {{industry}}",
      "What this pop culture moment teaches us about {{industry}}",
      "Seasonal special: {{industry}} tips for this time of year",
    ],
  },
  {
    name: "Product & Service Showcase",
    descriptionTemplate: "Highlight what {{businessName}} offers, demonstrate value, and drive conversions without being salesy.",
    topicTemplates: [
      "3 ways {{businessName}} solves your biggest {{industry}} problem",
      "Feature spotlight: Why our customers love this",
      "How to get the most out of {{businessName}}'s offerings",
      "New launch: What we've been working on at {{businessName}}",
      "The {{businessName}} difference: What sets us apart in {{industry}}",
    ],
  },
  {
    name: "Inspiration & Motivation",
    descriptionTemplate: "Inspire your audience with stories, quotes, and mindset shifts related to {{industry}} and the {{businessName}} mission.",
    topicTemplates: [
      "The mindset shift that changed everything for {{businessName}}",
      "Why we believe everyone deserves great {{industry}} solutions",
      "Lessons learned from our toughest {{industry}} challenge",
      "Monday motivation: Your weekly dose of {{industry}} inspiration",
      "The journey of {{businessName}}: From idea to impact",
    ],
  },
  {
    name: "Industry News & Insights",
    descriptionTemplate: "Keep your audience informed about the latest developments, research, and trends in {{industry}}.",
    topicTemplates: [
      "Breaking down this week's biggest {{industry}} news",
      "What the latest {{industry}} research means for you",
      "{{industry}} trend report: What's coming next",
      "Our expert analysis on the state of {{industry}}",
      "3 {{industry}} predictions for the next 6 months",
    ],
  },
];

const INDUSTRY_PILLAR_OVERRIDES: Record<string, Record<string, string>> = {
  fashion: { "Education & Tips": "Style Guides & Tutorials", "Social Proof & Results": "Client Transformations", "Product & Service Showcase": "Collection Spotlights" },
  fitness: { "Education & Tips": "Workout Breakdowns", "Social Proof & Results": "Member Transformations", "Behind the Scenes": "Training Day Diaries" },
  food: { "Education & Tips": "Recipes & Kitchen Hacks", "Social Proof & Results": "Customer Favorites", "Behind the Scenes": "Kitchen Stories" },
  technology: { "Education & Tips": "Tech Tutorials & How-Tos", "Social Proof & Results": "Case Studies & ROI", "Product & Service Showcase": "Feature Deep Dives" },
  realestate: { "Education & Tips": "Home Buying Guides", "Social Proof & Results": "Sold Stories & Client Wins", "Product & Service Showcase": "Property Showcases" },
  healthcare: { "Education & Tips": "Health & Wellness Guides", "Social Proof & Results": "Patient Success Stories", "Engagement & Community": "Wellness Challenges" },
  finance: { "Education & Tips": "Money Mastery Tips", "Social Proof & Results": "Client Financial Wins", "Industry News & Insights": "Market Analysis & Forecasts" },
  marketing: { "Education & Tips": "Marketing Playbooks", "Social Proof & Results": "Campaign Case Studies", "Product & Service Showcase": "Strategy Breakdowns" },
  beauty: { "Education & Tips": "Beauty Tutorials & Routines", "Social Proof & Results": "Before & After Reveals", "Behind the Scenes": "Behind the Chair" },
  education: { "Education & Tips": "Learning Strategies", "Social Proof & Results": "Student Success Stories", "Engagement & Community": "Study Groups & Q&As" },
};

function getIndustryKey(industry: string): string {
  const key = industry.toLowerCase().replace(/[^a-z]/g, "");
  const mapping: Record<string, string> = {
    businessentrepreneurship: "marketing",
    marketingadvertising: "marketing",
    technologysaas: "technology",
    healthfitness: "fitness",
    personaldevelopment: "education",
    educationelearning: "education",
    financeinvesting: "finance",
    realestate: "realestate",
    fashionbeauty: "fashion",
    foodcooking: "food",
    travellifestyle: "marketing",
    entertainmentmedia: "marketing",
    creativedesign: "marketing",
    coachingconsulting: "marketing",
    ecommerceretail: "marketing",
  };
  return mapping[key] || "marketing";
}

function selectPillars(
  business: BusinessInput,
  count: number
): Array<{ name: string; description: string; percentage: number; exampleTopics: string[] }> {
  const industryKey = getIndustryKey(business.industry);
  const overrides = INDUSTRY_PILLAR_OVERRIDES[industryKey] || {};

  // Choose prioritized pillars based on goals
  const goalPillarMap: Record<string, string> = {
    "Brand Awareness": "Trending & Cultural",
    "Lead Generation": "Product & Service Showcase",
    "Sales & Conversions": "Product & Service Showcase",
    "Community Building": "Engagement & Community",
    "Thought Leadership": "Industry News & Insights",
    "Customer Retention": "Behind the Scenes",
    "Website Traffic": "Education & Tips",
    "Product Launches": "Product & Service Showcase",
  };

  // Always include Education & Tips, then pick based on first goal
  const prioritized: string[] = ["Education & Tips"];
  const firstGoal = business.goals?.[0];
  if (firstGoal && goalPillarMap[firstGoal]) {
    const goalPillar = goalPillarMap[firstGoal];
    if (!prioritized.includes(goalPillar)) {
      prioritized.push(goalPillar);
    }
  }
  if (prioritized.length < 2) {
    prioritized.push("Social Proof & Results");
  }

  const selected: PillarTemplate[] = [];

  for (const name of prioritized) {
    const pillar = PILLAR_POOL.find((p) => p.name === name);
    if (pillar && selected.length < count) selected.push(pillar);
  }

  const remaining = PILLAR_POOL.filter((p) => !prioritized.includes(p.name));
  for (let i = remaining.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
  }

  for (const pillar of remaining) {
    if (selected.length >= count) break;
    selected.push(pillar);
  }

  // Create varied percentages based on pillar importance (first 2 are prioritized)
  const percentageDistributions: Record<number, number[]> = {
    2: [60, 40],
    3: [40, 35, 25],
    4: [35, 30, 20, 15],
    5: [30, 25, 20, 15, 10],
  };
  const distribution = percentageDistributions[count] || percentageDistributions[4];

  return selected.map((pillar, i) => {
    const fill = (s: string) =>
      s
        .replace(/\{\{businessName\}\}/g, business.businessName)
        .replace(/\{\{industry\}\}/g, business.industry);

    // Apply industry-specific name override
    const displayName = overrides[pillar.name] || pillar.name;

    return {
      name: displayName,
      description: fill(pillar.descriptionTemplate),
      percentage: distribution[i] || 10,
      exampleTopics: pillar.topicTemplates.map(fill),
    };
  });
}

// ============================================
// HOOK / SCRIPT / VISUAL / CAPTION / CTA
// ============================================

const HOOK_TEMPLATES = [
  "Stop scrolling — here's the ONE {{industry}} mistake that's costing you clients right now.",
  "We tracked our {{industry}} results for 90 days. Day 1 vs Day 90 will surprise you.",
  "\"We can't afford that\" — here's how {{businessName}} makes {{industry}} work on any budget.",
  "3 things every {{industry}} business should be doing this week (most aren't).",
  "POV: You just found the {{industry}} account you've been looking for.",
  "Hot take: The most popular {{industry}} advice is actually hurting your growth.",
  "We asked our top clients what made them choose {{businessName}}. The #1 answer wasn't price.",
  "Here's exactly how we'd grow a {{industry}} brand from 0 to 10K followers.",
  "The 5-minute {{industry}} audit that shows you what's broken (and how to fix it).",
  "Your competitors are doing THIS and you're not. Let's fix that today.",
  "\"I wish I started this sooner\" — what every {{businessName}} client says after week 1.",
  "If your {{industry}} strategy looks like this... we need to talk 🚩",
  "The real reason your {{industry}} content isn't getting engagement (it's not the algorithm).",
  "This one framework changed how {{businessName}} approaches every single {{industry}} project.",
  "New here? Start with this — {{businessName}}'s complete {{industry}} starter guide in 60 seconds.",
  "What does a successful {{industry}} strategy actually look like? Let us show you.",
  "Behind the scenes: How {{businessName}} plans, creates, and posts every single week.",
  "The question we get asked most at {{businessName}} (and our honest answer).",
  "Day {{dayNumber}} of sharing {{industry}} insights that actually move the needle.",
  "Your {{industry}} checklist for this week — screenshot this and get to work.",
  "\"But does it actually work?\" — here's our real data from the last 30 days.",
  "The difference between {{industry}} businesses that grow and ones that stay stuck.",
  "We're giving away our exact {{industry}} playbook. No gatekeeping. No catch.",
  "Before you post your next piece of {{industry}} content, watch this first.",
  "If you could only do ONE thing to improve your {{industry}} results, do this.",
  "What nobody tells you about growing a {{industry}} brand on social media.",
  "We made every {{industry}} mistake so you don't have to. Here are the top 5.",
  "Your audience is telling you exactly what they want. Here's how to listen.",
  "This is what {{businessName}} does every Monday to stay ahead in {{industry}}.",
  "Steal our process: How {{businessName}} turns one idea into a week of {{industry}} content.",
];

const INDUSTRY_HOOKS: Record<string, string[]> = {
  technology: [
    "We replaced 4 tools with 1 workflow. Here's the exact setup {{businessName}} uses daily.",
    "The 3-step automation that saves our {{industry}} team 12 hours every single week.",
    "\"Your tech stack is too complicated.\" Here's {{businessName}}'s simplified approach.",
    "We A/B tested our onboarding flow for 60 days. The winner increased conversions by 47%.",
    "Every {{industry}} founder should know these 5 free tools. We use #3 every day at {{businessName}}.",
    "The code review process at {{businessName}} that cut our bug rate in half.",
    "Your product demo is losing you customers. Here's the 4-slide framework we use instead.",
  ],
  fitness: [
    "This 3-exercise warm-up takes 4 minutes and prevents 90% of common gym injuries.",
    "We measured 200 client results at {{businessName}}. The #1 factor wasn't diet or training — it was this.",
    "The exact rep scheme {{businessName}} programs for clients who want strength AND muscle.",
    "Stop doing 60-minute workouts. Here's the 30-minute {{businessName}} protocol that gets better results.",
    "Your post-workout routine is killing your gains. Replace it with these 3 steps.",
    "The grocery list our {{businessName}} nutritionist gives every new client on day one.",
    "This mobility routine takes 5 minutes. Do it before every session — your joints will thank you.",
  ],
  food: [
    "5 ingredients. 12 minutes. The weeknight dinner that gets requested on repeat.",
    "Restaurant chefs use this seasoning trick on everything. Once you know, you can't go back.",
    "{{businessName}} tested 30 pasta sauces. Here's the 3-ingredient winner your family will love.",
    "You're chopping onions wrong. This technique is faster, safer, and gives better texture.",
    "The pantry staple swap that makes every recipe healthier without changing the taste.",
    "This one-pan meal prep feeds 4 people for 3 days. Total cost: under $25.",
    "The exact order to add spices to your pan (most home cooks get step 2 wrong).",
  ],
  fashion: [
    "The 6-piece capsule formula that creates 20+ outfits. Here's every piece and why it works.",
    "These 3 fit rules make any outfit look $500 even when it cost $50.",
    "{{businessName}}'s 5-minute morning outfit formula: pick 1 from each category and you're done.",
    "Stop buying trends. These 4 silhouettes have been in style for 10+ years — and will be for 10 more.",
    "The color matching cheat sheet that makes every combination look intentional.",
    "We spent $2000 on \"investment pieces\" and $200 on basics. Here's what we actually wore.",
    "The tucking, cuffing, and layering tricks that make basics look editorial.",
  ],
  finance: [
    "The 50/30/20 rule is outdated. Here's the budget split {{businessName}} recommends for 2026.",
    "We tracked 500 client portfolios. The ones who did THIS one thing outperformed by 23%.",
    "The 3 bank accounts every person should have open right now (and exactly how to use each one).",
    "Your emergency fund number is wrong. Here's the exact formula {{businessName}} uses to calculate yours.",
    "The tax-advantaged account most people don't know exists. It could save you $3K+ per year.",
    "{{businessName}}'s weekly money routine: 15 minutes every Sunday that keeps your finances on track.",
    "The debt payoff strategy that saves the most interest (it's not what Dave Ramsey says).",
  ],
  marketing: [
    "We posted 100 Reels in 30 days. Here are the 4 formats that actually drove followers and sales.",
    "The exact content calendar template {{businessName}} uses for every client. Steal it.",
    "Your funnel has a leak. 9 times out of 10, it's on this page. Here's how to fix it in 20 minutes.",
    "We split-tested 30 ad creatives. The winning pattern was the simplest one.",
    "The email subject line formula that gets {{businessName}} a 42% open rate. Every. Single. Time.",
    "Stop making content for algorithms. Start making it for THIS person instead.",
    "{{businessName}}'s 3-step brand story framework that turns followers into paying customers.",
  ],
};

function getIndustryHooks(industry: string): string[] {
  const key = getIndustryKey(industry);
  return INDUSTRY_HOOKS[key] || [];
}

const SCRIPT_TEMPLATES = [
  "[0-3s] TEXT ON SCREEN: \"{{hookShort}}\" — Face to camera, energetic delivery.\n[3-10s] \"Here's what most people get wrong...\" — explain the core problem in {{industry}}. B-roll of the mistake in action.\n[10-20s] \"Instead, try this:\" — walk through the specific fix. Show each step visually. TEXT OVERLAY: step numbers 1, 2, 3.\n[20-28s] \"We've used this exact method at {{businessName}} and here's what happened...\" — show result/proof.\n[28-30s] TEXT ON SCREEN: \"Follow {{businessName}} for more\" — point to username.",
  "[0-2s] TEXT ON SCREEN: \"{{hookShort}}\" — quick zoom-in on face, dramatic pause.\n[2-8s] \"Let me show you exactly what I mean.\" — screen recording or close-up demonstration of the {{industry}} technique.\n[8-18s] Step-by-step tutorial. TEXT OVERLAYS appear for each step: \"Step 1: [action]\" → \"Step 2: [action]\" → \"Step 3: [action]\". Voice narrates each step clearly.\n[18-25s] \"The result speaks for itself\" — show the before/after or final outcome.\n[25-30s] \"Save this for later. Follow {{businessName}} for the full breakdown.\" — TEXT ON SCREEN: 💾 Save | 👆 Follow.",
  "[0-3s] Green screen or face-to-camera: \"Okay, here's the {{industry}} cheat sheet nobody's sharing.\"\n[3-7s] POINT 1 — TEXT OVERLAY: bold text with the first tip. 2-sentence voiceover explaining why it matters.\n[7-11s] POINT 2 — quick cut transition. TEXT OVERLAY: second tip. Show a visual example.\n[11-15s] POINT 3 — TEXT OVERLAY: third tip. \"This one's my favorite because...\" explain briefly.\n[15-20s] \"{{businessName}} uses all three of these every single week. That's why our clients see results.\"\n[20-22s] TEXT ON SCREEN: \"Which one are you trying first? Comment below 👇\" — point down.",
  "[0-4s] COLD OPEN — no intro. Jump straight into the story: \"Last month, a {{industry}} client came to us with a problem...\"\n[4-12s] Set the scene. What was going wrong? Paint the picture with specifics. TEXT OVERLAY: \"The Problem\" with a brief summary.\n[12-20s] \"Here's exactly what we changed:\" — Reveal the strategy {{businessName}} applied. TEXT OVERLAY: the key actions taken.\n[20-26s] \"Within 2 weeks, here's what happened...\" — Show the outcome. Use numbers or visuals.\n[26-30s] \"If you're dealing with something similar, DM {{businessName}}. We'll tell you exactly where to start.\" TEXT ON SCREEN: DM us \"START\".",
  "[0-2s] TEXT ON SCREEN: \"MYTH vs REALITY\" — dramatic sound effect.\n[2-7s] \"Most people in {{industry}} believe [common misconception].\" — TEXT OVERLAY: ❌ MYTH in red. Let it sit for a beat.\n[7-15s] \"But here's what the data actually shows...\" — flip to ✅ REALITY in green. Present the fact with proof. Show data visualization if possible.\n[15-22s] \"At {{businessName}}, we figured this out the hard way. Here's what we do now instead:\" — specific alternative approach.\n[22-28s] \"This single shift changed everything for our clients.\"\n[28-30s] TEXT ON SCREEN: \"More myths we're busting → Follow {{businessName}}\" — follow gesture.",
  "[0-3s] TEXT ON SCREEN: \"TUTORIAL: [specific technique]\" — clean, direct opening.\n[3-8s] \"Step 1:\" — Close-up of the action. Hands visible or screen share. Voice explains WHAT to do and WHY. TEXT OVERLAY: \"Step 1: [action]\".\n[8-13s] \"Step 2:\" — Next action with clear visual. TEXT OVERLAY: \"Step 2: [action]\". \"This is where most people mess up, so pay attention.\"\n[13-18s] \"Step 3:\" — Final step shown in full. TEXT OVERLAY: \"Step 3: [action]\". \"And that's it.\"\n[18-25s] Show the finished result. \"See how clean that is? This is what {{businessName}} does for every client.\"\n[25-30s] TEXT ON SCREEN: \"Save this tutorial 💾\" — CTA to follow and save.",
  "[0-3s] Split-screen setup — LEFT SIDE: \"Before\" label. RIGHT SIDE: \"After\" label.\n[3-10s] LEFT: Show the problem state — messy, inefficient, or outdated approach to {{industry}}. Voice: \"This is what most {{industry}} businesses look like.\"\n[10-18s] RIGHT: Reveal the transformation — clean, optimized, professional result. Voice: \"And this is after applying {{businessName}}'s approach.\"\n[18-25s] Back to face: \"The difference? Three specific changes...\" — list them with TEXT OVERLAYS numbered 1-2-3.\n[25-30s] TEXT ON SCREEN: \"Want the same transformation? Link in bio.\" — {{businessName}} branding.",
  "[0-2s] TEXT ON SCREEN: \"5 things about {{industry}} you need to know\" — countdown style.\n[2-6s] \"#5:\" TEXT OVERLAY with the tip. Quick 1-sentence explanation. Snappy transition.\n[6-10s] \"#4:\" TEXT OVERLAY. Visual example or b-roll. \"Most people skip this one.\"\n[10-14s] \"#3:\" TEXT OVERLAY. \"This is the game changer.\" Show proof or data point.\n[14-18s] \"#2:\" TEXT OVERLAY. \"{{businessName}} learned this the hard way.\" Quick story beat.\n[18-24s] \"And #1...\" — dramatic pause — TEXT OVERLAY with the top insight. Spend extra time on this one.\n[24-30s] \"Save this list. Share it with someone in {{industry}}. Follow {{businessName}} for more.\" — TEXT ON SCREEN: 💾 + 👤 + ➕.",
  "[0-3s] \"Day in the life at {{businessName}}\" — TEXT ON SCREEN with time stamp: \"7:30 AM\". Show morning routine/workspace setup.\n[3-8s] \"9:00 AM\" — Show the core work: team meeting, client review, content planning. Voice: \"First thing we tackle is...\"\n[8-15s] \"11:00 AM\" — Show a specific {{industry}} task being done. Authentic, not overly polished. \"This is where the real work happens.\"\n[15-22s] \"2:00 PM\" — Show results: completed project, client feedback, metrics dashboard. \"And this is why we love what we do.\"\n[22-28s] \"The biggest lesson? In {{industry}}, consistency beats perfection every single time.\"\n[28-30s] TEXT ON SCREEN: \"Follow {{businessName}} for more behind-the-scenes\" — wave or thumbs up.",
  "[0-3s] Face to camera, leaning in: \"Can I be honest about something in {{industry}}?\" — pause for effect.\n[3-10s] \"Everyone's telling you to do [popular advice]. But at {{businessName}}, we stopped doing that 6 months ago.\" TEXT OVERLAY: ❌ crossed out old approach.\n[10-18s] \"Here's what we replaced it with, and why it works 3x better:\" — TEXT OVERLAY shows the new approach. Walk through the logic with visual examples.\n[18-25s] \"The numbers don't lie:\" — show specific metrics or results. TEXT OVERLAY: key stat.\n[25-30s] \"Agree? Disagree? Drop your take in the comments. Follow {{businessName}} for more real talk about {{industry}}.\" TEXT ON SCREEN: \"Comment your take 👇\".",
];

const VISUAL_DIRECTION_WITH_ASSETS = [
  "ASSET: Use {{assetType}} as the hero image/video.\nLAYOUT: Full-bleed {{assetType}} with a semi-transparent dark overlay on the bottom 30%. Place the hook text in bold white sans-serif over the overlay.\nBRANDING: {{businessName}} logo watermark in top-right corner at 40% opacity. Brand accent color as a thin border or underline on the text.\nFORMAT: 1080x1350px (portrait) for feed. Export at 2x for sharpness.",
  "ASSET: Feature {{assetType}} as a side-by-side comparison.\nLAYOUT: Split screen — {{assetType}} on the left (60% width), text card on the right (40% width) with key bullet points. Use a divider line in brand accent color.\nTEXT ON ASSET: 3 short bullet points (max 8 words each) with numbered icons. Hook text at top in bold.\nBRANDING: {{businessName}} handle at bottom. Consistent brand font throughout.",
  "ASSET: {{assetType}} as a background with text overlay panels.\nLAYOUT: Blur the {{assetType}} slightly (gaussian blur 8px) and overlay 3 semi-transparent white cards with key points. Hook text at the very top in large bold font.\nTEXT ON ASSET: Each card has a bold headline + 1-line subtext. Use icons (checkmark, arrow, star) next to each point.\nBRANDING: {{businessName}} logo centered at bottom with a subtle drop shadow.",
  "ASSET: {{assetType}} as the opening 3 seconds of a video.\nLAYOUT: Start with the {{assetType}} in full frame, zoom in slightly (Ken Burns effect), then transition to text frames. Each text frame: solid brand-color background with centered white text.\nTEXT ON SCREEN: Frame 1: Hook. Frame 2: Key point. Frame 3: CTA. Each frame visible for 3-4 seconds.\nBRANDING: {{businessName}} lower-third bar throughout.",
  "ASSET: {{assetType}} combined with a branded template frame.\nLAYOUT: {{assetType}} placed inside a rounded-corner frame (like a phone mockup or polaroid). Surrounding space is solid brand color. Hook text above the frame, CTA text below.\nTEXT ON ASSET: Bold headline above: max 10 words. Subtitle below: max 15 words. Both centered.\nBRANDING: {{businessName}} logo at the very bottom, small and clean.",
];

const VISUAL_DIRECTION_WITHOUT_ASSETS = [
  "SHOOT DIRECTION: Film a talking-head video — speaker facing camera, frame from mid-chest up. Use natural window light from the left side. Background: clean wall, bookshelf, or desk setup. Phone on a tripod at eye level.\nTEXT ON SCREEN: Hook text appears in the first 2 seconds (bold, white, centered). Key points appear as lower-third captions throughout. Use a consistent sans-serif font.\nBRANDING: {{businessName}} username in the top-left corner throughout.",
  "DESIGN DIRECTION: Create a bold graphic post.\nLAYOUT: Solid background in brand primary color. Center-aligned white text with the hook in large font (48pt+). Below: 3 bullet points with emoji icons, each on its own line. Bottom: CTA in a contrasting pill-shaped button.\nFONTS: Display font for headline, clean sans-serif for body. Line spacing 1.5x.\nSIZE: 1080x1350px for Instagram/Facebook, 1080x1920px for Stories/TikTok.",
  "DESIGN DIRECTION: Create an infographic-style post.\nLAYOUT: Title bar at top (brand color background, white bold text). Body divided into 3 numbered sections with icon + short description for each. Each section has a thin divider line. Footer bar with CTA.\nICONS: Use simple line icons (lightbulb, target, checkmark, chart). Keep them single-color in brand accent.\nSIZE: 1080x1350px. Use at least 16pt font for mobile readability.",
  "SHOOT DIRECTION: Record a screen capture tutorial or demonstration.\nSETUP: Clean desktop with only relevant apps open. Use a cursor highlighter plugin. Record at 1080p minimum.\nTEXT ON SCREEN: Step numbers appear as overlays (\"Step 1\", \"Step 2\", etc.) in brand-colored badges. Add a title bar at top with the topic. Include {{businessName}} branding in corner.\nAUDIO: Voiceover narrating each step, or use captions only (no music needed).",
  "DESIGN DIRECTION: Create a quote-style graphic with a twist.\nLAYOUT: Light textured background (paper grain or subtle gradient). The key insight as a large pull quote in the center with oversized quotation marks in brand accent color. Attribution line: \"— {{businessName}}\". Below the quote: a 1-line expansion or context sentence.\nFONTS: Serif or display font for the quote, sans-serif for attribution.\nSIZE: 1080x1080px (square). High contrast for readability.",
];

const CTA_TEMPLATES = [
  "Save this post + follow {{businessName}} so you don't miss tomorrow's {{industry}} breakdown.",
  "Screenshot this checklist and share it with someone who needs it today.",
  "Comment \"GUIDE\" and we'll DM you the full breakdown for free.",
  "Link in bio → download the free {{industry}} cheat sheet from {{businessName}}.",
  "Tag a friend who's building a {{industry}} brand — they need to see this.",
  "Follow {{businessName}} for one new {{industry}} tip every single day this month.",
  "Send this to your business partner — you'll both thank us later.",
  "Like this if you agree, comment if you disagree. Let's debate 👇",
  "DM {{businessName}} the word \"START\" and we'll send you our starter toolkit.",
  "Tap the link in our bio to book a free 15-min {{industry}} strategy call.",
  "Comment your biggest {{industry}} challenge below — we'll reply with a tip.",
  "💾 Bookmark this for your next content planning session. You'll need it.",
];

const INDUSTRY_CTAS: Record<string, string[]> = {
  technology: ["Comment \"DEMO\" and we'll send you a free trial link to {{businessName}}.", "Star our repo on GitHub — link in bio. Your feedback shapes the next release.", "Book a free 15-min product walkthrough → link in {{businessName}}'s bio."],
  fitness: ["DM \"CHALLENGE\" to join our free 7-day {{businessName}} transformation challenge.", "Book your free body assessment at {{businessName}} — spots fill up fast. Link in bio.", "Download the free 4-week workout plan — DM {{businessName}} the word \"PLAN\"."],
  food: ["Make this recipe tonight and tag @{{businessName}} — we repost our favorites every Friday!", "Order from {{businessName}} this week and use code SOCIAL for 10% off. Link in bio.", "DM \"RECIPE\" and we'll send you this week's meal prep guide from {{businessName}}."],
  fashion: ["Shop this exact look → tap the link in {{businessName}}'s bio before it sells out.", "Book a free virtual styling session with {{businessName}} — DM us \"STYLE\" to reserve your spot.", "Join the {{businessName}} insider list for first access to new drops. Link in bio."],
  finance: ["Book your free 20-minute financial review with {{businessName}} → link in bio.", "DM \"TOOLKIT\" and we'll send you {{businessName}}'s free budget spreadsheet template.", "Subscribe to {{businessName}}'s weekly money newsletter — link in bio. It's free."],
  marketing: ["DM \"AUDIT\" and we'll send you a free content scorecard from {{businessName}}.", "Book a free 30-min strategy call with {{businessName}} — link in bio. Limited slots this month.", "Download {{businessName}}'s full content playbook for free — comment \"PLAYBOOK\" and we'll DM the link."],
};

function getIndustryCtas(industry: string): string[] {
  const key = getIndustryKey(industry);
  return INDUSTRY_CTAS[key] || [];
}

const CAPTION_TEMPLATES = [
  "{{hook}}\n\nHere's the breakdown:\n\n→ Most {{industry}} businesses skip this step entirely\n→ The ones who don't? They grow 2-3x faster\n→ It takes 10 minutes to set up (we'll show you how)\n\nWe've been doing this at {{businessName}} for over a year and it's changed everything about how we approach {{industry}}.\n\nThe full guide is in the video above. Watch it, save it, share it with someone who needs it.\n\n{{cta}}",
  "Real talk from {{businessName}} 👇\n\n{{hook}}\n\nWe learned this the hard way in {{industry}}. After months of trying what everyone else was doing and getting nowhere, we stripped everything back.\n\nWhat actually worked:\n✅ Focus on one thing at a time\n✅ Measure what matters, ignore vanity metrics\n✅ Show up consistently even when growth feels slow\n\nThe results weren't overnight — but they compounded.\n\n{{cta}}",
  "{{hook}}\n\nAt {{businessName}}, we don't gatekeep. Here's exactly what we'd tell a new {{industry}} business in their first 30 days:\n\nWeek 1: Nail your message. Who are you? Who do you serve? What makes you different?\nWeek 2: Pick ONE platform and go deep.\nWeek 3: Create 7 pieces of content using this exact framework.\nWeek 4: Analyze, adjust, repeat.\n\nSimple doesn't mean easy. But it works.\n\n{{cta}}",
  "Save this one. You'll need it. 💾\n\n{{hook}}\n\n{{businessName}}'s 3-step formula that works every time:\n\n1️⃣ Lead with the problem your audience actually has (not the one you think they have)\n2️⃣ Show the solution in action — don't just talk about it, demonstrate it\n3️⃣ Give them ONE clear next step — not five, not ten, just one\n\nWe've used this on every single {{industry}} campaign and it hasn't failed yet.\n\n{{cta}}",
  "{{hook}}\n\nSwipe through for the full breakdown ➡️\n\nWe put this together because we kept getting the same question at {{businessName}}: \"Where do I even start with {{industry}}?\"\n\nThis is your starting point. No fluff. No theory. Just the exact steps we follow.\n\nDrop a 🔥 in the comments if this was helpful — we'll make a part 2 if enough people want it.\n\n{{cta}}",
  "Honest question for the {{industry}} community:\n\n{{hook}}\n\nHere's what we've found at {{businessName}} after working with dozens of {{industry}} clients:\n\n• The ones who succeed all have one thing in common — they start before they're ready\n• The ones who struggle? They spend months planning and never execute\n\nProgress beats perfection. Every single time.\n\nWhat's your experience? Drop a comment below 👇\n\n{{cta}}",
  "{{hook}}\n\nNo gatekeeping from {{businessName}}. Here's our actual process:\n\n📋 Step 1: Audit what's working and what's not (be brutally honest)\n🎯 Step 2: Pick the 20% of actions that drive 80% of results\n📅 Step 3: Block time on your calendar to do those things EVERY week\n📊 Step 4: Review your numbers monthly and adjust\n\nThat's it. That's the whole strategy. The magic is in the consistency, not the complexity.\n\n{{cta}}",
  "This goes out to everyone grinding in {{industry}} right now 💪\n\n{{hook}}\n\nAt {{businessName}}, we believe in building in public. So here's what our actual week looks like:\n\n• Monday: Plan the week's content around one core theme\n• Tuesday-Thursday: Create, batch, and schedule\n• Friday: Engage, respond, and build community\n• Weekend: Rest (yes, really)\n\nConsistency > perfection. Always.\n\n{{cta}}",
  "{{hook}}\n\nWe asked ourselves this question at {{businessName}} six months ago. Here's the honest answer:\n\nWhat changed: Our approach to {{industry}} content. We stopped trying to go viral and started trying to be useful.\n\nWhat happened: Engagement went up 47%. DMs tripled. And sales? They followed.\n\nThe lesson: Your audience doesn't want entertainment. They want transformation.\n\nAgree? Disagree? We want to hear your take.\n\n{{cta}}",
  "If you're in {{industry}}, bookmark this right now 📌\n\n{{hook}}\n\n{{businessName}}'s quick wins you can implement TODAY:\n\n🔹 Update your bio to clearly state what you do and who you help\n🔹 Pin your best-performing post to the top of your profile\n🔹 Respond to every comment within the first hour of posting\n🔹 Use the caption to tell a story, not just describe the image\n\nSmall changes. Big impact. Start with one.\n\n{{cta}}",
];

const STRATEGIC_REASONING_TEMPLATES = [
  "This post targets the {{pillar}} pillar to build authority in {{industry}}. Posting on {{platform}} at peak engagement time maximizes reach with {{businessName}}'s target audience. The hook is designed to stop scrollers and create curiosity.",
  "{{pillar}} content performs well mid-week when {{platform}} engagement peaks. This brief balances education with brand personality, reinforcing {{businessName}}'s position as a trusted {{industry}} voice.",
  "Strategically placed {{pillar}} post to maintain content variety. {{platform}}'s algorithm favors this format, and the topic aligns with what {{businessName}}'s audience is actively searching for in {{industry}}.",
  "This {{pillar}} brief is designed to drive saves and shares on {{platform}} -- high-value signals for algorithmic boost. The content directly addresses a key pain point of {{businessName}}'s target audience.",
  "Engagement-focused {{pillar}} content timed for {{platform}}'s highest-traffic window. The conversational approach builds community while subtly positioning {{businessName}} as the go-to in {{industry}}.",
  "This {{pillar}} post maintains the content mix balance for the week. It introduces a new angle on {{industry}} that {{businessName}}'s audience hasn't seen, driving curiosity and profile visits.",
  "Leveraging {{platform}}'s preference for {{pillar}}-style content. This brief is optimized for shareability, which will expand {{businessName}}'s reach beyond existing followers in the {{industry}} space.",
  "Data shows that {{pillar}} content drives the highest conversion rates on {{platform}}. This brief moves the audience closer to action while maintaining {{businessName}}'s authentic {{industry}} voice.",
  "Day {{dayNumber}} continues the momentum built earlier in the week. This {{pillar}} piece on {{platform}} serves as a touchpoint that keeps {{businessName}} top-of-mind for the audience.",
  "This {{pillar}} post was scheduled for {{platform}} to diversify the weekly content mix. It ties directly to the goal of strengthening {{businessName}}'s {{industry}} brand positioning.",
];

// ============================================
// CONTENT FORMAT PER PLATFORM
// ============================================

interface ContentFormatOption {
  format: string;
  isCarousel: boolean;
  slideCount?: number;
  weight: number;
}

const PLATFORM_CONTENT_FORMATS: Record<string, ContentFormatOption[]> = {
  tiktok: [
    { format: "Short-form Video (15-30s)", isCarousel: false, weight: 4 },
    { format: "Short-form Video (30-60s)", isCarousel: false, weight: 3 },
    { format: "Photo Carousel (3 slides)", isCarousel: true, slideCount: 3, weight: 2 },
    { format: "Duet / Stitch Video", isCarousel: false, weight: 1 },
  ],
  instagram: [
    { format: "Reel (15-30s)", isCarousel: false, weight: 4 },
    { format: "Carousel Post (3 slides)", isCarousel: true, slideCount: 3, weight: 3 },
    { format: "Carousel Post (5 slides)", isCarousel: true, slideCount: 5, weight: 2 },
    { format: "Single Image Post", isCarousel: false, weight: 2 },
    { format: "Story Sequence (3 frames)", isCarousel: true, slideCount: 3, weight: 1 },
  ],
  youtube: [
    { format: "YouTube Short (30-60s)", isCarousel: false, weight: 4 },
    { format: "Long-form Video (8-12 min)", isCarousel: false, weight: 2 },
    { format: "Community Post", isCarousel: false, weight: 1 },
  ],
  twitter: [
    { format: "Text Thread (3 tweets)", isCarousel: false, weight: 3 },
    { format: "Single Image Tweet", isCarousel: false, weight: 3 },
    { format: "Short Video Clip (15-30s)", isCarousel: false, weight: 2 },
    { format: "Poll Tweet", isCarousel: false, weight: 1 },
  ],
  linkedin: [
    { format: "Document Carousel (5 slides)", isCarousel: true, slideCount: 5, weight: 3 },
    { format: "Text Post with Image", isCarousel: false, weight: 3 },
    { format: "Short Video (1-2 min)", isCarousel: false, weight: 2 },
    { format: "Text-only Post", isCarousel: false, weight: 1 },
  ],
  reddit: [
    { format: "Text Post", isCarousel: false, weight: 4 },
    { format: "Image Post", isCarousel: false, weight: 2 },
    { format: "Link Post", isCarousel: false, weight: 1 },
  ],
  facebook: [
    { format: "Video Post (1-3 min)", isCarousel: false, weight: 3 },
    { format: "Photo Album (4 images)", isCarousel: true, slideCount: 4, weight: 2 },
    { format: "Single Image Post", isCarousel: false, weight: 2 },
    { format: "Story", isCarousel: false, weight: 1 },
  ],
  pinterest: [
    { format: "Standard Pin (Image)", isCarousel: false, weight: 3 },
    { format: "Idea Pin (5 slides)", isCarousel: true, slideCount: 5, weight: 3 },
    { format: "Video Pin (15-30s)", isCarousel: false, weight: 2 },
  ],
  threads: [
    { format: "Text Post with Image", isCarousel: false, weight: 3 },
    { format: "Carousel Post (3 slides)", isCarousel: true, slideCount: 3, weight: 2 },
    { format: "Text-only Post", isCarousel: false, weight: 2 },
  ],
};

function selectContentFormat(platform: string, dayIndex: number): ContentFormatOption {
  const formats = PLATFORM_CONTENT_FORMATS[platform.toLowerCase()] || PLATFORM_CONTENT_FORMATS.instagram;
  const expanded: ContentFormatOption[] = [];
  for (const f of formats) {
    for (let i = 0; i < f.weight; i++) expanded.push(f);
  }
  return cycle(expanded, dayIndex * 3 + dayIndex);
}

// ============================================
// CAROUSEL SLIDE GENERATION
// ============================================

interface CarouselSlide {
  slideNumber: number;
  textOverlay: string;
  visualDescription: string;
}

const CAROUSEL_SLIDE_PATTERNS: Record<number, Array<Array<{ overlay: string; visual: string }>>> = {
  3: [
    [
      { overlay: "{{hookShort}}", visual: "COVER SLIDE: Bold brand-color background. Hook text in large white display font (60pt+), centered. Small {{businessName}} logo in bottom-right corner. Keep it clean — text only, no images. The goal is to stop the scroll." },
      { overlay: "Here's what to do instead →", visual: "CONTENT SLIDE: Light/white background. The key insight as a numbered list (3 bullet points max). Each bullet has a bold headline + 1-line explanation. Use a checkmark or arrow icon before each point. Brand accent color for the icons." },
      { overlay: "Save this + follow {{businessName}} for more", visual: "CTA SLIDE: Brand accent color background. CTA text in large bold white font. Below: {{businessName}} handle and logo. Add a subtle 'save' icon (bookmark) and 'follow' icon (plus). This slide should make them take action." },
    ],
    [
      { overlay: "The #1 {{industry}} mistake (and how to fix it)", visual: "COVER SLIDE: Dark background (charcoal or navy). Red warning icon or ❌ emoji above the text. Hook in large bold white font. Feels urgent and attention-grabbing. {{businessName}} logo small in corner." },
      { overlay: "What {{businessName}} does differently:", visual: "SOLUTION SLIDE: Clean white background. Split into PROBLEM (left, with ❌) and SOLUTION (right, with ✅). Each side has 2-3 short bullet points. Use red for problem text, green for solution text. Clear visual contrast." },
      { overlay: "Share this with someone who needs it 👇", visual: "SHARE SLIDE: Warm brand-color background. Large text encouraging shares. Include {{businessName}} handle prominently. Add social icons (share, save). Feels like a friendly nudge, not a hard sell." },
    ],
    [
      { overlay: "Before working with {{businessName}}:", visual: "BEFORE SLIDE: Slightly desaturated/grey-toned image or solid muted background. Show the problem state with 3 pain points listed. Use ❌ icons. Text in dark grey. Feels like a 'this is you right now' moment." },
      { overlay: "After applying our {{industry}} approach:", visual: "AFTER SLIDE: Bright, vibrant, full-color background. Show the transformation with 3 results listed. Use ✅ icons. Text in bold dark font on light background. Feels aspirational and achievable." },
      { overlay: "Want the same results? Here's your next step →", visual: "CTA SLIDE: Brand primary color background. Clear next step (DM, link in bio, or follow). {{businessName}} logo and handle centered. Confident but not pushy. Include a directional arrow pointing to the bio/link." },
    ],
  ],
  4: [
    [
      { overlay: "{{hookShort}}", visual: "COVER SLIDE: Solid brand-color background. Hook text large and centered (60pt+). Subtext below in smaller font: 'A 3-step breakdown from {{businessName}}'. Clean, minimal, scroll-stopping." },
      { overlay: "Step 1: Identify the core problem", visual: "STEP SLIDE: White background. Large circled '1' in brand accent color top-left. Bold headline: the step name. Below: 2-3 lines explaining what to do and why. Icon or simple illustration supporting the point." },
      { overlay: "Step 2: Apply this specific fix", visual: "STEP SLIDE: Same layout as Step 1 but with circled '2'. Different brand accent shade for the number. New headline and explanation. Pro tip callout box at the bottom in a light tint." },
      { overlay: "Step 3: Measure and optimize", visual: "STEP SLIDE: Same layout with circled '3'. The final step with a clear action item. Below: a callout box saying 'Save this guide and revisit it next week'. {{businessName}} handle at the bottom." },
    ],
  ],
  5: [
    [
      { overlay: "{{hookShort}}", visual: "COVER SLIDE: Dark premium background (charcoal or deep brand color). Hook in large bold white display font. Subtitle: 'Swipe for the full breakdown →' in smaller font. {{businessName}} logo in bottom-right. Arrow icon pointing right to encourage swiping." },
      { overlay: "The problem: Why most {{industry}} approaches fail", visual: "PROBLEM SLIDE: White background with a red/orange accent bar on the left side. Bold headline with ❌ icon. 3 common mistakes listed as short bullet points with clear explanations. Feels like a reality check." },
      { overlay: "The data: Why this actually matters", visual: "DATA SLIDE: Light background with a large stat or number in the center (60pt+ font in brand accent color). Below: 1-2 sentences explaining the stat. Source credit in small text at bottom. Data visualization element (simple bar or percentage circle)." },
      { overlay: "The fix: {{businessName}}'s approach", visual: "SOLUTION SLIDE: White background with green accent bar on the left. Bold headline with ✅ icon. 3 action items listed with numbered steps. Each step has a bold action verb + brief explanation. Feels actionable and clear." },
      { overlay: "Your next step starts now →", visual: "CTA SLIDE: Brand primary color background. Large bold CTA text. {{businessName}} logo centered. Handle and 'Link in bio' text below. Bookmark icon and 'Save for later' prompt. Feels motivating and direct." },
    ],
    [
      { overlay: "5 {{industry}} tips from {{businessName}}", visual: "COVER SLIDE: Brand color background. Large '5' in oversized display font (120pt) at 20% opacity behind the title text. Title in bold white: '5 {{industry}} Tips You Need This Week'. {{businessName}} logo at bottom. Preview energy: 'Swipe →'." },
      { overlay: "Tip #1: Start with your audience, not your product", visual: "TIP SLIDE: White background. Large '#1' in brand accent color. Bold tip headline. Below: 2-3 line explanation of WHY this matters and HOW to do it today. Keep it actionable. Small lightbulb icon." },
      { overlay: "Tip #2: Consistency beats perfection every time", visual: "TIP SLIDE: Light grey background (slight contrast change for visual variety). Large '#2'. Same layout as Tip 1. Different icon (calendar or clock). One specific example of consistency in action." },
      { overlay: "Tip #3: Track these 3 metrics (ignore the rest)", visual: "TIP SLIDE: White background. Large '#3'. List the 3 specific metrics to track with brief explanation of each. Chart or graph icon. This is the most tactical/specific slide." },
      { overlay: "Tips 4 & 5 are in our free guide → Follow {{businessName}}", visual: "TEASER + CTA SLIDE: Brand accent color background. 'Want tips 4 & 5?' in large bold text. Below: 'Follow {{businessName}} + DM us \"TIPS\" for the full guide'. Creates curiosity gap. Follow and DM icons." },
    ],
  ],
};

function generateCarouselSlides(
  slideCount: number,
  vars: Record<string, string>
): CarouselSlide[] {
  const patterns = CAROUSEL_SLIDE_PATTERNS[slideCount] || CAROUSEL_SLIDE_PATTERNS[3];
  const pattern = pick(patterns);

  return pattern.map((slide, i) => ({
    slideNumber: i + 1,
    textOverlay: fillTemplate(slide.overlay, vars),
    visualDescription: fillTemplate(slide.visual, vars),
  }));
}

// ============================================
// AI MEDIA PROMPT GENERATION
// ============================================

const AI_VIDEO_PROMPT_TEMPLATES = [
  "FILMING: One person speaking directly to camera, framed from mid-chest up. Clean, minimal background (white wall or neutral office). Warm natural window light from the left, no harsh shadows. Casual professional outfit in neutral tones. Camera at eye level on tripod. Shallow depth of field (f/2.8).\nEDITING: Add bold white sans-serif caption text in the lower third (auto-captions style). Cut awkward pauses. Add a subtle zoom-in (2%) at key moments for emphasis. {{businessName}} logo watermark in top-right at 30% opacity.\nFORMAT: Vertical 9:16, 1080x1920px, 24fps. Duration: 15-30 seconds.",
  "FILMING: Cinematic B-roll sequence — 4-5 close-up shots related to {{industry}} (hands working, tools in use, products on display, workspace details). Each shot 3-4 seconds. Smooth slider or gimbal movement. Natural lighting with warm color grading (add orange in highlights, teal in shadows).\nEDITING: Intercut with full-screen text cards (bold white text on brand-colored background). Text appears with a quick scale-up animation. Background music: lo-fi or ambient (royalty-free). {{businessName}} end card on final frame.\nFORMAT: Vertical 9:16 for TikTok/Reels or 16:9 for YouTube. 30-60 seconds.",
  "FILMING: Quick-cut talking head — energetic delivery, presenter seated or standing. Ring light setup for clean, even lighting. Brand-colored accent in background (colored wall, neon sign, or branded backdrop). Fast-paced with jump cuts between points (remove filler words).\nEDITING: On-screen text for EACH key point as the presenter says it (large bold font, centered or lower-third). Motion graphic pop-ups for emphasis (arrows, circles, emojis). Upbeat background music at 15% volume. Hook text in first frame.\nFORMAT: Vertical 9:16, 1080x1920px. Duration: 30-60 seconds. Captions burned in.",
  "FILMING: POV/overhead tutorial — camera mounted directly above a desk or workspace. Hands visible performing each step. Clean, uncluttered surface (white or light wood). Each step clearly shown for 5-8 seconds.\nEDITING: Number each step on screen with a branded badge (\"Step 1\", \"Step 2\", etc.) in brand accent color. Add voiceover or text-only captions explaining each action. Gentle background music. Title card at start: \"How to [topic] in {{industry}}\".\nFORMAT: Vertical 9:16 for short-form, or square 1:1 for feed. Duration: 30-60 seconds.",
  "FILMING: Split-screen before/after — LEFT shows the problem (messy, inefficient, outdated approach), RIGHT shows the solution (clean, optimized, professional result). Both filmed in the same setting with identical lighting. Clear visual distinction between the two states.\nEDITING: Start with left side only for 3 seconds (label: \"BEFORE\"). Then reveal right side with a wipe transition (label: \"AFTER\"). Use bold red X on before, green checkmark on after. Text overlay listing 3 key changes made. {{businessName}} branding on end frame.\nFORMAT: Vertical 9:16, 1080x1920px. Duration: 15-30 seconds.",
];

const AI_IMAGE_PROMPT_TEMPLATES = [
  "Generate a professional flat-lay photograph: {{industry}}-relevant objects (tools, products, materials) arranged in an organized grid pattern on a clean white marble or light linen surface. Shot from directly overhead. Natural soft lighting from the left, subtle shadows. Objects should include a notebook, pen, and one branded element. Color palette: mostly neutral with 1-2 pops of brand accent color. 1080x1350px portrait orientation. Photo-realistic, editorial quality.",
  "Generate a bold social media graphic: Solid background in a rich brand color (deep navy, warm coral, or soft lavender). Large display font text centered on the canvas reading: \"{{hookShort}}\". Below in smaller sans-serif: a 1-line supporting statement. Bottom of canvas: {{businessName}} logo small and centered. Style: modern, minimal, high contrast. No clutter. 1080x1350px. Text must be fully legible at mobile size (minimum 48pt for headline).",
  "Generate a lifestyle photograph: A professional person in their late 20s-30s working at a modern desk or cafe, engaged with {{industry}}-related work. Candid, natural moment — not posed. Warm tones, soft bokeh background, golden hour lighting from a nearby window. Shot at approximately f/2.0 for shallow depth of field. The person is in focus, background is gently blurred. Composition follows rule of thirds. 1080x1350px portrait. Editorial magazine quality.",
  "Generate a clean infographic: White or light cream background. Title at top in bold dark font: \"{{hookShort}}\". Body divided into 3 sections, each with: a simple line icon (in brand accent color), a bold subtitle, and a 1-line description. Sections separated by thin horizontal lines. Footer with {{businessName}} logo and handle. Style: flat design, no gradients, no 3D effects. Fonts: geometric sans-serif. 1080x1350px. Must be legible at mobile size.",
  "Generate a branded quote graphic: Textured paper background (subtle grain, off-white). Oversized curly quotation marks in brand accent color at 20% opacity behind the text. Center-aligned quote text in a modern serif font: a key {{industry}} insight. Below: em dash and \"{{businessName}}\" in small caps. Thin accent-colored bar across the top edge. 1080x1080px square. Elegant, minimal, shareable. High contrast between text and background.",
];

const AI_CAROUSEL_SLIDE_PROMPT_TEMPLATE = "SLIDE {{slideNumber}} of {{totalSlides}}:\nVISUAL: {{visualDescription}}.\nTEXT ON THIS SLIDE: \"{{textOverlay}}\".\nDESIGN: Consistent brand style with previous slides. Clean modern sans-serif typography (48pt+ for headlines, 24pt for body). Light neutral background. Brand accent color for highlights and icons. 1080x1350px. All text must be legible at mobile zoom level.";

function generateAiMediaPrompt(
  contentFormat: ContentFormatOption,
  vars: Record<string, string>,
  carouselSlides?: CarouselSlide[]
): string {
  const isVideo = contentFormat.format.toLowerCase().includes("video") ||
    contentFormat.format.toLowerCase().includes("reel") ||
    contentFormat.format.toLowerCase().includes("short");

  if (contentFormat.isCarousel && carouselSlides && carouselSlides.length > 0) {
    const slidePrompts = carouselSlides.map((slide) =>
      fillTemplate(AI_CAROUSEL_SLIDE_PROMPT_TEMPLATE, {
        ...vars,
        slideNumber: String(slide.slideNumber),
        totalSlides: String(carouselSlides.length),
        textOverlay: slide.textOverlay,
        visualDescription: slide.visualDescription,
      })
    );
    return "Use these prompts to generate each slide:\n\n" + slidePrompts.join("\n\n");
  }

  const pool = isVideo ? AI_VIDEO_PROMPT_TEMPLATES : AI_IMAGE_PROMPT_TEMPLATES;
  return fillTemplate(pick(pool), vars);
}

// ============================================
// HASHTAG GENERATION (TOPIC-SPECIFIC)
// ============================================

const PILLAR_HASHTAGS: Record<string, string[]> = {
  "Education & Tips": ["#LearnWith", "#ProTips", "#DidYouKnow", "#HowTo", "#ExpertAdvice", "#KnowledgeDrop"],
  "Behind the Scenes": ["#BTS", "#BehindTheScenes", "#DayInTheLife", "#MeetTheTeam", "#RealTalk", "#WeekInReview"],
  "Social Proof & Results": ["#Results", "#ClientWins", "#Testimonial", "#BeforeAndAfter", "#SuccessStory", "#CaseStudy"],
  "Engagement & Community": ["#Community", "#LetsChat", "#YourThoughts", "#JoinTheConversation", "#AskUs", "#PollTime"],
  "Trending & Cultural": ["#Trending", "#Viral", "#TrendAlert", "#HotTake", "#WeeklyTrend", "#CultureWatch"],
  "Product & Service Showcase": ["#NewDrop", "#FeatureSpotlight", "#WhatWeOffer", "#MustHave", "#ProductReview", "#Spotlight"],
  "Inspiration & Motivation": ["#Motivation", "#Inspired", "#MindsetShift", "#DailyInspiration", "#KeepGoing", "#SuccessMindset"],
  "Industry News & Insights": ["#IndustryInsights", "#NewsUpdate", "#TrendReport", "#ExpertTake", "#MarketWatch", "#WeeklyInsight"],
};

const NICHE_HASHTAGS_BY_INDUSTRY: Record<string, string[]> = {
  technology: ["#BuildInPublic", "#DevLife", "#NoCode", "#ProductHunt", "#TechStartup", "#WebDev", "#DataDriven", "#CloudComputing"],
  fitness: ["#FitCheck", "#GymMotivation", "#TrainHard", "#ActiveLifestyle", "#StrengthTraining", "#MindBodySoul", "#FitLife", "#WorkoutOfTheDay"],
  food: ["#FoodFromScratch", "#HomemadeGoodness", "#SeasonalEating", "#MealPrep", "#FoodStyling", "#ChefAtHome", "#FarmFresh", "#PlantBased"],
  fashion: ["#WardrobeEssentials", "#StyleTip", "#FashionForward", "#SustainableFashion", "#CapsuleWardrobe", "#LookOfTheDay", "#FashionInspo", "#DressToImpress"],
  education: ["#StudyWith", "#LearnSomethingNew", "#SkillUp", "#GrowthMindset", "#OnlineCourse", "#KnowledgeIsPower", "#StudyMotivation", "#EdTech"],
  healthcare: ["#WellnessWednesday", "#HealthFirst", "#MindfulLiving", "#PreventiveCare", "#HolisticHealth", "#HealthyHabits", "#SelfCareSunday", "#WellnessJourney"],
  finance: ["#MoneyMoves", "#FinancialWellness", "#InvestSmart", "#SideHustle", "#DebtFree", "#PassiveIncome", "#SmartMoney", "#WealthMindset"],
  realestate: ["#HomeSweetHome", "#JustListed", "#CurbAppeal", "#OpenHouse", "#FirstTimeBuyer", "#LuxuryLiving", "#PropertyInvestment", "#HomeDecor"],
  beauty: ["#GlowingSkin", "#MakeupLook", "#SkincareRoutine", "#NaturalBeauty", "#BeautyHack", "#GetReadyWithMe", "#GRWM", "#ShelfieGoals"],
  marketing: ["#ContentIsKing", "#MarketingHack", "#BrandStrategy", "#SocialMediaMarketing", "#GrowthStrategy", "#DigitalStrategy", "#CreatorEconomy", "#PersonalBrand"],
  default: ["#SmallBizTips", "#EntrepreneurLife", "#BossMode", "#StartupLife", "#BusinessGrowth", "#WorkSmarter", "#HustleAndHeart", "#OwnYourStory"],
};

const FORMAT_HASHTAGS: Record<string, string> = {
  "reel": "#Reels",
  "carousel": "#CarouselPost",
  "short": "#Shorts",
  "video": "#VideoContent",
  "thread": "#Thread",
  "pin": "#PinterestInspired",
  "story": "#InstaStories",
};

function getHashtags(
  industry: string,
  platform: string,
  businessName: string,
  pillarName: string,
  contentFormat: string
): string[] {
  const industryKey = getIndustryKey(industry);
  const meta = getPlatformMeta(platform);
  const count = meta.hashtagCount;

  if (count === 0) return [];

  const result: string[] = [];

  // 1. Brand tag
  const brandTag = "#" + businessName.replace(/[^a-zA-Z0-9]/g, "");
  result.push(brandTag);

  // 2. Pillar-specific tags (pick 1-2)
  const pillarBaseName = Object.keys(PILLAR_HASHTAGS).find((k) =>
    pillarName.toLowerCase().includes(k.toLowerCase().split(" ")[0])
  ) || "Education & Tips";
  const pillarTags = PILLAR_HASHTAGS[pillarBaseName] || PILLAR_HASHTAGS["Education & Tips"];
  const shuffledPillar = [...pillarTags].sort(() => Math.random() - 0.5);
  result.push(...shuffledPillar.slice(0, Math.min(2, count - 1)));

  // 3. Niche industry tags (pick 2-3)
  const nicheTags = NICHE_HASHTAGS_BY_INDUSTRY[industryKey] || NICHE_HASHTAGS_BY_INDUSTRY.default;
  const shuffledNiche = [...nicheTags].sort(() => Math.random() - 0.5);
  result.push(...shuffledNiche.slice(0, Math.min(3, Math.max(1, count - result.length - 1))));

  // 4. Format-specific tag (pick 1 if applicable)
  const formatLower = contentFormat.toLowerCase();
  for (const [key, tag] of Object.entries(FORMAT_HASHTAGS)) {
    if (formatLower.includes(key) && result.length < count) {
      result.push(tag);
      break;
    }
  }

  return result.slice(0, count);
}

// ============================================
// POSTING TIMES
// ============================================

const POSTING_TIMES: Record<string, string[]> = {
  tiktok: ["7:00 AM", "10:00 AM", "12:00 PM", "3:00 PM", "7:00 PM", "10:00 PM"],
  instagram: ["8:00 AM", "11:00 AM", "1:00 PM", "5:00 PM", "7:00 PM"],
  youtube: ["9:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"],
  twitter: ["8:00 AM", "12:00 PM", "5:00 PM", "9:00 PM"],
  linkedin: ["7:30 AM", "10:00 AM", "12:00 PM", "5:30 PM"],
  reddit: ["6:00 AM", "8:00 AM", "12:00 PM", "5:00 PM"],
  facebook: ["9:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"],
  pinterest: ["8:00 PM", "9:00 PM", "11:00 PM"],
  threads: ["8:00 AM", "12:00 PM", "6:00 PM", "9:00 PM"],
};

const POSTING_TIME_RATIONALE: Record<string, Record<string, string>> = {
  tiktok: {
    "7:00 AM": "Early morning scrollers are highly active on TikTok — catching the commute audience.",
    "10:00 AM": "Mid-morning break time — TikTok usage spikes as people take work breaks.",
    "12:00 PM": "Lunch hour peak — one of TikTok's highest-traffic windows.",
    "3:00 PM": "Afternoon slump browsing — users seek entertainment between tasks.",
    "7:00 PM": "Post-dinner prime time — TikTok's evening engagement surge.",
    "10:00 PM": "Late-night scroll session — high engagement before bed.",
  },
  instagram: {
    "8:00 AM": "Morning routine check-in — Instagram's first daily engagement peak.",
    "11:00 AM": "Late morning browsing — users check feeds during work breaks.",
    "1:00 PM": "Lunch hour browsing — high Instagram activity during midday.",
    "5:00 PM": "End of workday — commuters and wind-down scrolling drive engagement.",
    "7:00 PM": "Evening prime time — peak engagement window for Instagram content.",
  },
  youtube: {
    "9:00 AM": "Morning viewers looking for informational content during breakfast/commute.",
    "12:00 PM": "Lunch break viewing — short-form content performs well at midday.",
    "3:00 PM": "Afternoon viewing — YouTube sees a steady uplift in the mid-afternoon.",
    "5:00 PM": "Post-work viewing — prime time for longer educational content.",
  },
  twitter: {
    "8:00 AM": "Morning news cycle — X/Twitter engagement peaks with the workday start.",
    "12:00 PM": "Lunch hour conversations — midday is one of X's busiest windows.",
    "5:00 PM": "End-of-day recap — users check trending topics after work.",
    "9:00 PM": "Evening engagement — opinionated content performs well late evening.",
  },
  linkedin: {
    "7:30 AM": "Pre-work professional browsing — LinkedIn's earliest engagement peak.",
    "10:00 AM": "Mid-morning work break — professionals check LinkedIn between meetings.",
    "12:00 PM": "Lunch hour networking — LinkedIn's strongest daily engagement window.",
    "5:30 PM": "End-of-day professional wind-down — last check before logging off.",
  },
  reddit: {
    "6:00 AM": "Early bird redditors — less competition, more visibility for new posts.",
    "8:00 AM": "Morning browsing surge — subreddits are most active after wake-up.",
    "12:00 PM": "Lunch break browsing — Reddit sees a strong midday engagement spike.",
    "5:00 PM": "Post-work browsing — redditors dive into threads during evening downtime.",
  },
  facebook: {
    "9:00 AM": "Morning check-in — Facebook's first daily activity peak.",
    "1:00 PM": "Lunch hour browsing — strong engagement during midday breaks.",
    "4:00 PM": "Afternoon wind-down — parents and professionals browse after tasks.",
    "7:00 PM": "Evening family time — Facebook's highest-traffic window.",
  },
  pinterest: {
    "8:00 PM": "Evening planning — users browse Pinterest for ideas during wind-down.",
    "9:00 PM": "Night browsing peak — Pinterest sees its strongest engagement window.",
    "11:00 PM": "Late-night inspiration — high save rates during pre-sleep browsing.",
  },
  threads: {
    "8:00 AM": "Morning conversation start — Threads engagement peaks with the day.",
    "12:00 PM": "Lunch hour discussions — midday is Threads' busiest window.",
    "6:00 PM": "Post-work conversations — users catch up on trending threads.",
    "9:00 PM": "Evening engagement — community discussions are most active.",
  },
};

function getPostingTime(platform: string): { time: string; rationale: string } {
  const platformKey = platform.toLowerCase();
  const times = POSTING_TIMES[platformKey] || POSTING_TIMES.instagram;
  const time = pick(times);
  const rationaleMap = POSTING_TIME_RATIONALE[platformKey] || {};
  const rationale = rationaleMap[time] || `Optimal posting time for ${platform} based on audience activity patterns.`;
  return { time, rationale };
}

// ============================================
// TONE HANDLING
// ============================================

function buildToneAndVoice(business: BusinessInput): string {
  const tones = business.contentTone;
  if (!tones || tones.length === 0) {
    return `Professional yet approachable. ${business.businessName} communicates with confidence and clarity, making complex ${business.industry} topics accessible to its audience. The voice is authoritative but never condescending.`;
  }

  const toneDescriptions: Record<string, string> = {
    professional: "polished and authoritative, establishing credibility",
    casual: "relaxed and conversational, like chatting with a friend",
    humorous: "witty and entertaining, using humor to engage and connect",
    educational: "informative and instructive, focused on teaching and value",
    inspirational: "motivating and uplifting, driving positive action",
    bold: "direct and unapologetic, not afraid to challenge the status quo",
    friendly: "warm and welcoming, creating a sense of community",
    luxurious: "refined and aspirational, conveying premium quality",
    playful: "fun and lighthearted, not taking itself too seriously",
    authoritative: "expert-driven and decisive, commanding respect",
    empathetic: "understanding and compassionate, acknowledging challenges",
    minimalist: "clean and concise, saying more with less",
  };

  const descriptions = tones
    .map((t) => toneDescriptions[t.toLowerCase()] || t)
    .join("; ");

  return `${business.businessName}'s voice is ${descriptions}. Every piece of content should feel authentically ${tones.join(" and ")} while making ${business.industry} topics resonate with the target audience.`;
}

// ============================================
// WEEKLY THEMES
// ============================================

const WEEKLY_THEMES = [
  "Authority Building",
  "Community Engagement",
  "Product Spotlight",
  "Behind the Scenes",
  "Education Week",
  "Social Proof & Results",
  "Trend Jacking",
  "Value Bombs",
];

// ============================================
// TEMPLATE FILL UTILITY
// ============================================

function fillTemplate(
  template: string,
  vars: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return result;
}

// ============================================
// MAIN GENERATOR
// ============================================

export async function generateMockStrategy(
  strategyId: string,
  business: BusinessInput
): Promise<void> {
  const duration = business.duration || 30;
  const platforms =
    business.platforms.length > 0 ? business.platforms : ["instagram"];
  const hasAssets =
    business.availableAssets && business.availableAssets.length > 0;

  try {
    // ------------------------------------------
    // STEP 1: Business Overview
    // ------------------------------------------
    await prisma.strategy.update({
      where: { id: strategyId },
      data: { generationStep: 1 },
    });
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const toneAndVoice = buildToneAndVoice(business);

    // Brand guidelines generation
    const industryColorMap: Record<string, string[]> = {
      technology: ["Deep navy (#1B2A4A)", "Electric blue (#0066FF)", "Cool grey (#94A3B8)", "Crisp white (#FFFFFF)"],
      fitness: ["Energetic orange (#FF6B35)", "Midnight black (#1A1A2E)", "Lime green (#84CC16)", "Light grey (#F1F5F9)"],
      food: ["Warm terracotta (#C2410C)", "Cream (#FFF8F0)", "Forest green (#166534)", "Soft gold (#F59E0B)"],
      fashion: ["Blush pink (#F9A8D4)", "Charcoal (#374151)", "Ivory (#FFFBEB)", "Champagne gold (#D4AF37)"],
      healthcare: ["Trust blue (#0284C7)", "Clean white (#FFFFFF)", "Soft sage (#86EFAC)", "Warm grey (#9CA3AF)"],
      finance: ["Navy (#1E3A5F)", "Gold (#D4AF37)", "White (#FFFFFF)", "Slate grey (#64748B)"],
      education: ["Royal blue (#2563EB)", "Warm yellow (#FBBF24)", "Light cream (#FEF9C3)", "Charcoal (#1F2937)"],
      beauty: ["Soft rose (#FDA4AF)", "Deep plum (#701A75)", "Ivory (#FFFBEB)", "Gold (#D4AF37)"],
      realestate: ["Navy blue (#1E3A5F)", "Gold (#B8860B)", "Warm white (#FAF9F6)", "Sage (#6B8E6B)"],
      marketing: ["Vibrant coral (#E8614D)", "Sky blue (#89CFF0)", "Lavender (#C9A7EB)", "Clean white (#FFFFFF)"],
    };
    const industryKey = getIndustryKey(business.industry);
    const brandColors = industryColorMap[industryKey] || ["Primary brand color", "Secondary accent", "Neutral tone", "Background shade"];

    const toneList = business.contentTone || ["professional"];
    const toneDosMap: Record<string, string[]> = {
      professional: ["Use clear, confident language", "Back claims with data or examples", "Maintain consistent terminology"],
      casual: ["Write like you're talking to a friend", "Use contractions and everyday language", "Keep sentences short and punchy"],
      humorous: ["Open with unexpected angles", "Use self-deprecating humor sparingly", "Make complex topics feel light"],
      inspirational: ["Share transformation stories", "Use empowering action verbs", "Paint vivid before/after pictures"],
      educational: ["Break concepts into digestible steps", "Use analogies your audience relates to", "Always provide actionable takeaways"],
      friendly: ["Address the audience directly with 'you'", "Show genuine enthusiasm", "Celebrate community wins"],
      luxurious: ["Use sensory and aspirational language", "Focus on exclusivity and craftsmanship", "Let quality speak through details"],
      playful: ["Embrace puns and wordplay", "Use unexpected comparisons", "Keep energy high and fun"],
      authoritative: ["Lead with bold statements", "Reference industry expertise", "Use decisive, action-oriented language"],
      empathetic: ["Acknowledge pain points first", "Use 'we understand' framing", "Show vulnerability when appropriate"],
      minimalist: ["Cut every unnecessary word", "Let visuals carry the story", "One idea per post"],
    };
    const toneDontsMap: Record<string, string[]> = {
      professional: ["Don't use slang or memes", "Avoid clickbait headlines", "Never bash competitors directly"],
      casual: ["Don't over-use corporate jargon", "Avoid walls of text", "Don't be preachy"],
      humorous: ["Don't force jokes that don't land", "Avoid sarcasm in written content", "Never punch down"],
      inspirational: ["Don't make empty promises", "Avoid toxic positivity", "Don't dismiss real challenges"],
      educational: ["Don't assume prior knowledge", "Avoid information overload", "Never condescend"],
      friendly: ["Don't be overly familiar too soon", "Avoid controversial hot takes", "Never ignore negative feedback"],
      luxurious: ["Don't use discount language", "Avoid casual abbreviations", "Never appear mass-market"],
      playful: ["Don't try too hard to be funny", "Avoid inside jokes that exclude", "Never sacrifice clarity for comedy"],
      authoritative: ["Don't be arrogant or dismissive", "Avoid hedging language excessively", "Never ignore opposing viewpoints"],
      empathetic: ["Don't be patronizing", "Avoid unsolicited advice", "Never minimize someone's experience"],
      minimalist: ["Don't over-explain", "Avoid cluttered visuals", "Never add filler content"],
    };

    const primaryTone = toneList[0]?.toLowerCase() || "professional";
    const toneDos = toneDosMap[primaryTone] || toneDosMap.professional;
    const toneDonts = toneDontsMap[primaryTone] || toneDontsMap.professional;

    const visualStyleMap: Record<string, string> = {
      technology: "Clean, modern layouts with generous white space. Use flat illustrations or isometric graphics. Screenshots and UI demos work well. Stick to a grid-based design system.",
      fitness: "High-energy, action-oriented visuals. Bold typography overlaying dynamic photography. Use motion (video/GIF) whenever possible. Before/after transformations are powerful.",
      food: "Warm, appetizing photography with natural lighting. Close-up textures and vibrant colors. Overhead flat-lays for ingredients, 45° angles for plated dishes. Keep editing minimal and authentic.",
      fashion: "Editorial-quality photography with consistent mood. Lifestyle shots over product-only images. Use negative space intentionally. Maintain a cohesive color story across the feed.",
      healthcare: "Clean, trustworthy imagery with calming tones. Use infographics to simplify data. Real people over stock photos. Accessibility-first design with high contrast text.",
      finance: "Professional, data-driven visuals with charts and infographics. Use navy/gold tones for trust. Clean typography with ample white space. Avoid overly casual imagery.",
      education: "Engaging, colorful infographics and diagrams. Step-by-step visual guides. Friendly illustrations mixed with real photography. Clear hierarchy for readability.",
      beauty: "Aspirational, high-quality product photography. Soft, flattering lighting. Swatches, textures, and close-up details. Consistent filter/preset for feed cohesion.",
      realestate: "Bright, well-lit property photography. Wide-angle interiors and lifestyle exteriors. Virtual tour stills and neighborhood shots. Professional staging in every frame.",
      marketing: "Bold, branded graphics with consistent color palette. Mix of data visualizations and lifestyle imagery. Use brand colors as accents, not backgrounds. Motion graphics for complex concepts.",
    };
    const visualStyle = visualStyleMap[industryKey] || "Maintain a consistent visual language across all platforms. Use high-quality imagery, consistent color palette, and clear typography. Mix photography with branded graphics.";

    const hashtagStrategy = `Use 15–25 hashtags per post. Mix: 5 broad industry hashtags (100K+ posts), 5 niche-specific hashtags (10K–100K posts), 3–5 community hashtags, and 2–3 branded hashtags like #${business.businessName.replace(/\s+/g, "")} and #${business.businessName.replace(/\s+/g, "")}Community. Rotate hashtag sets weekly to maximize reach. Save top-performing sets and retire underperformers monthly.`;

    const brandGuidelines = {
      colorRecommendations: brandColors,
      toneDos,
      toneDonts,
      visualStyle,
      hashtagStrategy,
    };

    // Build a detailed strategy direction
    const goalApproachMap: Record<string, string> = {
      "Brand Awareness": "building top-of-mind recognition through high-reach, shareable content that positions {{businessName}} as the go-to voice in {{industry}}",
      "Lead Generation": "creating value-first content that captures qualified leads through free resources, DM funnels, and link-in-bio conversions",
      "Sales & Conversions": "driving direct revenue with product showcase content, social proof, and urgency-based campaigns that move followers to buyers",
      "Community Building": "fostering a loyal, engaged community through two-way conversations, user-generated content, and shared experiences",
      "Thought Leadership": "establishing authority with data-driven insights, original perspectives, and expert commentary that earns trust and media attention",
      "Customer Retention": "keeping existing customers engaged with behind-the-scenes access, exclusive tips, and personalized content that reinforces loyalty",
      "Website Traffic": "using strategic CTAs, link-in-bio funnels, and curiosity-driven hooks to drive consistent traffic from social platforms to your website",
      "Product Launches": "building anticipation through teaser campaigns, countdown content, and launch-day blitzes that maximize first-week impact",
    };

    const primaryGoal = business.goals[0] || "Brand Awareness";
    const goalApproach = (goalApproachMap[primaryGoal] || goalApproachMap["Brand Awareness"])
      .replace(/\{\{businessName\}\}/g, business.businessName)
      .replace(/\{\{industry\}\}/g, business.industry);

    const contentMixDescription = `The content calendar follows a strategic pillar rotation to keep your feed diverse and engaging. Each week has a theme that guides the content direction while maintaining variety across formats. Expect a mix of educational content (to build authority), social proof (to build trust), engagement posts (to grow reach), and promotional content (to drive action) — weighted based on your primary goals.`;

    const growthApproachMap: Record<string, string> = {
      tiktok: "Leverage TikTok's discovery-first algorithm by posting consistently during peak hours, using trending sounds strategically, and optimizing the first 2 seconds of every video for maximum hook retention. Focus on 15-30s content to maximize completion rates.",
      instagram: "Build a cohesive, scroll-stopping feed with a mix of Reels (for reach), Carousels (for saves and shares), and Stories (for daily touchpoints). Use the Collab feature and strategic hashtag clusters to expand beyond your existing audience.",
      youtube: "Publish Shorts for rapid discovery and long-form content for deep engagement. Optimize titles and thumbnails as the #1 growth lever. Build playlists around your content pillars to increase watch time and session duration.",
      twitter: "Lead with sharp, opinionated takes and build threads that drive retweets. Reply to larger accounts in your niche daily. Use polls and questions to drive algorithmic engagement. Consistency wins over virality.",
      linkedin: "Publish 3-5x per week mixing personal stories, industry insights, and document carousels. The algorithm rewards early engagement, so post during business hours and reply to every comment within the first hour.",
      reddit: "Focus on genuine value-first participation in relevant subreddits. Build karma through helpful comments before posting your own content. AMAs and detailed guides perform best. Never hard-sell.",
      facebook: "Prioritize video content and community building through Groups. Use Facebook's targeting for boosted posts to reach new audiences. Cross-post from Instagram Reels for efficiency.",
      pinterest: "Create tall, visually striking Pins with text overlays optimized for search. Pin consistently (15-25 pins/week) with keyword-rich descriptions. Idea Pins drive followers; Standard Pins drive website traffic.",
      threads: "Post 2-3x daily mixing short takes, questions, and repurposed insights from other platforms. Engage actively in replies to build visibility. The algorithm favors conversational, community-oriented content.",
    };

    const platformGrowthStrategies = platforms.map((p) => {
      const pLower = p.toLowerCase();
      return growthApproachMap[pLower] || "Post consistently with platform-native content formats, engage with your audience daily, and optimize based on performance data.";
    });

    const strategyDirection = {
      primaryApproach: `This strategy is focused on ${goalApproach}. Over the next ${duration} days, every piece of content is designed to move the needle on this goal while building a sustainable, authentic presence.`,
      contentMix: contentMixDescription,
      growthPlaybook: platformGrowthStrategies,
      weeklyRhythm: `Week structure: Monday (educational/authority content to set the tone), mid-week (engagement and community-driven content when audiences are most active), Friday (lighter, personality-driven or trending content for weekend shares). Each week follows a named theme that connects the individual posts into a cohesive narrative.`,
      keyMetrics: `Track these weekly: follower growth rate, engagement rate per post, saves/shares ratio, profile visits, and link clicks. Monthly: review content pillar performance, retire underperforming formats, and double down on what's working.`,
    };

    const overview = {
      businessSummary: `${business.businessName} is a ${business.industry} business focused on delivering exceptional value to its target market. ${business.description.slice(0, 200)}${business.description.length > 200 ? "..." : ""} The business aims to ${business.goals.map((g) => g.toLowerCase()).join(", ")}, positioning itself as a trusted leader in the ${business.industry} space.`,
      valueProposition: `${business.businessName} stands out in the ${business.industry} industry by combining deep expertise with a genuine understanding of its audience's needs. Where competitors offer generic solutions, ${business.businessName} delivers personalized, results-driven approaches that build lasting relationships beyond transactions.`,
      toneAndVoice,
      differentiators: [
        `Deep specialization in ${business.industry} with a focus on ${business.goals[0] || "audience growth"}`,
        `Authentic audience connection through relatable, value-driven content`,
        `Multi-platform presence across ${platforms.map(formatPlatformName).join(", ")} with platform-native strategies`,
        `Data-informed approach that continuously optimizes for engagement and conversion`,
      ],
      brandGuidelines,
      strategyDirection,
    };

    await prisma.strategy.update({
      where: { id: strategyId },
      data: { overview: overview as object, generationStep: 2 },
    });

    // ------------------------------------------
    // STEP 2: Audience Persona
    // ------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const occupations = getOccupations(business.industry);
    const interests = getInterests(business.industry);

    // Parse target audience description to derive persona traits
    const audienceText = (business.targetAudience || "").toLowerCase();

    // Infer age range from target audience description
    let ageRange = pick(["25-34", "28-38", "30-42"]);
    if (audienceText.includes("young") || audienceText.includes("gen z") || audienceText.includes("teen")) {
      ageRange = "18-25";
    } else if (audienceText.includes("millennial") || audienceText.includes("20s") || audienceText.includes("young professional")) {
      ageRange = "25-34";
    } else if (audienceText.includes("middle") || audienceText.includes("40") || audienceText.includes("parent")) {
      ageRange = "35-45";
    } else if (audienceText.includes("senior") || audienceText.includes("retired") || audienceText.includes("50")) {
      ageRange = "45-60";
    } else if (audienceText.includes("professional") || audienceText.includes("executive") || audienceText.includes("manager")) {
      ageRange = "30-42";
    }

    // Derive pain points from audience description + industry
    const audienceDerivedPainPoints = [
      `Struggles to find trustworthy ${business.industry} solutions`,
      `Overwhelmed by too many options in the ${business.industry} space`,
      `Wants expert guidance but can't afford premium consultants`,
      `Needs results quickly but doesn't know where to start`,
      `Frustrated by generic advice that doesn't apply to their situation`,
    ];

    // Add audience-specific pain point if we can extract one
    if (audienceText.includes("budget") || audienceText.includes("afford") || audienceText.includes("cost")) {
      audienceDerivedPainPoints.unshift(`Looking for affordable ${business.industry} solutions that don't compromise on quality`);
    }
    if (audienceText.includes("beginner") || audienceText.includes("new to") || audienceText.includes("starting")) {
      audienceDerivedPainPoints.unshift(`New to ${business.industry} and unsure where to begin`);
    }
    if (audienceText.includes("busy") || audienceText.includes("time")) {
      audienceDerivedPainPoints.unshift(`Limited time to research and compare ${business.industry} options`);
    }

    const persona = {
      name: pick(PERSONA_FIRST_NAMES),
      age: ageRange,
      occupation: pick(occupations),
      interests: interests.slice(0, 4 + Math.floor(Math.random() * 2)),
      painPoints: audienceDerivedPainPoints.slice(0, 5),
      platforms: platforms.map(formatPlatformName),
      contentPreferences: [...CONTENT_PREFERENCES]
        .sort(() => Math.random() - 0.5)
        .slice(0, 4),
      buyingBehavior: pick(BUYING_BEHAVIORS),
      basedOn: `Derived from your target audience: "${business.targetAudience?.slice(0, 150) || business.industry + " consumers"}"`,
    };

    await prisma.strategy.update({
      where: { id: strategyId },
      data: { audiencePersona: persona as object, generationStep: 3 },
    });

    // ------------------------------------------
    // STEP 3: Platform Strategy
    // ------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const kpiTargetsByPlatform: Record<string, { followerGrowth: string; engagementRate: string; reachGrowth: string; saves: string }> = {
      tiktok: { followerGrowth: "15-25% / month", engagementRate: "8-12%", reachGrowth: "30-50% / month", saves: "3-5% of views" },
      instagram: { followerGrowth: "8-15% / month", engagementRate: "4-7%", reachGrowth: "20-35% / month", saves: "2-4% of reach" },
      youtube: { followerGrowth: "5-10% / month", engagementRate: "5-8%", reachGrowth: "15-30% / month", saves: "1-3% of views" },
      twitter: { followerGrowth: "10-18% / month", engagementRate: "2-5%", reachGrowth: "20-40% / month", saves: "1-2% of impressions" },
      linkedin: { followerGrowth: "8-12% / month", engagementRate: "3-6%", reachGrowth: "15-25% / month", saves: "2-4% of impressions" },
      reddit: { followerGrowth: "5-10% / month", engagementRate: "6-10%", reachGrowth: "10-20% / month", saves: "3-5% of views" },
      facebook: { followerGrowth: "5-10% / month", engagementRate: "2-5%", reachGrowth: "10-20% / month", saves: "1-3% of reach" },
      pinterest: { followerGrowth: "10-20% / month", engagementRate: "3-6%", reachGrowth: "25-40% / month", saves: "5-10% of impressions" },
      threads: { followerGrowth: "12-20% / month", engagementRate: "4-8%", reachGrowth: "20-35% / month", saves: "2-4% of reach" },
    };

    const platformStrategy = platforms.map((platform) => {
      const meta = getPlatformMeta(platform);
      const platformLower = platform.toLowerCase();
      const kpiTargets = kpiTargetsByPlatform[platformLower] || {
        followerGrowth: "8-15% / month",
        engagementRate: "3-6%",
        reachGrowth: "15-25% / month",
        saves: "2-4% of reach",
      };
      return {
        platform: formatPlatformName(platform),
        postingFrequency: meta.postingFrequency,
        bestTimes: meta.bestTimes,
        contentFormats: meta.contentFormats,
        keyTactics: meta.keyTactics.map((t) =>
          t
            .replace(/\{\{businessName\}\}/g, business.businessName)
            .replace(/\{\{industry\}\}/g, business.industry)
        ),
        kpiTargets,
      };
    });

    await prisma.strategy.update({
      where: { id: strategyId },
      data: {
        platformStrategy: platformStrategy as object[],
        generationStep: 4,
      },
    });

    // ------------------------------------------
    // STEP 4: Content Pillars
    // ------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const contentPillars = selectPillars(business, 4);

    await prisma.strategy.update({
      where: { id: strategyId },
      data: {
        contentPillars: contentPillars as object[],
        generationStep: 5,
      },
    });

    // ------------------------------------------
    // STEP 5: Calendar
    // ------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const calendar: Array<{
      day: number;
      platform: string;
      pillar: string;
      briefHook: string;
      contentFormat: string;
      weekTheme: string;
    }> = [];

    for (let day = 1; day <= duration; day++) {
      const platform = cycle(platforms, day - 1);
      const pillar = cycle(contentPillars, day - 1);
      const weekNum = Math.ceil(day / 7);
      const weekTheme = cycle(WEEKLY_THEMES, weekNum - 1);

      const industryHooks = getIndustryHooks(business.industry);
      const allHooks = [...industryHooks, ...HOOK_TEMPLATES];
      const hookTemplate = cycle(allHooks, day - 1);
      const briefHook = fillTemplate(hookTemplate, {
        businessName: business.businessName,
        industry: business.industry,
        dayNumber: String(day),
      });

      const formatOption = selectContentFormat(platform, day - 1);

      calendar.push({
        day,
        platform: formatPlatformName(platform),
        pillar: pillar.name,
        briefHook,
        contentFormat: formatOption.format,
        weekTheme,
      });
    }

    await prisma.strategy.update({
      where: { id: strategyId },
      data: { calendar: calendar as object[], generationStep: 6 },
    });

    // ------------------------------------------
    // STEP 6: Content Briefs
    // ------------------------------------------
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("[MOCK-GEN] Step 6: Building briefs for", calendar.length, "days");

    const briefs = [];
    for (let index = 0; index < calendar.length; index++) {
      const calDay = calendar[index];
      try {
        const platformLower =
          Object.keys(PLATFORM_META).find(
            (k) => formatPlatformName(k) === calDay.platform
          ) || "instagram";

        const formatOption = selectContentFormat(platformLower, index);

        const vars: Record<string, string> = {
          businessName: business.businessName,
          industry: business.industry,
          platform: calDay.platform,
          pillar: calDay.pillar,
          dayNumber: String(calDay.day),
          hook: calDay.briefHook,
          hookShort: calDay.briefHook.length > 60 ? calDay.briefHook.slice(0, 57) + "..." : calDay.briefHook,
        };

        const goal =
          business.goals.length > 0
            ? cycle(business.goals, index)
            : "Build brand awareness and audience engagement";

        const script = fillTemplate(cycle(SCRIPT_TEMPLATES, index), vars);

        const visualPool = hasAssets
          ? VISUAL_DIRECTION_WITH_ASSETS
          : VISUAL_DIRECTION_WITHOUT_ASSETS;
        const visualVars = { ...vars };
        if (hasAssets && business.availableAssets) {
          visualVars.assetType = cycle(business.availableAssets, index);
        }
        const visualDirection = fillTemplate(
          cycle(visualPool, index),
          visualVars
        );

        const industryCtas = getIndustryCtas(business.industry);
        const allCtas = [...industryCtas, ...CTA_TEMPLATES];
        const cta = fillTemplate(cycle(allCtas, index), vars);
        vars.ctaShort = cta.length > 40 ? cta.slice(0, 37) + "..." : cta;

        const caption = fillTemplate(cycle(CAPTION_TEMPLATES, index), {
          ...vars,
          cta,
        });

        const hashtags = getHashtags(
          business.industry,
          platformLower,
          business.businessName,
          calDay.pillar,
          formatOption.format
        );

        const { time: postingTime, rationale: postingTimeRationale } = getPostingTime(platformLower);

        const strategicReasoning = fillTemplate(
          cycle(STRATEGIC_REASONING_TEMPLATES, index),
          vars
        );

        let carouselSlides: CarouselSlide[] | null = null;
        if (formatOption.isCarousel && formatOption.slideCount) {
          carouselSlides = generateCarouselSlides(formatOption.slideCount, vars);
        }

        const aiMediaPrompt = generateAiMediaPrompt(formatOption, vars, carouselSlides || undefined);

        briefs.push({
          strategyId,
          dayNumber: calDay.day,
          platform: calDay.platform,
          pillar: calDay.pillar,
          goal,
          hook: calDay.briefHook,
          script,
          visualDirection,
          caption,
          hashtags,
          cta,
          postingTime,
          postingTimeRationale: postingTimeRationale || "",
          strategicReasoning,
          contentFormat: formatOption.format,
          aiMediaPrompt: aiMediaPrompt || "",
          carouselSlides: carouselSlides
            ? (JSON.parse(JSON.stringify(carouselSlides)) as Prisma.InputJsonValue)
            : Prisma.JsonNull,
        });
      } catch (briefErr) {
        console.error(`[MOCK-GEN] Error building brief for day ${calDay.day}:`, briefErr);
        throw briefErr;
      }
    }

    console.log("[MOCK-GEN] Built", briefs.length, "briefs, now saving...");

    // Create briefs individually for reliability through Prisma proxy
    for (let i = 0; i < briefs.length; i++) {
      try {
        await prisma.contentBrief.create({ data: briefs[i] });
        console.log(`[MOCK-GEN] Saved brief ${i + 1}/${briefs.length}`);
      } catch (saveErr) {
        console.error(`[MOCK-GEN] Error saving brief ${i + 1}:`, JSON.stringify(briefs[i], null, 2));
        console.error(`[MOCK-GEN] Save error:`, saveErr);
        throw saveErr;
      }
    }

    // ------------------------------------------
    // DONE: Mark as ready
    // ------------------------------------------
    await prisma.strategy.update({
      where: { id: strategyId },
      data: { status: "ready" },
    });
  } catch (error) {
    console.error("Mock strategy generation failed:", error);
    await prisma.strategy.update({
      where: { id: strategyId },
      data: { status: "failed" },
    });
  }
}
