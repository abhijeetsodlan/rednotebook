import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { excerptFromMarkdown, normalizeTags, readingTime } from "@/lib/markdown";

function isUnavailableDatabase(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && ["P2021", "P2022", "P1001", "P1003"].includes(error.code);
}

export type PostListItem = Awaited<ReturnType<typeof getPublishedPosts>>["posts"][number];

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
  const where = {
    status: "published",
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { excerpt: { contains: query } }
          ]
        }
      : {})
  };

  try {
    const [rawPosts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: sort === "oldest" ? "asc" : "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      prisma.post.count({ where })
    ]);
    const posts = rawPosts
      .map((post) => ({
        ...post,
        tags: normalizeTags(post.tags),
        excerpt: post.excerpt || excerptFromMarkdown(post.content),
        readingMinutes: readingTime(post.content)
      }))
      .filter((post) => (tag ? post.tags.includes(tag) : true));
    return { posts, total, page, pageSize };
  } catch (error) {
    if (isUnavailableDatabase(error)) return { posts: [], total: 0, page, pageSize };
    throw error;
  }
}

export async function getActiveNotice() {
  try {
    const notice = await prisma.notice.findFirst({
      where: {
        active: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
      },
      orderBy: { updatedAt: "desc" }
    });
    return notice;
  } catch (error) {
    if (isUnavailableDatabase(error)) return null;
    throw error;
  }
}
