import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AtSign, GitBranch, Globe, MapPin } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PostCard } from "@/components/post-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompactNumber, formatLongDate, initials } from "@/lib/content-format";
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
      title: "Profile not found | Blogs",
    };
  }

  return {
    title: `${profile.name} | Blogs`,
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
      <section className="grid gap-px border border-border bg-border lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5 bg-background p-5 md:p-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-18 border border-border md:size-20">
              <AvatarImage src={profile.avatarUrl} alt={profile.name} />
              <AvatarFallback>{initials(profile.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <Badge variant="outline" className="w-fit">
                @{profile.username}
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
              <p className="text-sm text-muted-foreground md:text-base">{profile.headline}</p>
            </div>
          </div>

          <div className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
            {profile.bio}
          </div>

          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <span className="inline-flex items-center gap-2 border border-border px-3 py-2">
              <MapPin className="size-3.5" />
              {profile.location}
            </span>
            <span className="inline-flex items-center gap-2 border border-border px-3 py-2">
              Joined {formatLongDate(profile.joinedAt)}
            </span>
          </div>
        </div>

        <Card className="border-0 bg-background">
          <CardContent className="space-y-5 py-5">
            <div className="grid grid-cols-3 gap-px bg-border text-center">
              <div className="bg-background px-3 py-4">
                <div className="text-2xl font-bold">{profile.totalPosts}</div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Posts</div>
              </div>
              <div className="bg-background px-3 py-4">
                <div className="text-2xl font-bold">{formatCompactNumber(profile.totalViews)}</div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Views</div>
              </div>
              <div className="bg-background px-3 py-4">
                <div className="text-2xl font-bold">{profile.topicCount}</div>
                <div className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Topics</div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2">
                <Globe className="size-4" />
                {profile.website}
              </div>
              <div className="inline-flex items-center gap-2">
                <AtSign className="size-4" />
                {profile.twitter}
              </div>
              <div className="inline-flex items-center gap-2">
                <GitBranch className="size-4" />
                {profile.github}
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href="/editor">Write from this profile</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight">Published by {profile.name}</h2>
          <p className="text-sm text-muted-foreground">
            Real route data rendered through the shared content repository.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {profile.posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
