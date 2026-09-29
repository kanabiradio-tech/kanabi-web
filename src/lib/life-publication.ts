type Publication = { status: string; publishedAt?: string; source: { reviewed: boolean } };

export function selectPublished<T extends Publication>(posts: readonly T[], now = Date.now()): T[] {
  return posts.filter(post => {
    const publishedAt = Date.parse(post.publishedAt ?? "");
    return post.status === "published" && post.source.reviewed && Number.isFinite(publishedAt) && publishedAt <= now;
  }).sort((a, b) => Date.parse(b.publishedAt!) - Date.parse(a.publishedAt!));
}
