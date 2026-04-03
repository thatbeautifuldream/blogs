import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AtSign, GitBranch, Globe, MapPin } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PostCard } from "@/components/post-card";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompactNumber, formatLongDate } from "@/lib/content-format";
import { getCaller } from "@/trpc/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const caller = await getCaller();
  const profile = await caller.content.profileByUsername({ username });

  if (!profile) {
    return {
      title: "Profile not found | Blog",
    };
  }

  return {
    title: `${profile.name} | Blog`,
    description: profile.bio,
  };
}

export async function generateStaticParams() {
  const caller = await getCaller();
  const explore = await caller.content.explore();

  return explore.authors.map((author) => ({ username: author.username }));
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const caller = await getCaller();
  const profile = await caller.content.profileByUsername({ username });

  if (!profile) {
    notFound();
  }

  return (
    <AppShell>
      <section className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            {profile.name}
          </h1>
          <p className="text-lg text-muted-foreground">@{profile.username}</p>
          <p className="text-lg leading-7 text-muted-foreground text-pretty max-w-2xl">
            {profile.headline}
          </p>
        </div>

        <div className="max-w-2xl text-base leading-7 text-muted-foreground text-pretty">
          {profile.bio}
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            {profile.location}
          </span>
          <span className="inline-flex items-center gap-2">
            Joined {formatLongDate(profile.joinedAt)}
          </span>
        </div>

        <Card>
          <CardContent className="grid grid-cols-3 divide-x divide-border py-6 text-center">
            <div className="px-4">
              <div className="text-3xl font-semibold tabular-nums">{profile.totalPosts}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">Posts</div>
            </div>
            <div className="px-4">
              <div className="text-3xl font-semibold tabular-nums">{formatCompactNumber(profile.totalViews)}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">Views</div>
            </div>
            <div className="px-4">
              <div className="text-3xl font-semibold tabular-nums">{profile.topicCount}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">Topics</div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <a href={profile.website} className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
            <Globe className="size-4 shrink-0" />
            {profile.website}
          </a>
          <a href={`https://twitter.com/${profile.twitter}`} className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
            <AtSign className="size-4 shrink-0" />
            {profile.twitter}
          </a>
          <a href={`https://github.com/${profile.github}`} className="inline-flex items-center gap-2 hover:text-foreground transition-colors">
            <GitBranch className="size-4 shrink-0" />
            {profile.github}
          </a>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight text-balance">
            {profile.totalPosts} Posts
          </h2>
          <p className="text-base text-muted-foreground text-pretty">
            Stories published by {profile.name}.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {profile.posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
