import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/src/components/SiteHeader";
import SiteFooter from "@/src/components/SiteFooter";
import JsonLd from "@/src/components/JsonLd";
import { categoryLabel, dateLabel, getLifePost, pageMetadata, SITE_URL } from "@/src/lib/life";
type Props = { params: Promise<{ slug: string }> };
// Evaluate status and publication time at request time, including direct URLs.
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const post = getLifePost((await params).slug);
 if (!post) return { title: "找不到這篇日常｜Kanabi", robots: { index: false, follow: false } };
 const metadata = pageMetadata(post.title, post.excerpt, `/life/${post.slug}`, post.cover.src);
 return { ...metadata, openGraph: { ...metadata.openGraph, type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt ?? post.publishedAt, authors: [`${SITE_URL}/about`] } };
}
export default async function LifeArticle({ params }: Props) {
 const post = getLifePost((await params).slug); if (!post) notFound();
 return <div className="journal"><SiteHeader active="life" /><main id="main-content" className="article-main"><JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, image: `${SITE_URL}${post.cover.src}`, datePublished: post.publishedAt, dateModified: post.updatedAt ?? post.publishedAt, mainEntityOfPage: `${SITE_URL}/life/${post.slug}`, inLanguage: "zh-Hant", author: { "@type": "Person", name: "沈以晨", url: `${SITE_URL}/about` }, publisher: { "@type": "Organization", name: "Kanabi", url: SITE_URL } }} /><nav className="breadcrumbs" aria-label="麵包屑"><Link href="/">首頁</Link><span>/</span><Link href="/life">以晨的日常</Link><span>/</span><Link href={`/life?category=${post.category}`}>{categoryLabel(post.category)}</Link></nav><article><header className="article-heading"><p className="eyebrow">{categoryLabel(post.category)} <span>／</span> <time dateTime={post.publishedAt}>{dateLabel(post.publishedAt!)}</time></p><h1>{post.title}</h1><p>{post.excerpt}</p><Link className="article-author" href="/about">沈以晨 <span>Kanabi 原創虛擬角色</span></Link></header><figure className="article-cover"><Image src={post.cover.src} alt={post.cover.alt} width={post.cover.width} height={post.cover.height} sizes="(max-width: 720px) 100vw, 800px" preload /><figcaption>{post.cover.caption}</figcaption></figure><div className="article-body">{post.place && <p className="place-note">{post.place.area}・{post.place.name}｜造訪：{post.place.visitedAt}</p>}{post.blocks.map((block, i) => block.type === "photo" ? <figure key={i}><Image src={block.photo.src} alt={block.photo.alt} width={block.photo.width} height={block.photo.height} sizes="(max-width: 720px) 90vw, 680px" /><figcaption>{block.photo.caption}</figcaption></figure> : block.type === "link" ? <p key={i}><a href={block.href} target="_blank" rel="noopener noreferrer">{block.text} ↗</a></p> : block.type === "heading" ? <h2 key={i}>{block.text}</h2> : block.type === "quote" ? <blockquote key={i}>{block.text}</blockquote> : <p key={i}>{block.text}</p>)}{post.disclosure && <aside className="article-disclosure"><strong>關於這篇內容</strong><p>{post.disclosure}</p></aside>}<div className="article-end"><Link className="text-link" href="/life">← 回到所有日常</Link><Link className="text-link" href="/about">多認識以晨一點 ↗</Link></div></div></article></main><SiteFooter /></div>;
}
