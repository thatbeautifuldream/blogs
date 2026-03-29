function toSvgDataUrl(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

function createAvatar(name: string, background: string, foreground: string) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return toSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="36" fill="${background}" />
      <circle cx="80" cy="64" r="28" fill="${foreground}" opacity="0.18" />
      <text x="80" y="98" text-anchor="middle" font-size="42" font-family="Georgia, serif" fill="${foreground}">
        ${initials}
      </text>
    </svg>
  `)
}

function createCover(title: string, eyebrow: string, colors: [string, string, string]) {
  const [base, accent, text] = colors

  return toSvgDataUrl(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
      <rect width="1200" height="720" fill="${base}" />
      <circle cx="230" cy="180" r="220" fill="${accent}" opacity="0.28" />
      <circle cx="980" cy="520" r="260" fill="${accent}" opacity="0.22" />
      <rect x="64" y="72" width="170" height="34" rx="17" fill="${text}" opacity="0.12" />
      <text x="92" y="95" font-size="20" font-family="Arial, sans-serif" fill="${text}">
        ${eyebrow}
      </text>
      <text x="92" y="270" font-size="66" font-family="Georgia, serif" fill="${text}">
        ${title.slice(0, 34)}
      </text>
      <text x="92" y="334" font-size="66" font-family="Georgia, serif" fill="${text}">
        ${title.slice(34, 68)}
      </text>
      <rect x="92" y="420" width="420" height="2" fill="${text}" opacity="0.3" />
      <text x="92" y="470" font-size="28" font-family="Arial, sans-serif" fill="${text}" opacity="0.8">
        Blogs phase-2 demo content
      </text>
    </svg>
  `)
}

export type ContentAuthor = {
  id: number
  username: string
  name: string
  bio: string
  headline: string
  avatarUrl: string
  location: string
  website: string
  twitter: string
  github: string
  joinedAt: Date
}

export type ContentPost = {
  id: number
  authorId: number
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
  tags: string[]
  featured: boolean
}

export type EditorDraft = {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl: string
  tags: string[]
}

export const demoAuthors: ContentAuthor[] = [
  {
    id: 1,
    username: "milind",
    name: "Milind Kulkarni",
    bio: "Product-minded engineer writing about calm software, modern app architecture, and the invisible quality bar that makes tools feel trustworthy.",
    headline: "Building blog products with useful constraints",
    avatarUrl: createAvatar("Milind Kulkarni", "#E9D8C9", "#3D2A21"),
    location: "Bengaluru, India",
    website: "https://blogs.local/milind",
    twitter: "@milindbuilds",
    github: "milind-air",
    joinedAt: new Date("2024-11-05T08:30:00.000Z"),
  },
  {
    id: 2,
    username: "ananya",
    name: "Ananya Rao",
    bio: "Designer-turned-founder documenting editorial systems, onboarding flows, and the tiny UX details that help writing tools feel humane.",
    headline: "Designing for people who publish every day",
    avatarUrl: createAvatar("Ananya Rao", "#D7E7E1", "#1F3D3A"),
    location: "Mumbai, India",
    website: "https://blogs.local/ananya",
    twitter: "@ananyarao",
    github: "ananya-ux",
    joinedAt: new Date("2025-01-12T11:00:00.000Z"),
  },
]

export const demoPosts: ContentPost[] = [
  {
    id: 101,
    authorId: 1,
    title: "The case for a calmer publishing stack",
    slug: "calmer-publishing-stack",
    excerpt:
      "A believable blog product does not start with growth loops. It starts with trust: fast pages, sharp defaults, and a writing flow that does not fight the author.",
    content: `Publishing tools usually lose people long before they lose scale. The failure mode is subtle: too many decisions before a writer has finished a thought, too much chrome around the content, and too little confidence that the page will still look good after the final click.

The calmer alternative is narrower. Make the default route obvious. Let a draft feel close to the published page. Keep metadata, tags, and promotion settings nearby without turning the editor into a cockpit. When the stack is type-safe underneath, the surface can afford to be simple.

This is why a blog product can benefit from a strict phase-based build. The first phase proves the architecture can carry typed data end to end. The second phase proves the product can feel real with seeded content, real routes, and enough editorial texture that screenshots stop looking like wireframes.

If the product shape is believable now, future auth and persistence work become refinement instead of rescue. That is a much better place to be.`,
    coverImageUrl: createCover("The calmer publishing stack", "Editorial UX", [
      "#F4E2D3",
      "#DDAF87",
      "#2B1C16",
    ]),
    status: "published",
    readingTimeMinutes: 6,
    views: 1842,
    publishedAt: new Date("2026-03-16T06:00:00.000Z"),
    createdAt: new Date("2026-03-14T06:00:00.000Z"),
    updatedAt: new Date("2026-03-16T06:00:00.000Z"),
    tags: ["Product", "Editorial UX", "Architecture"],
    featured: true,
  },
  {
    id: 102,
    authorId: 2,
    title: "What an explore feed should do in week one",
    slug: "explore-feed-week-one",
    excerpt:
      "The homepage is not a dumping ground for every post. It should create momentum, surface voices, and make the rest of the site legible in one scroll.",
    content: `A strong explore page behaves like a front page with opinions. It should tell readers where to start, which authors feel active, and what kinds of ideas live here. That does not require personalization on day one. It requires editorial intent.

The first screen needs one strong story and one obvious path deeper. Beneath that, recent writing can show momentum while a few focused topic clusters teach the reader how the catalog is organized. Profiles matter here too: a blog product feels more alive when authors are visible as people rather than bylines.

Most early homepages fail by trying to solve discovery, retention, and announcement banners in the same rectangle. A smaller scope usually performs better. Help the reader build confidence fast, then hand off to the list page or the article itself.`,
    coverImageUrl: createCover("Explore feed decisions", "Homepage", [
      "#E3EFE9",
      "#8BB7A6",
      "#17312A",
    ]),
    status: "published",
    readingTimeMinutes: 5,
    views: 1294,
    publishedAt: new Date("2026-03-21T07:30:00.000Z"),
    createdAt: new Date("2026-03-19T05:30:00.000Z"),
    updatedAt: new Date("2026-03-21T07:30:00.000Z"),
    tags: ["Explore", "Homepage", "Content Design"],
    featured: true,
  },
  {
    id: 103,
    authorId: 1,
    title: "Type-safe demo data is not fake architecture",
    slug: "type-safe-demo-data",
    excerpt:
      "If local infrastructure is unreliable, a typed fallback content layer is a practical way to keep product work moving without hard-coding lies into the UI.",
    content: `Demo content only becomes a problem when it leaks everywhere. The fix is not to avoid seed data. The fix is to isolate it behind the same contracts the real backend will use later.

That means the page should not care whether the repository read from Postgres or from a local fixture. It should receive the same shape either way. Once that discipline is in place, product work can proceed while migrations, seed scripts, or local services catch up.

This approach is especially helpful in a no-auth phase. You can design the routes, refine layout density, validate content relationships, and prove the tRPC surface area before any identity model arrives. Later, replacing the demo adapter with fuller database reads is incremental rather than disruptive.`,
    coverImageUrl: createCover("Type-safe demo data", "Architecture", [
      "#E4EAF3",
      "#9DB3D1",
      "#1D2940",
    ]),
    status: "published",
    readingTimeMinutes: 4,
    views: 876,
    publishedAt: new Date("2026-03-25T10:15:00.000Z"),
    createdAt: new Date("2026-03-24T10:15:00.000Z"),
    updatedAt: new Date("2026-03-25T10:15:00.000Z"),
    tags: ["tRPC", "Drizzle", "Seed Data"],
    featured: false,
  },
  {
    id: 104,
    authorId: 2,
    title: "Writer-friendly defaults for a no-auth editor",
    slug: "writer-friendly-editor-defaults",
    excerpt:
      "An editor can feel substantial before persistence exists. The key is realistic structure: title, summary, body, publish settings, and a trustworthy preview rhythm.",
    content: `Writers judge an editor quickly. The layout tells them whether the product respects the job. If the title field feels cramped, if the metadata form dominates the page, or if preview is too far from composition, confidence drops.

For an early-stage editor, the most important defaults are spatial. Give the draft enough room. Put status, reading time, and tags in a side rail. Let the call to publish exist, even if it is not wired yet, because the user needs to understand the intended endpoint.

This is where believable seed content helps again. A pre-filled draft reveals how the interface behaves under real text length, how headings wrap, and whether the surrounding controls feel proportional. Empty states are useful, but they do not expose layout truth the same way.`,
    coverImageUrl: createCover("Writer-friendly editor defaults", "Drafting", [
      "#F3E7DA",
      "#CC9A65",
      "#392317",
    ]),
    status: "published",
    readingTimeMinutes: 7,
    views: 1107,
    publishedAt: new Date("2026-03-27T04:45:00.000Z"),
    createdAt: new Date("2026-03-26T04:45:00.000Z"),
    updatedAt: new Date("2026-03-27T04:45:00.000Z"),
    tags: ["Editor", "UX", "Drafting"],
    featured: false,
  },
]

export const demoDraft: EditorDraft = {
  title: "Designing the first publish flow without auth",
  slug: "first-publish-flow-without-auth",
  excerpt:
    "A phase-2 editor should clarify the publishing path before identity and permissions exist. The UI can teach that path now.",
  content: `Start with a draft that feels almost publishable. This lets product and design evaluate pacing, hierarchy, and metadata placement while the backend catches up.

The trick is to show believable controls without promising more than the phase supports. Save, publish, and preview affordances can exist as product signals even when they are still local-only.

Once auth arrives, the editor should gain ownership and persistence, not a completely different structure.`,
  coverImageUrl: createCover("First publish flow", "Roadmap", [
    "#E1ECF5",
    "#82A8CB",
    "#1A2C40",
  ]),
  tags: ["Editor", "Roadmap", "Publishing"],
}
