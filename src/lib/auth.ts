import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

async function seedDemoData(userId: string) {
  const existing = await prisma.business.findFirst({
    where: { userId },
  });
  if (existing) return;

  // Mark onboarding complete
  await prisma.user.update({
    where: { id: userId },
    data: { onboardingComplete: true },
  });

  // Create demo business
  const business = await prisma.business.create({
    data: {
      userId,
      businessName: "Orbyt Demo",
      industry: "Technology & SaaS",
      description:
        "AI-powered social media strategy platform that helps businesses create data-driven content plans.",
      website: "https://orbyt.app",
      targetAudience:
        "Small business owners and marketing managers aged 25-45 who struggle with consistent social media content creation.",
      platforms: ["tiktok", "instagram", "youtube"],
      goals: ["Brand Awareness", "Lead Generation", "Community Building"],
    },
  });

  // Create demo strategy with sample data
  const strategy = await prisma.strategy.create({
    data: {
      userId,
      businessId: business.id,
      status: "ready",
      generationStep: 6,
      startDate: new Date(),
      overview: {
        businessSummary:
          "Orbyt is a SaaS platform that uses AI to generate complete social media strategies, helping businesses maintain consistent and effective online presence.",
        valueProposition:
          "Turn your business goals into a ready-to-execute content plan in minutes, not weeks.",
        toneAndVoice:
          "Professional yet approachable, data-informed, empowering, with a touch of creativity.",
        differentiators: [
          "AI-generated complete strategies, not just post ideas",
          "Platform-specific optimization for each post",
          "Strategic reasoning behind every content decision",
          "Content calendar with detailed per-post briefs",
        ],
      },
      audiencePersona: {
        name: "Marketing Manager Maya",
        age: "28-38",
        occupation: "Marketing Manager / Small Business Owner",
        interests: [
          "Digital marketing trends",
          "Productivity tools",
          "Business growth",
          "Social media",
        ],
        painPoints: [
          "Spending too much time planning content",
          "Inconsistent posting schedule",
          "Not sure what content works on each platform",
          "Struggling to connect content to business goals",
        ],
        platforms: ["Instagram", "TikTok", "YouTube"],
        contentPreferences: [
          "Quick actionable tips",
          "Behind-the-scenes content",
          "Case studies and results",
        ],
        buyingBehavior:
          "Research-driven, values ROI, tries free versions before committing, influenced by peer reviews.",
      },
      platformStrategy: [
        {
          platform: "TikTok",
          postingFrequency: "5x per week",
          bestTimes: ["9:00 AM", "12:00 PM", "7:00 PM"],
          contentFormats: [
            "Talking Head Tips",
            "Screen Recording Tutorials",
            "Trend Adaptations",
          ],
          keyTactics: [
            "Use trending sounds within first 24 hours",
            "Hook viewers in first 2 seconds",
            "End with strong CTA for saves and shares",
          ],
        },
        {
          platform: "Instagram",
          postingFrequency: "4x per week",
          bestTimes: ["8:00 AM", "11:00 AM", "5:00 PM"],
          contentFormats: [
            "Reels (60-90s)",
            "Carousel Posts",
            "Stories with Polls",
          ],
          keyTactics: [
            "Use carousel for educational deep-dives",
            "Leverage Reels for discovery",
            "Use Stories for engagement and polls",
          ],
        },
        {
          platform: "YouTube",
          postingFrequency: "3x per week",
          bestTimes: ["2:00 PM", "4:00 PM"],
          contentFormats: [
            "Shorts (under 60s)",
            "Tutorial Shorts",
            "Quick Tips",
          ],
          keyTactics: [
            "Repurpose TikTok content as Shorts",
            "Use end screens for channel growth",
            "Focus on searchable, evergreen topics",
          ],
        },
      ],
      contentPillars: [
        {
          name: "Education & Tips",
          description:
            "Actionable tips and how-to content about social media strategy and content creation.",
          percentage: 40,
          exampleTopics: [
            "5 hooks that stop the scroll",
            "How to batch content in 2 hours",
            "The best posting times by platform",
          ],
        },
        {
          name: "Behind the Scenes",
          description:
            "Show the process, tools, and daily life of building and running the business.",
          percentage: 25,
          exampleTopics: [
            "A day in our content creation process",
            "Tools we use to plan content",
            "How we grew from 0 to 10K followers",
          ],
        },
        {
          name: "Social Proof & Results",
          description:
            "Share success stories, metrics, and testimonials that demonstrate value.",
          percentage: 20,
          exampleTopics: [
            "Client went from 0 to 50K in 90 days",
            "Before/after: content strategy makeover",
            "Monthly metrics breakdown",
          ],
        },
        {
          name: "Trends & Commentary",
          description:
            "React to industry trends, share opinions, and adapt viral formats to the niche.",
          percentage: 15,
          exampleTopics: [
            "This new algorithm update changes everything",
            "Reacting to viral marketing fails",
            "Adapting the latest TikTok trend for business",
          ],
        },
      ],
      calendar: Array.from({ length: 30 }, (_, i) => {
        const platforms = ["tiktok", "instagram", "youtube"];
        const pillars = [
          "Education & Tips",
          "Behind the Scenes",
          "Social Proof & Results",
          "Trends & Commentary",
        ];
        return {
          day: i + 1,
          platform: platforms[i % platforms.length],
          pillar: pillars[i % pillars.length],
          briefHook: [
            "Stop scrolling — this changes everything about your content strategy",
            "I tested posting at 3 AM for a week. Here's what happened",
            "The #1 mistake killing your social media growth",
            "POV: You just discovered the content planning hack",
            "Nobody talks about this algorithm secret",
            "3 things I wish I knew before starting content creation",
            "This simple trick doubled our engagement",
            "Watch me build a month of content in 2 hours",
            "The truth about social media that experts won't tell you",
            "How we turned 1 video into 30 pieces of content",
          ][i % 10],
        };
      }),
    },
  });

  // Create 30 demo content briefs
  const briefsData = Array.from({ length: 30 }, (_, i) => {
    const platforms = ["tiktok", "instagram", "youtube"];
    const pillars = [
      "Education & Tips",
      "Behind the Scenes",
      "Social Proof & Results",
      "Trends & Commentary",
    ];
    const goals = [
      "Drive awareness",
      "Generate engagement",
      "Build authority",
      "Increase saves/shares",
    ];
    const times = ["9:00 AM", "12:00 PM", "5:00 PM", "7:00 PM"];

    return {
      strategyId: strategy.id,
      dayNumber: i + 1,
      platform: platforms[i % platforms.length],
      pillar: pillars[i % pillars.length],
      goal: goals[i % goals.length],
      hook: [
        "Stop scrolling — this changes everything about your content strategy",
        "I tested posting at 3 AM for a week. Here's what happened",
        "The #1 mistake killing your social media growth",
        "POV: You just discovered the content planning hack nobody talks about",
        "This algorithm secret got us 100K views in 48 hours",
      ][i % 5],
      script: `Opening (0-3s): Start with the hook to grab attention immediately.\n\nBody (3-30s): Deliver the main value — share ${pillars[i % pillars.length].toLowerCase()} content that resonates with your target audience. Use quick cuts to maintain energy.\n\nClosing (30-45s): Reinforce the key takeaway and include a clear call-to-action.\n\nKey talking points:\n- Point 1: Address the main pain point\n- Point 2: Share the solution or insight\n- Point 3: Provide actionable next step`,
      visualDirection: `Film in well-lit setting with clean background. Use ${
        i % 2 === 0 ? "portrait orientation for TikTok/Reels" : "dynamic camera angles"
      }. Add text overlays for key stats/points. Use brand colors (#E8614D red accent) in graphics. Include B-roll of ${
        i % 3 === 0
          ? "screen recordings"
          : i % 3 === 1
          ? "product demonstrations"
          : "behind-the-scenes footage"
      }.`,
      caption: `Day ${i + 1} content: Sharing insights about ${pillars[i % pillars.length].toLowerCase()} that will transform how you approach social media.\n\nSave this for later! You'll want to come back to these tips.\n\nWhat's your biggest challenge with content creation? Drop it in the comments.`,
      hashtags: [
        "#ContentStrategy",
        "#SocialMediaTips",
        "#DigitalMarketing",
        "#ContentCreator",
        `#${platforms[i % platforms.length]}Tips`,
      ],
      cta: [
        "Follow for daily content tips",
        "Save this for your next content planning session",
        "Share with someone who needs this",
        "Comment your biggest takeaway",
        "Link in bio for your free strategy",
      ][i % 5],
      postingTime: times[i % times.length],
      strategicReasoning: `Day ${i + 1} focuses on ${pillars[i % pillars.length]} content on ${platforms[i % platforms.length]} to ${goals[i % goals.length].toLowerCase()}. This post type performs well mid-week when your audience is most active. The ${pillars[i % pillars.length].toLowerCase()} angle builds trust and positions you as an authority in your space.`,
    };
  });

  await prisma.contentBrief.createMany({ data: briefsData });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: any[] = [
  // Email + Password sign in
  CredentialsProvider({
    id: "credentials",
    name: "Email & Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      });

      if (!user || !user.password) return null;

      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (!isValid) return null;

      return { id: user.id, email: user.email, name: user.name, image: user.image };
    },
  }),

  // Demo account — only available when explicitly enabled via env var
  ...(process.env.ENABLE_DEMO_ACCOUNT === "true" ? [CredentialsProvider({
      id: "demo",
      name: "Demo Account",
      credentials: {},
      async authorize() {
        let user = await prisma.user.findUnique({
          where: { email: "demo@orbyt.app" },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: "demo@orbyt.app",
              name: "Demo User",
              emailVerified: new Date(),
            },
          });
        }

        await seedDemoData(user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    })] : []),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;

        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { plan: true, onboardingComplete: true },
        });

        session.user.plan = dbUser?.plan ?? "free";
        session.user.onboardingComplete = dbUser?.onboardingComplete ?? false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth",
    newUser: "/onboarding",
  },
};
