import { selectPublished } from "./life-publication";
import type { Metadata } from "next";
import { lifePosts } from "@/src/content/life-posts";
import type { LifePost } from "@/src/types/life";

export const SITE_URL = "https://www.kanabi.live";
export const PORTRAIT = "/images/yichen/portrait.png";
export const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/chenyichen9809/" },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61594541439500" },
  { label: "Threads", href: "https://www.threads.com/@chenyichen9809" },
];
export const CATEGORIES = [
  { slug: "food", label: "吃東西", english: "AT THE TABLE", note: "先吃一口，再決定要說什麼。", mark: "01" },
  { slug: "travel", label: "去旅行", english: "A LITTLE FURTHER", note: "不用排太滿，有出門就很好。", mark: "02" },
  { slug: "walk", label: "散散步", english: "TAKE THE LONG WAY", note: "走錯一條路，也可能有好事。", mark: "03" },
  { slug: "diary", label: "日常", english: "LITTLE THINGS", note: "沒什麼大事，但我想記下來。", mark: "04" },
] as const;
export function publishedPosts(posts: readonly LifePost[] = lifePosts, now = Date.now()) {
  return selectPublished(posts, now);
}
export function getLifePost(slug: string) { return publishedPosts().find(post => post.slug === slug); }
export function categoryLabel(slug: string) { return CATEGORIES.find(category => category.slug === slug)?.label ?? "日常"; }
export function dateLabel(date: string) { return new Intl.DateTimeFormat("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Asia/Taipei" }).format(new Date(date)); }
export function pageMetadata(title: string, description: string, path: string, image = PORTRAIT): Metadata {
  return { title: `${title}｜Kanabi`, description, alternates: { canonical: path },
    openGraph: { title: `${title}｜Kanabi`, description, url: path, siteName: "Kanabi", locale: "zh_TW", type: "website", images: [{ url: image, alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [image] } };
}
