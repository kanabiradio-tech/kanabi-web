import Link from "next/link";
import { SOCIAL_LINKS } from "@/src/lib/life";
export default function SiteFooter() {
  return <footer className="site-footer"><div className="footer-top"><div><Link className="site-brand" href="/">kanabi<span>把生活，慢慢寫成故事。</span></Link></div><nav aria-label="社群連結">{SOCIAL_LINKS.map(link => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <span aria-hidden="true">↗</span></a>)}</nav></div><div className="footer-bottom"><p>沈以晨是 Kanabi 原創虛擬角色。實訪內容來自創作者的照片與心得；人物合成於文中標示。</p><span>© {new Date().getFullYear()} Kanabi</span></div></footer>;
}
