export const dynamic = "force-dynamic";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/src/components/SiteHeader";
import SiteFooter from "@/src/components/SiteFooter";
import LifeCard from "@/src/components/LifeCard";
import JsonLd from "@/src/components/JsonLd";
import { CATEGORIES, PORTRAIT, SOCIAL_LINKS, SITE_URL, pageMetadata, publishedPosts } from "@/src/lib/life";
export const metadata = pageMetadata("沈以晨的日常・生活與故事", "跟著沈以晨吃東西、去旅行、散散步。在 Kanabi，把平凡的小事慢慢寫成故事。", "/");
export default function HomePage() {
 const latest = publishedPosts().slice(0, 3);
 return <div className="journal"><SiteHeader active="home" /><main id="main-content">
  <JsonLd data={{ "@context": "https://schema.org", "@type": "WebSite", name: "Kanabi", url: SITE_URL, description: "沈以晨的生活紀錄與 Kanabi 原創故事", inLanguage: "zh-Hant" }} />
  <section className="home-hero content-width"><div className="hero-copy"><p className="eyebrow"><span className="small-sun" aria-hidden="true">✳</span> YI-CHEN’S LITTLE WORLD</p><h1>日子不用很厲害，<br />有開心就好<span className="orange-period">。</span></h1><p className="hero-intro">嗨，我是沈以晨。<br />喜歡吃東西、亂走，<br />也喜歡把小事記很久。</p><div className="hero-actions"><Link className="solid-link" href="/life">來看看我的日常 <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/about">關於我</Link></div><div className="hero-footnote"><span className="status-dot" /> 台北出發，走到哪寫到哪。<span className="character-label">Kanabi 原創虛擬角色</span></div></div><figure className="hero-photo"><div className="portrait-frame"><Image src={PORTRAIT} alt="沈以晨穿著白色上衣，戴著玻璃碎片項鍊，打從心底開心地笑著" width={1086} height={1448} sizes="(max-width: 720px) 90vw, 46vw" preload /></div><figcaption><span>沈以晨 <small>SHEN YI-CHEN</small></span><span className="photo-note">小事，也值得開心。</span></figcaption><span className="photo-stamp" aria-hidden="true">HELLO,<br />LIFE!</span></figure></section>
  <section className="topic-strip" aria-label="生活分類"><div className="content-width topic-grid">{CATEGORIES.map(category => <Link key={category.slug} href={`/life?category=${category.slug}`}><span className="topic-number">{category.mark}</span><div><h2>{category.label} <span aria-hidden="true">↗</span></h2><p>{category.note}</p></div></Link>)}</div></section>
  <section className="content-width section-space"><div className="section-heading"><div><p className="eyebrow">NOTES FROM MY DAYS</p><h2>最近，想跟你說。</h2></div><Link className="text-link" href="/life">所有日常 <span aria-hidden="true">↗</span></Link></div><div className="latest-layout"><div>{latest.map(post => <LifeCard key={post.slug} post={post} />)}</div><aside className="little-note"><span className="eyebrow">A NOTE TO YOU</span><p>不用急著去哪裡。<br />先坐一下，<br />我們慢慢認識。</p><span className="note-signature">以晨</span><div className="note-socials">{SOCIAL_LINKS.map(link => <a href={link.href} key={link.label} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div></aside></div></section>
  <section className="story-section"><div className="content-width story-grid"><div className="story-cover"><Image src="/covers/cineris.jpg" alt="燼光 CINERIS 小說封面" width={400} height={600} sizes="(max-width: 720px) 160px, 240px" /></div><div><p className="eyebrow">SOMEWHERE INSIDE THE STORY</p><h2>如果你也喜歡故事，<br />我也在那裡。</h2><p>在這裡，記下吃東西、散步，還有生活的小事。<br />翻開《燼光 CINERIS》，是另一種認識我的方式。</p><div className="hero-actions"><Link className="light-link" href={`/series/${encodeURIComponent("燼光 CINERIS")}`}>翻開《燼光》 <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/series">逛逛故事書架</Link></div></div><span className="story-index" aria-hidden="true">K.</span></div></section>
  <section className="content-width reading-invite"><div><p className="eyebrow">A MOMENT TO READ</p><h2>想多讀一點，再留一下。</h2><p>晨間專欄與連載，也一直在這裡。</p></div><Link className="outline-link" href="/reading">去晨間閱讀 <span aria-hidden="true">↗</span></Link></section>
 </main><SiteFooter /></div>;
}
