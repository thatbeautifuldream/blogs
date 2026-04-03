import type { Metadata } from "next";
import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import { getCaller } from "@/trpc/server";

export const metadata: Metadata = {
  title: "All Posts | Blog",
  description: "Browse all posts.",
};

export default async function BlogsPage() {
  const caller = await getCaller();
  const [posts, explore] = await Promise.all([
    caller.content.blogList(),
    caller.content.explore(),
  ]);

  return (
    <>
      <section className="space-y-6">
        <Badge variant="outline">All Posts</Badge>
        <div className="space-y-4">
          <h1 className="text-5xl font-semibold tracking-tight leading-tight md:text-6xl lg:text-7xl">
            Stories and ideas
          </h1>
          <p className="max-w-2xl text-lg leading-7 text-muted-foreground md:text-xl">
            A collection of posts from the community.
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-lg font-medium">Browse by topic</h2>
        <div className="flex flex-wrap gap-3">
          {explore.topics.map((topic) => (
            <Badge key={topic.label} variant="outline" className="text-base px-4 py-2">
              {topic.label} <span className="ml-2 text-muted-foreground">{topic.count}</span>
            </Badge>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold tracking-tight">
          {posts.length} Posts
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </>
  );
}
