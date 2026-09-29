export const dynamic = "force-dynamic";
import Link from "next/link";
import type { Metadata } from "next";
import SiteHeader from "@/src/components/SiteHeader";
import SiteFooter from "@/src/components/SiteFooter";
import LifeCard from "@/src/components/LifeCard";
import { CATEGORIES, pageMetadata, publishedPosts } from "@/src/lib/life";
type Props = { searchParams: Promise<{ category?: string }> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
 const params = await searchParams;
 const category = CATEGORIES.find(item => item.slug === params.category);
 return pageMetadata(category ? `${category.label}・以晨的日常` : "以晨的日常", category?.note ?? "吃東西、去旅行、散散步，還有那些想記下來的小事。", category ? `/life?category=${category.slug}` : "/life");
}
export default async function LifePage({ searchParams }: Props) {
 const params = await searchParams;
 const selected = CATEGORIES.find(item => item.slug === params.category);
 const posts = publishedPosts().filter(post => !selected || post.category === selected.slug);
 return <div className="journal"><SiteHeader active="life" /><main id="main-content" className="content-width archive-main"><div className="archive-heading"><p className="eyebrow">LIFE, ONE LITTLE THING AT A TIME</p><h1>{selected?.label ?? "以晨的日常"}<span className="orange-period">。</span></h1><p>{selected?.note ?? "吃東西、去旅行、散散步。還有一些，光是想起來就會笑的小事。"}</p></div><nav className="category-tabs" aria-label="日常分類"><Link href="/life" aria-current={!selected ? "page" : undefined}>全部</Link>{CATEGORIES.map(category => <Link key={category.slug} href={`/life?category=${category.slug}`} aria-current={selected?.slug === category.slug ? "page" : undefined}>{category.label}</Link>)}</nav>{posts.length ? <div className="archive-list">{posts.map(post => <LifeCard key={post.slug} post={post} />)}</div> : <section className="empty-note"><span aria-hidden="true">✳</span><h2>這一頁，先留一點空白。</h2><p>這裡還沒有{selected?.label}的紀錄。<br />等照片和故事都整理好了，再慢慢放上來。</p><Link className="text-link" href="/life/hello-yichen">先來認識我 ↗</Link></section>}</main><SiteFooter /></div>;
}
