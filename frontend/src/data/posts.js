export const AVATAR_GRADIENTS = [
  ['#f4f1ec','#e8e0d5'],
  ['#f9f6f0','#f0ebe5'],
  ['#ddd1c7','#d4c5b9'],
  ['#c4b5a6','#b8a085'],
  ['#8b7355','#5d4e37'],
  ['#e8e0d5','#c4b5a6'],
  ['#f0ebe5','#ddd1c7'],
]

export const CATEGORIES = [
  'Technology','Design','Opinion','Work','Science',
  'Culture','Finance','Health','Engineering','Product',
]

export const INITIAL_POSTS = [
  {
    id: 1,
    title: 'The Future of Decentralized Content Platforms',
    body: `Web3 is fundamentally reshaping how we think about content ownership and monetization. In traditional platforms, the creator is essentially a renter — the platform owns the audience, the data, and all the revenue levers.

Decentralized platforms flip this entirely. By anchoring content to a blockchain, creators carry their audience across platforms like a portable social graph. Tokens become the new follower count, but one with real financial value attached.

The implications are staggering. A writer who builds an audience of 50,000 token holders isn't locked to Substack or Medium — they can migrate their community to any platform that speaks the same protocol. Content becomes portable in ways that feel genuinely revolutionary.

But decentralization also introduces real complexity. Key management, gas fees, wallet UX — these are real friction points that have stalled mainstream adoption repeatedly. The platforms that win won't just be decentralized, they'll hide the decentralization almost entirely from users who don't care about it.

The next 24 months will be critical. Either the tooling matures to the point where onboarding doesn't require a CS degree, or the window closes again and centralized platforms consolidate further.`,
    status: 'published',
    tags: ['web3', 'defi', 'content'],
    category: 'Technology',
    author: 'You',
    authorHandle: '@you',
    likes: 284, comments: 47, reposts: 63, bookmarks: 31,
    liked: false, bookmarked: false, reposted: false,
    createdAt: '2h ago',
    readTime: 4,
    wordCount: 312,
    avatarIdx: 0,
  },
  {
    id: 2,
    title: 'AI Writing Assistants: Tool or Crutch?',
    body: `Every few months a new wave of discourse crashes across developer Twitter about whether AI coding/writing tools are making us dumber or smarter. The truth, as always, is more nuanced than either camp wants to admit.

I've been using LLMs heavily for writing for the past year, and my honest take: they're extraordinarily good at eliminating blank-page paralysis but genuinely dangerous for the critical revision phase.

The problem isn't that AI produces bad prose — it's that it produces plausible prose. Plausible enough that you stop interrogating it. You read it, your brain pattern-matches to "this sounds like writing," and you hit publish. The specific texture of your thinking, the weird turns of phrase that make your voice yours — all sanded down into confident, competent beige.

The unlock, for me, was treating AI outputs as raw material rather than drafts. Let it generate three different structures for the same argument. Use whichever skeleton makes sense, but write the actual sentences yourself. The efficiency gains stay; the voice erosion stops.`,
    status: 'draft',
    tags: ['ai', 'writing', 'productivity'],
    category: 'Opinion',
    author: 'You',
    authorHandle: '@you',
    likes: 0, comments: 0, reposts: 0, bookmarks: 0,
    liked: false, bookmarked: false, reposted: false,
    createdAt: '5h ago',
    readTime: 3,
    wordCount: 201,
    avatarIdx: 2,
  },
  {
    id: 3,
    title: 'Building a Zero-Config Design System in 2025',
    body: `Design systems have gone from optional luxury to table stakes for any team shipping at scale. But most tutorials start from a blank Figma file and end 47 hours later with a half-finished token library that nobody actually uses.

Here's the approach that actually worked for my team: start with the constraints, not the components.

Instead of asking "what components do we need?" ask "what decisions do we want to centralize?" Spacing? Color? Typography? Start there. A single well-maintained set of spacing tokens prevents more inconsistency than a hundred component variants ever will.

The zero-config part comes from leaning hard into CSS custom properties with sensible defaults. Every component should work out of the box with no configuration, but every aspect should be override-able through the token layer. This isn't a new idea — it's just one that most design systems implement backwards.

Start with tokens → build utilities → compose components. In that order. Always.`,
    status: 'review',
    tags: ['design', 'frontend', 'systems'],
    category: 'Design',
    author: 'You',
    authorHandle: '@you',
    likes: 0, comments: 0, reposts: 0, bookmarks: 0,
    liked: false, bookmarked: false, reposted: false,
    createdAt: '1d ago',
    readTime: 6,
    wordCount: 445,
    avatarIdx: 1,
  },
  {
    id: 4,
    title: 'The Async Mindset: How Remote Teams Actually Ship',
    body: `Four years of fully-remote work taught me one thing above all else: the bottleneck is almost never effort, almost always coordination.

Async-first teams don't just move meetings to Loom videos. They redesign decision-making entirely — defaulting to written proposals, time-boxed comment windows, and explicit decision owners. The goal isn't to eliminate real-time communication; it's to make real-time communication an intentional choice rather than the default.

The most underrated async tool isn't Notion or Linear or Slack. It's a well-written decision log. A living document that captures what was decided, why, what alternatives were considered, and who was consulted. Six months later when someone asks "why do we do it this way?" — you have an answer that isn't someone's faulty memory.

The teams that struggle with async are almost always missing one thing: explicit norms around response time. Without them, every message carries implicit urgency. With them, you can genuinely disconnect, do deep work, and trust that the team will hold together.`,
    status: 'published',
    tags: ['remote', 'async', 'teams'],
    category: 'Work',
    author: 'You',
    authorHandle: '@you',
    likes: 519, comments: 88, reposts: 104, bookmarks: 57,
    liked: true, bookmarked: true, reposted: false,
    createdAt: '3d ago',
    readTime: 7,
    wordCount: 620,
    avatarIdx: 3,
  },
  {
    id: 5,
    title: 'On Shipping Small: The Art of the Micro-Product',
    body: `The mythology of startup success is almost entirely built around scale. The billion-user platform. The category-defining network. But there's a quieter, more interesting story playing out in the margins: tiny products, built by one or two people, generating enough revenue to be genuinely life-changing for their makers.

I call these micro-products. Not side projects (implies something parked, waiting for "some day"). Not indie apps (implies a certain platform-dependent aesthetic). Micro-products: deliberately small, deliberately focused, deliberately profitable.

The magic of going small is that you get to know your users personally. Not through NPS surveys and cohort analysis — through DMs and emails and actual conversations. That proximity to real humans using your thing is intoxicating, and it makes the product dramatically better faster.`,
    status: 'published',
    tags: ['product', 'indie', 'startups'],
    category: 'Product',
    author: 'You',
    authorHandle: '@you',
    likes: 1032, comments: 156, reposts: 287, bookmarks: 198,
    liked: false, bookmarked: false, reposted: false,
    createdAt: '1w ago',
    readTime: 5,
    wordCount: 398,
    avatarIdx: 4,
  },
  {
    id: 6,
    title: 'Design Systems That Scale: Beyond the Component Library',
    body: `Most design systems fail because they treat components as the end goal rather than the means. A component library is just a delivery mechanism — the real value is in the system that enables consistent decision-making at scale.

The breakthrough for us was realizing that design tokens aren't just for colors and spacing. We now have tokens for interaction patterns, animation curves, and even content strategy guidelines. Every design decision gets codified into the system, creating a feedback loop where the system evolves with the product.

But here's the hard truth: maintaining a design system requires the same rigor as maintaining production code. You need version control, automated testing, migration guides, and deprecation policies. Without that infrastructure, your system becomes another graveyard of good intentions.

The teams that succeed don't just build design systems — they build design system cultures. Where every designer and developer sees themselves as system contributors, not just consumers.`,
    status: 'published',
    tags: ['design', 'systems', 'scale'],
    category: 'Design',
    author: 'Trisha Gupta',
    authorHandle: '@trishagupta',
    likes: 456, comments: 78, reposts: 123, bookmarks: 89,
    liked: false, bookmarked: false, reposted: false,
    createdAt: '3h ago',
    readTime: 4,
    wordCount: 267,
    avatarIdx: 1,
  },
  {
    id: 7,
    title: 'The Kashmir Startup Scene: Building in Isolation',
    body: `Starting a tech company in Kashmir taught me more about resilience than any business book ever could. When the internet goes down for days (which it does), you learn to build offline-first by necessity. When travel restrictions limit your access to investors and talent, you learn to bootstrap with whatever resources you have locally.

The isolation has bred a unique kind of innovation. Kashmiri founders don't have the luxury of Silicon Valley networking events or easy access to venture capital. Instead, we've built strong local ecosystems — hacker houses in Srinagar, angel networks that understand our context, and a diaspora that's incredibly supportive.

But the challenges are real. Talent retention is the biggest hurdle. The brightest minds often leave for opportunities in bigger cities. We're working on creating compelling reasons to stay — not just competitive salaries, but meaningful work that contributes to our community.

The next wave of Indian entrepreneurship won't come from the metros. It'll come from places like Kashmir, where necessity has forged stronger founders.`,
    status: 'published',
    tags: ['startup', 'kashmir', 'entrepreneurship'],
    category: 'Culture',
    author: 'Souleh Bhat',
    authorHandle: '@souleh',
    likes: 892, comments: 145, reposts: 234, bookmarks: 167,
    liked: false, bookmarked: false, reposted: false,
    createdAt: '6h ago',
    readTime: 5,
    wordCount: 289,
    avatarIdx: 1,
  },
]

// ─── Initial Comments ────────────────────────────────────────────────────────
export const INITIAL_COMMENTS = [
  {
    id: 'c1', postId: 1,
    author: 'Sam Chen', handle: '@samchen', avatarIdx: 1,
    body: 'Really insightful take on decentralized platforms. The portable social graph concept is the key unlock — nobody wants to rebuild their audience from scratch every time they switch platforms.',
    likes: 24, liked: false,
    createdAt: '1h ago',
    replies: [
      {
        id: 'r1', parentId: 'c1',
        author: 'You', handle: '@you', avatarIdx: 0,
        body: 'Exactly — the portability is what changes the power dynamic entirely. Thanks for reading!',
        likes: 8, liked: false, createdAt: '45m ago',
      }
    ]
  },
  {
    id: 'c2', postId: 1,
    author: 'Jordan Park', handle: '@jordanpark', avatarIdx: 3,
    body: "The point about hiding the decentralization is underrated. Crypto UX has been the biggest blocker. The apps that nail abstraction are going to win.",
    likes: 17, liked: false,
    createdAt: '90m ago',
    replies: []
  },
  {
    id: 'c3', postId: 4,
    author: 'Taylor Moss', handle: '@taylormoss', avatarIdx: 5,
    body: 'The decision log point hit home. We started doing this 6 months ago and it has completely eliminated the "why did we do it this way?" rabbit holes.',
    likes: 41, liked: false,
    createdAt: '2d ago',
    replies: [
      {
        id: 'r2', parentId: 'c3',
        author: 'You', handle: '@you', avatarIdx: 0,
        body: "So glad it resonated! The decision log is probably the most impactful async habit we've adopted too.",
        likes: 12, liked: false, createdAt: '2d ago',
      }
    ]
  },
  {
    id: 'c4', postId: 5,
    author: 'Kai Nakamura', handle: '@kainakamura', avatarIdx: 4,
    body: 'Micro-product vs side project framing is exactly right. The intentionality of "profitable by design" changes everything about how you approach scope.',
    likes: 88, liked: false,
    createdAt: '6d ago',
    replies: []
  },
]
