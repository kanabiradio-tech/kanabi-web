import Link from "next/link";
import SiteHeader from "@/src/components/SiteHeader";
import SiteFooter from "@/src/components/SiteFooter";
export default function NotFound() { return <div className="journal"><SiteHeader active="life" /><main id="main-content" className="empty-note content-width"><p className="eyebrow">404</p><h1>這一頁，還沒走到。</h1><p>這篇日常不存在，或還沒有公開。</p><Link className="solid-link" href="/life">回到以晨的日常 ↗</Link></main><SiteFooter /></div>; }
