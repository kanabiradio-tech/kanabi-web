import Link from "next/link";
export default function SiteHeader({ active }: { active?: "home" | "life" | "about" | "reading" | "stories" }) {
  const links = [{ href: "/", label: "首頁", key: "home" }, { href: "/life", label: "以晨的日常", key: "life" }, { href: "/series", label: "故事書架", key: "stories" }, { href: "/reading", label: "晨間閱讀", key: "reading" }, { href: "/about", label: "關於以晨", key: "about" }];
  return <header className="site-header"><a className="skip-link" href="#main-content">跳至主要內容</a><div className="site-nav"><Link href="/" className="site-brand" aria-label="Kanabi 首頁">kanabi<span>生活在故事之外</span></Link><nav aria-label="主要導覽">{links.map(link => <Link key={link.key} href={link.href} aria-current={active === link.key ? "page" : undefined}>{link.label}</Link>)}</nav><Link className="nav-note" href="/life/hello-yichen">嗨，先認識一下 <span aria-hidden="true">↗</span></Link></div></header>;
}
