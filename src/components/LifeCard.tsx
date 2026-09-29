import Image from "next/image";
import Link from "next/link";
import type { LifePost } from "@/src/types/life";
import { categoryLabel, dateLabel } from "@/src/lib/life";
export default function LifeCard({ post }: { post: LifePost }) {
  return <article className="life-card"><Link href={`/life/${post.slug}`} className="card-image" tabIndex={-1} aria-hidden="true"><Image src={post.cover.src} alt="" width={post.cover.width} height={post.cover.height} sizes="(max-width: 720px) 90vw, 45vw" /></Link><div className="card-copy"><div className="eyebrow">{categoryLabel(post.category)} <span>／</span> <time dateTime={post.publishedAt}>{dateLabel(post.publishedAt!)}</time></div><h3><Link href={`/life/${post.slug}`}>{post.title}</Link></h3><p>{post.excerpt}</p><Link className="text-link" href={`/life/${post.slug}`}>讀這篇日常 <span aria-hidden="true">↗</span></Link></div></article>;
}
