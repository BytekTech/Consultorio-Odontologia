import type { MetadataRoute } from "next"
import { siteUrl } from "./lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/Terminos`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]
}
