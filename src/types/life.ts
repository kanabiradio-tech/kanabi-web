export type LifeCategory = "food" | "travel" | "walk" | "diary";
export type LifePhoto = { src: string; alt: string; caption: string; width: number; height: number; kind: "original" | "composite" | "character" };
export type LifeBlock = { type: "paragraph" | "heading" | "quote"; text: string } | { type: "photo"; photo: LifePhoto };
export type LifePost = {
  slug: string; title: string; excerpt: string; category: LifeCategory;
  status: "draft" | "published"; publishedAt?: string; updatedAt?: string;
  characterId: "shen-yichen"; tags: string[]; cover: LifePhoto;
  place?: { name: string; area: string; visitedAt: string };
  disclosure: string; blocks: LifeBlock[];
  source: { kind: "character-introduction" | "character-opinion" | "field-visit"; notes: string; photoReferences: string[]; reviewed: boolean };
};
