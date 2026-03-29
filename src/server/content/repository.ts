import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  demoAuthors,
  demoDraft,
  demoPosts,
  type ContentAuthor,
  type ContentPost,
} from "@/server/content/demo-data"
import { postTags, posts, profiles, tags, users } from "@/server/db/schema"

type PostRecord = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl: string
  status: "draft" | "published"
  readingTimeMinutes: number
  views: number
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  featured: boolean
  author: ContentAuthor
  tags: string[]
}

type ProfileRecord = ContentAuthor & {
  posts: PostRecord[]
  totalViews: number
  totalPosts: number
  topicCount: number
}

type ExploreRecord = {
  heroPost: PostRecord
  featuredPosts: PostRecord[]
  recentPosts: PostRecord[]
  authors: ProfileRecord[]
  topics: Array<{ label: string; count: number }>
}

type DbPostRow = {
  postId: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImageUrl: string | null
  status: "draft" | "published"
  readingTimeMinutes: number
  views: number
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  userId: number
  username: string
  name: string
  bio: string | null
  avatarUrl: string | null
  website: string | null
  twitter: string | null
  github: string | null
  tagName: string | null
}

const fallbackCover = demoDraft.coverImageUrl
const fallbackAvatar = demoAuthors[0].avatarUrl

function groupDemoPosts(postsToGroup: ContentPost[]): PostRecord[] {
  return postsToGroup.map((post) => {
    const author = demoAuthors.find((candidate) => candidate.id === post.authorId)

    if (!author) {
      throw new Error(`Missing demo author for post ${post.slug}`)
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImageUrl: post.coverImageUrl,
      status: post.status,
      readingTimeMinutes: post.readingTimeMinutes,
      views: post.views,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      featured: post.featured,
      author,
      tags: post.tags,
    }
  })
}

function groupDbPosts(rows: DbPostRow[]): PostRecord[] {
  const postMap = new Map<number, PostRecord>()

  for (const row of rows) {
    const existing = postMap.get(row.postId)

    if (existing) {
      if (row.tagName && !existing.tags.includes(row.tagName)) {
        existing.tags.push(row.tagName)
      }

      continue
    }

    postMap.set(row.postId, {
      id: row.postId,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt ?? "",
      content: row.content,
      coverImageUrl: row.coverImageUrl ?? fallbackCover,
      status: row.status,
      readingTimeMinutes: row.readingTimeMinutes,
      views: row.views,
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      featured: false,
      author: {
        id: row.userId,
        username: row.username,
        name: row.name,
        bio: row.bio ?? "Writing on Blogs.",
        headline: "Publishing on Blogs",
        avatarUrl: row.avatarUrl ?? fallbackAvatar,
        location: "Local environment",
        website: row.website ?? "",
        twitter: row.twitter ? `@${row.twitter.replace(/^@/, "")}` : "",
        github: row.github ?? "",
        joinedAt: row.createdAt,
      },
      tags: row.tagName ? [row.tagName] : [],
    })
  }

  return [...postMap.values()]
}

async function readPublishedPostsFromDb() {
  const rows = await db
    .select({
      postId: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      coverImageUrl: posts.coverImageUrl,
      status: posts.status,
      readingTimeMinutes: posts.readingTimeMinutes,
      views: posts.views,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      userId: users.id,
      username: users.username,
      name: users.name,
      bio: profiles.bio,
      avatarUrl: profiles.avatarUrl,
      website: profiles.website,
      twitter: profiles.twitter,
      github: profiles.github,
      tagName: tags.name,
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .leftJoin(profiles, eq(profiles.userId, users.id))
    .leftJoin(postTags, eq(postTags.postId, posts.id))
    .leftJoin(tags, eq(tags.id, postTags.tagId))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt))

  return groupDbPosts(rows as DbPostRow[])
}

async function getPublishedPosts() {
  try {
    const rows = await readPublishedPostsFromDb()

    if (rows.length > 0) {
      return rows
    }
  } catch {
    // Local development should not fail hard when Postgres or migrations are missing.
  }

  return groupDemoPosts(
    demoPosts
      .filter((post) => post.status === "published")
      .sort((left, right) => {
        const leftTime = left.publishedAt?.getTime() ?? left.createdAt.getTime()
        const rightTime = right.publishedAt?.getTime() ?? right.createdAt.getTime()

        return rightTime - leftTime
      }),
  )
}

function buildProfile(author: ContentAuthor, authoredPosts: PostRecord[]): ProfileRecord {
  const topicCount = new Set(authoredPosts.flatMap((post) => post.tags)).size

  return {
    ...author,
    posts: authoredPosts,
    totalViews: authoredPosts.reduce((sum, post) => sum + post.views, 0),
    totalPosts: authoredPosts.length,
    topicCount,
  }
}

export async function listBlogPosts() {
  return getPublishedPosts()
}

export async function getBlogBySlug(slug: string) {
  const allPosts = await getPublishedPosts()
  return allPosts.find((post) => post.slug === slug) ?? null
}

export async function getExploreData(): Promise<ExploreRecord> {
  const publishedPosts = await getPublishedPosts()
  const heroPost = publishedPosts[0]
  const featuredPosts = publishedPosts.filter((post) => post.featured).slice(0, 3)
  const recentPosts = publishedPosts.slice(0, 4)
  const authorMap = new Map<string, ProfileRecord>()
  const topicCounts = new Map<string, number>()

  for (const post of publishedPosts) {
    const existing = authorMap.get(post.author.username)

    if (existing) {
      existing.posts.push(post)
      existing.totalPosts += 1
      existing.totalViews += post.views
      existing.topicCount = new Set(existing.posts.flatMap((item) => item.tags)).size
    } else {
      authorMap.set(post.author.username, buildProfile(post.author, [post]))
    }

    for (const tag of post.tags) {
      topicCounts.set(tag, (topicCounts.get(tag) ?? 0) + 1)
    }
  }

  const authors = [...authorMap.values()].sort((left, right) => right.totalViews - left.totalViews)
  const topics = [...topicCounts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 6)

  return {
    heroPost,
    featuredPosts,
    recentPosts,
    authors,
    topics,
  }
}

export async function getProfileByUsername(username: string) {
  try {
    const userRow = await db
      .select({
        id: users.id,
        username: users.username,
        name: users.name,
        bio: profiles.bio,
        avatarUrl: profiles.avatarUrl,
        website: profiles.website,
        twitter: profiles.twitter,
        github: profiles.github,
        createdAt: users.createdAt,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(eq(users.username, username))
      .limit(1)

    if (userRow[0]) {
      const authorPosts = (await getPublishedPosts()).filter(
        (post) => post.author.username === username,
      )

      return buildProfile(
        {
          id: userRow[0].id,
          username: userRow[0].username,
          name: userRow[0].name,
          bio: userRow[0].bio ?? "Writing on Blogs.",
          headline: "Publishing on Blogs",
          avatarUrl: userRow[0].avatarUrl ?? fallbackAvatar,
          location: "Local environment",
          website: userRow[0].website ?? "",
          twitter: userRow[0].twitter ? `@${userRow[0].twitter.replace(/^@/, "")}` : "",
          github: userRow[0].github ?? "",
          joinedAt: userRow[0].createdAt,
        },
        authorPosts,
      )
    }
  } catch {
    // Fall back to seeded profiles when the DB is unavailable.
  }

  const publishedPosts = await getPublishedPosts()
  const author = demoAuthors.find((candidate) => candidate.username === username)

  if (!author) {
    return null
  }

  return buildProfile(
    author,
    publishedPosts.filter((post) => post.author.username === username),
  )
}

export async function getEditorData() {
  const publishedPosts = await getPublishedPosts()
  const selectedAuthor =
    (await getProfileByUsername("milind")) ??
    buildProfile(demoAuthors[0], publishedPosts.filter((post) => post.author.id === 1))

  return {
    draft: demoDraft,
    author: selectedAuthor,
    suggestions: publishedPosts.slice(0, 3).map((post) => ({
      slug: post.slug,
      title: post.title,
      tag: post.tags[0] ?? "Writing",
    })),
    checklist: [
      "Tighten the headline until it scans in one line on mobile.",
      "Confirm the excerpt works as meta description copy.",
      "Add 2 to 4 tags that match existing explore topics.",
      "Ship with a cover image that feels editorial, not generic.",
    ],
  }
}

export async function getRelatedPosts(slug: string) {
  const currentPost = await getBlogBySlug(slug)

  if (!currentPost) {
    return []
  }

  const publishedPosts = await getPublishedPosts()

  return publishedPosts
    .filter((post) => post.slug !== slug)
    .sort((left, right) => {
      const leftShared = left.tags.filter((tag) => currentPost.tags.includes(tag)).length
      const rightShared = right.tags.filter((tag) => currentPost.tags.includes(tag)).length

      return rightShared - leftShared
    })
    .slice(0, 3)
}
