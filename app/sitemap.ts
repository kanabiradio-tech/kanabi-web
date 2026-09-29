import type { MetadataRoute } from "next";
import { SITE_URL, publishedPosts } from "@/src/lib/life";
import { SERIES_META } from "@/src/lib/series-meta";
export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap {
 return ["", "/life", "/about", "/reading", "/series", ...Object.keys(SERIES_META).map(name => `/series/${encodeURIComponent(name)}`)].map(path => ({ url: `${SITE_URL}${path}` })).concat(publishedPosts().map(post => ({ url: `${SITE_URL}/life/${post.slug}`, lastModified: post.updatedAt ?? post.publishedAt })));
}
