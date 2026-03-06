export interface IndustryPage {
  slug: string;
  industry: string;
  headline: string;
  subheadline: string;
  metaTitle: string;
  metaDescription: string;
  painPoints: { title: string; description: string }[];
  sampleTopics: string[];
  stat: { value: string; label: string };
  color: string;
}

export const INDUSTRY_PAGES: IndustryPage[] = [
  {
    slug: "fitness-coaches",
    industry: "Fitness Coaches",
    headline: "CONTENT STRATEGIES BUILT FOR FITNESS COACHES.",
    subheadline:
      "Stop spending hours scripting workouts and filming with no plan. Orbyt generates a complete content calendar with hooks, scripts, and posting schedules tailored to the fitness industry.",
    metaTitle: "AI Content Strategy for Fitness Coaches",
    metaDescription:
      "Generate a complete social media content strategy for your fitness coaching business. Get 30 days of TikTok, Instagram & YouTube content planned in 2 minutes.",
    painPoints: [
      {
        title: "Posting Without a Plan",
        description:
          "You film workouts but have no strategy behind what you post or when. Your feed looks random and your growth has stalled.",
      },
      {
        title: "Content Ideas Dry Up Fast",
        description:
          "You run out of post ideas by week 2 and end up recycling the same workout clips with slightly different captions.",
      },
      {
        title: "No Time for Marketing",
        description:
          "Between training clients, programming workouts, and running your business, social media always falls to the bottom of the list.",
      },
    ],
    sampleTopics: [
      "Stop doing cardio wrong — here's why you're not losing fat",
      "3 meals I prep every Sunday (under $30)",
      "Client went from couch to 5K in 8 weeks — here's the plan",
      "The morning routine that changed my clients' results",
      "Why your protein intake is probably too low (and what to do)",
    ],
    stat: { value: "73%", label: "of fitness consumers discover coaches through social media" },
    color: "#A6FAFF",
  },
  {
    slug: "real-estate",
    industry: "Real Estate Agents",
    headline: "CONTENT STRATEGIES BUILT FOR REAL ESTATE.",
    subheadline:
      "Your listings deserve more than a Zillow link. Orbyt builds content plans that turn your local expertise into a personal brand that attracts buyers and sellers.",
    metaTitle: "AI Content Strategy for Real Estate Agents",
    metaDescription:
      "Generate a social media content strategy for real estate. Get 30 days of property tours, market updates, and community content — planned in 2 minutes.",
    painPoints: [
      {
        title: "Listings Don't Sell Themselves Online",
        description:
          "Just posting listing photos isn't enough. You need a content strategy that builds trust and positions you as the local expert.",
      },
      {
        title: "Inconsistent Posting",
        description:
          "You post a home tour when you have a new listing, then go silent for weeks. Your audience forgets you exist.",
      },
      {
        title: "Competing With Bigger Teams",
        description:
          "Large brokerages have marketing departments. You need a way to match their content output without the overhead.",
      },
    ],
    sampleTopics: [
      "5 things every first-time buyer wishes they knew",
      "Is now actually a good time to buy? Local market breakdown",
      "Inside tour: This $350K home has a hidden gem most people miss",
      "Staging secrets that helped sell this house in 3 days",
      "What your home inspector won't tell you (but I will)",
    ],
    stat: { value: "97%", label: "of home buyers start their search online" },
    color: "#FFA6F6",
  },
  {
    slug: "ecommerce",
    industry: "E-Commerce Brands",
    headline: "CONTENT STRATEGIES BUILT FOR E-COMMERCE.",
    subheadline:
      "Paid ads get expensive. Organic content builds a brand that sells on its own. Orbyt generates platform-specific strategies that turn followers into customers.",
    metaTitle: "AI Content Strategy for E-Commerce Brands",
    metaDescription:
      "Generate a social media content strategy for your e-commerce brand. Get 30 days of product content, UGC ideas, and conversion-focused posts in 2 minutes.",
    painPoints: [
      {
        title: "Relying Only on Paid Ads",
        description:
          "Your customer acquisition cost keeps climbing and you have zero organic presence to fall back on.",
      },
      {
        title: "Product Posts Feel Repetitive",
        description:
          "There are only so many angles you can photograph your product from. You need content variety that still drives sales.",
      },
      {
        title: "No Brand Storytelling",
        description:
          "Customers buy from brands they connect with. Without a content strategy, your brand is just another product listing.",
      },
    ],
    sampleTopics: [
      "The story behind how we designed our best-selling product",
      "Watch us pack your order — behind the scenes at our warehouse",
      "5 ways customers are using our product we never expected",
      "Our founder's honest take on competing with Amazon",
      "How we went from 0 to 10,000 orders with organic content",
    ],
    stat: { value: "82%", label: "of consumers want brands to share their story on social" },
    color: "#FFF066",
  },
  {
    slug: "saas",
    industry: "SaaS Startups",
    headline: "CONTENT STRATEGIES BUILT FOR SAAS.",
    subheadline:
      "Your product is amazing but nobody knows it exists. Orbyt generates thought leadership, product demos, and educational content that turns awareness into signups.",
    metaTitle: "AI Content Strategy for SaaS Startups",
    metaDescription:
      "Generate a social media content strategy for your SaaS company. Get 30 days of product marketing, thought leadership, and growth content in 2 minutes.",
    painPoints: [
      {
        title: "Great Product, No Visibility",
        description:
          "You've built something people need but you're spending all your time on product and none on distribution.",
      },
      {
        title: "Technical Product, Non-Technical Audience",
        description:
          "Translating complex features into compelling social content is harder than building the product itself.",
      },
      {
        title: "Founder-Led Marketing Is Exhausting",
        description:
          "As a founder, you know you should be on LinkedIn and Twitter. But finding time to write posts every day is impossible.",
      },
    ],
    sampleTopics: [
      "We hit $10K MRR. Here's every mistake we made getting there.",
      "Why we killed our most requested feature (and grew faster)",
      "The cold email template that got us our first 100 users",
      "Building in public: our real revenue numbers this month",
      "3 onboarding flows we tested and which one tripled activation",
    ],
    stat: { value: "67%", label: "of SaaS companies say content marketing is their top growth channel" },
    color: "#B8FF9F",
  },
  {
    slug: "restaurants",
    industry: "Restaurants & Food Businesses",
    headline: "CONTENT STRATEGIES BUILT FOR RESTAURANTS.",
    subheadline:
      "Your food looks incredible. Your social media should too. Orbyt generates posting plans that fill seats and build a loyal local following.",
    metaTitle: "AI Content Strategy for Restaurants",
    metaDescription:
      "Generate a social media content strategy for your restaurant. Get 30 days of food content, behind-the-scenes posts, and local marketing — planned in 2 minutes.",
    painPoints: [
      {
        title: "Beautiful Food, Empty Feed",
        description:
          "Your dishes are photogenic but your Instagram hasn't been updated in weeks. Customers can't crave what they can't see.",
      },
      {
        title: "No One on Staff Does Social",
        description:
          "Your team is busy running the restaurant. Social media is everyone's job and nobody's priority.",
      },
      {
        title: "Local Competition Is Fierce",
        description:
          "Every restaurant in town is on social media. You need content that makes people choose your spot over the rest.",
      },
    ],
    sampleTopics: [
      "How our chef makes the perfect pasta from scratch (process video)",
      "The secret menu item our regulars won't stop ordering",
      "We asked 100 customers: what's the best dish? The answer surprised us.",
      "Behind the kitchen: what 6 AM prep looks like at our restaurant",
      "This food trend is taking over — here's our version",
    ],
    stat: { value: "45%", label: "of diners try a restaurant for the first time based on social media" },
    color: "#FFC29F",
  },
  {
    slug: "coaches-consultants",
    industry: "Coaches & Consultants",
    headline: "CONTENT STRATEGIES BUILT FOR COACHES.",
    subheadline:
      "Your expertise is your product. Orbyt helps you package it into content that attracts high-value clients instead of chasing them.",
    metaTitle: "AI Content Strategy for Coaches & Consultants",
    metaDescription:
      "Generate a social media content strategy for your coaching or consulting business. Get 30 days of authority-building content planned in 2 minutes.",
    painPoints: [
      {
        title: "Giving Away Too Much (or Too Little)",
        description:
          "You don't know how much to share for free. Too much and nobody pays. Too little and nobody trusts you.",
      },
      {
        title: "Feast or Famine Client Flow",
        description:
          "You get busy with clients and stop posting. When the project ends, your pipeline is dry. The cycle repeats.",
      },
      {
        title: "Authority Without Visibility",
        description:
          "You're great at what you do but nobody outside your current network knows it. You need content that proves your expertise at scale.",
      },
    ],
    sampleTopics: [
      "The biggest mistake I see new entrepreneurs make (and the fix)",
      "How I helped a client 3x their revenue in 90 days — the framework",
      "Stop charging hourly. Here's how to price your expertise instead.",
      "The discovery call script that converts 60% of leads",
      "5 books that changed how I coach (and what I learned from each)",
    ],
    stat: { value: "89%", label: "of coaching clients research their coach online before booking" },
    color: "#A8A6FF",
  },
  {
    slug: "beauty-fashion",
    industry: "Beauty & Fashion Brands",
    headline: "CONTENT STRATEGIES BUILT FOR BEAUTY & FASHION.",
    subheadline:
      "Trends move fast. Your content should move faster. Orbyt generates platform-optimized content plans for brands that need to stay ahead of the algorithm.",
    metaTitle: "AI Content Strategy for Beauty & Fashion Brands",
    metaDescription:
      "Generate a social media content strategy for beauty and fashion. Get 30 days of trend-forward content, product launches, and style inspiration in 2 minutes.",
    painPoints: [
      {
        title: "Trends Change Weekly",
        description:
          "By the time you plan content around a trend, it's already over. You need a strategy that's fast enough to stay relevant.",
      },
      {
        title: "Oversaturated Market",
        description:
          "Every brand is on Instagram and TikTok. Without a distinct content identity, you blend into the noise.",
      },
      {
        title: "Content Production Is Expensive",
        description:
          "Professional shoots, models, and editors add up fast. You need a plan that maximizes every piece of content you create.",
      },
    ],
    sampleTopics: [
      "Get ready with me using only our new spring collection",
      "The 3 skincare steps dermatologists actually agree on",
      "We asked our followers to style this piece 3 ways — the results",
      "Behind the design: how this collection went from sketch to store",
      "This beauty hack went viral and we tested if it actually works",
    ],
    stat: { value: "65%", label: "of beauty purchases are influenced by social media content" },
    color: "#FFA6F6",
  },
  {
    slug: "personal-brands",
    industry: "Personal Brands & Creators",
    headline: "CONTENT STRATEGIES BUILT FOR CREATORS.",
    subheadline:
      "You are the brand. Orbyt helps you build a content system that grows your audience, establishes authority, and opens doors — without burning out.",
    metaTitle: "AI Content Strategy for Personal Brands & Creators",
    metaDescription:
      "Generate a content strategy for your personal brand. Get 30 days of planned content for TikTok, Instagram, YouTube, and LinkedIn — in 2 minutes.",
    painPoints: [
      {
        title: "Creator Burnout Is Real",
        description:
          "You're the strategist, scriptwriter, editor, and talent. Without a system, every post feels like starting from zero.",
      },
      {
        title: "Growing Across Multiple Platforms",
        description:
          "You know you should be on TikTok AND LinkedIn AND YouTube. But creating unique content for each one takes hours.",
      },
      {
        title: "Monetization Requires Consistency",
        description:
          "Brand deals, speaking gigs, and product launches all require a consistent, growing audience. Sporadic posting doesn't cut it.",
      },
    ],
    sampleTopics: [
      "The morning routine that fuels my content creation",
      "I gained 10K followers in 30 days — here's exactly what I posted",
      "How I turned my expertise into a 6-figure personal brand",
      "The tools I use every day as a full-time creator (honest review)",
      "Why I stopped chasing viral content and focused on this instead",
    ],
    stat: { value: "50M+", label: "people worldwide identify as content creators" },
    color: "#B8FF9F",
  },
];

export function getIndustryBySlug(slug: string): IndustryPage | undefined {
  return INDUSTRY_PAGES.find((p) => p.slug === slug);
}

export function getAllIndustrySlugs(): string[] {
  return INDUSTRY_PAGES.map((p) => p.slug);
}
