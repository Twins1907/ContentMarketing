import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/account/",
          "/onboarding/",
          "/generating/",
          "/new-strategy/",
        ],
      },
    ],
    sitemap: "https://getorbyt.io/sitemap.xml",
  };
}
