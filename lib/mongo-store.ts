import type { WithId } from "mongodb";
import { mongoDb, toObjectId } from "@/lib/mongodb";
import { excerptFromMarkdown, normalizeTags, readingTime, serializeTags, slugify } from "@/lib/markdown";

export type PostStatus = "draft" | "published";

export type PostDocument = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  coverAlt?: string | null;
  tags: string[];
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
};

export type NoticeDocument = {
  message: string;
  active: boolean;
  expiresAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PostView = Omit<PostDocument, "tags"> & {
  id: string;
  tags: string[];
  excerpt: string;
  readingMinutes: number;
};

function serializePost(post: WithId<PostDocument>): PostView {
  return {
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || excerptFromMarkdown(post.content),
    content: post.content,
    coverImage: post.coverImage || null,
    coverAlt: post.coverAlt || null,
    tags: normalizeTags(post.tags),
    status: post.status,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt || null,
    readingMinutes: readingTime(post.content)
  };
}

export async function postsCollection() {
  return (await mongoDb()).collection<PostDocument>("posts");
}

export async function noticeCollection() {
  return (await mongoDb()).collection<NoticeDocument>("notices");
}

export async function getPublishedPosts({
  query = "",
  tag = "",
  sort = "newest",
  page = 1,
  pageSize = 9
}: {
  query?: string;
  tag?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const collection = await postsCollection();
  const tagFilter = tag ? { tags: tag } : {};
  const queryFilter = query
    ? { $or: [{ title: { $regex: query, $options: "i" } }, { excerpt: { $regex: query, $options: "i" } }, { tags: { $regex: query, $options: "i" } }] }
    : {};
  const filter = { status: "published" as const, ...tagFilter, ...queryFilter };
  const [rawPosts, total] = await Promise.all([
    collection.find(filter).sort({ publishedAt: sort === "oldest" ? 1 : -1, createdAt: -1 }).skip((page - 1) * pageSize).limit(pageSize).toArray(),
    collection.countDocuments(filter)
  ]);
  return { posts: rawPosts.map(serializePost), total, page, pageSize };
}

export async function getPostBySlug(slug: string) {
  const post = await (await postsCollection()).findOne({ slug, status: "published" });
  return post ? serializePost(post) : null;
}

export async function getAllPublishedPostLinks() {
  const posts = await (await postsCollection()).find({ status: "published" }).sort({ publishedAt: -1, createdAt: -1 }).project<{ slug: string; title: string; updatedAt: Date }>({ slug: 1, title: 1, updatedAt: 1 }).toArray();
  return posts.map((post) => ({ slug: post.slug, title: post.title, updatedAt: post.updatedAt }));
}

export async function getAllAdminPosts() {
  const posts = await (await postsCollection()).find({}).sort({ updatedAt: -1 }).toArray();
  return posts.map(serializePost);
}

export async function getAdminPostById(id: string) {
  const post = await (await postsCollection()).findOne({ _id: toObjectId(id) });
  return post ? serializePost(post) : null;
}

export function postPayload(body: Record<string, unknown>, existing?: PostView) {
  const now = new Date();
  const status = body.status === "published" ? "published" : "draft";
  const previousPublishedAt = existing?.publishedAt ? new Date(existing.publishedAt) : null;
  return {
    title: String(body.title || existing?.title || "Untitled"),
    slug: slugify(String(body.slug || body.title || existing?.slug || "untitled")),
    excerpt: body.excerpt ? String(body.excerpt) : null,
    content: String(body.content || ""),
    coverImage: body.coverImage ? String(body.coverImage) : null,
    coverAlt: body.coverAlt ? String(body.coverAlt) : null,
    tags: normalizeTags(body.tags || serializeTags(existing?.tags || [])),
    status,
    updatedAt: now,
    publishedAt: status === "published" ? previousPublishedAt || now : null
  } satisfies Partial<PostDocument>;
}

export async function getActiveNotice() {
  const notice = await (await noticeCollection()).findOne({
    active: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }]
  }, { sort: { updatedAt: -1 } });
  return notice ? { id: notice._id.toString(), ...notice } : null;
}

export async function getLatestNotice() {
  const notice = await (await noticeCollection()).findOne({}, { sort: { updatedAt: -1 } });
  return notice ? { id: notice._id.toString(), ...notice } : null;
}
