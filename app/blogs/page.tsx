export const dynamic = 'force-dynamic';

import BlogsArchive from "@/components/BlogsArchive";
import { getPublishedPosts } from "@/lib/mongo-store";

export default async function BlogsPage() {
  const { posts } = await getPublishedPosts({ pageSize: 1000 });
  return <BlogsArchive posts={posts} />;
}


