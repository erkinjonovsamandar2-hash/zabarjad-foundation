# Project Memory & Corrections

This file tracks architectural decisions and corrections to ensure the AI does not repeat mistakes.

### [LEARN: Zabarjad Aesthetic]
* The background must always be Obsidian Black (`#121212`) or dark charcoal.
* The primary accent color is Zabarjad Gold (`#F7B500`). 
* Headings must use high-contrast Serif fonts; body text must use Sans-Serif.

### [LEARN: Supabase Schema]
* The `books` table uses `theme_color` (TEXT) to drive the dynamic background glows.
* The `quiz_leads` table captures emails connected to `recommended_book_id`.

### [LEARN: DataContext Book Interface]
* The `Book` interface in `DataContext.tsx` must always use canonical DB column
  names: `cover_image`, `theme_color`, `is_3d_enabled`, `sample_pages`.
* Legacy aliases (`cover_url`, `bg_color`, `enable_3d_flip`) must never be
  reintroduced. They were removed during Phase 2 migration.
* The category filter compares `book.category` directly against the filter key
  ("new" | "soon" | "gold") — never against the display label from LIBRARY_FILTER_MAP.

  ### [LEARN: Category Filter Logic]
* The `books.category` column stores raw DB keys: "new" | "soon" | "gold".
* The filter predicate in CuratedLibrary.tsx must ALWAYS compare
  `book.category === active` (the raw key).
* LIBRARY_FILTER_MAP is for UI display labels ONLY — never use it
  inside a `.filter()` predicate.
* Symptom of violation: books exist in DB but never render on screen.

### [LEARN: Database Column Names Are The Source of Truth]
* The real Supabase DB uses: `cover_url`, `bg_color`, `enable_3d_flip`,
  `featured`, `sort_order`. These must NEVER be renamed in code.
* `src/types/database.ts` must always be synced from the Supabase-generated
  `types.ts` file. Never invent column aliases.
* Symptom of violation: TypeScript mapper errors, books not rendering,
  fields silently defaulting to null/empty.

  ### [LEARN: theme_color Does Not Exist]
* `theme_color` is an invented alias that does not exist in the Supabase DB.
* The real column is `bg_color` (HSL string e.g. "210 60% 15%").
* Always render it as: `hsl(${book.bg_color ?? "210 60% 15%"})`.
* Never add `theme_color` to database.ts, DataContext.tsx, or any component.

### [LEARN: Loading Guards Are Mandatory]
* Every component that consumes `useData()` MUST destructure `loading`
  and render a skeleton/null while `loading === true`.
* Never access `books[index]` or `books.filter(...)[0]` without first
  confirming `loading === false` AND the array is non-empty.
* Symptom of violation: completely blank homepage on first load.

### [LEARN: Index.tsx Loading Gate]
* Index.tsx must gate ALL data-consuming sections behind the `loading`
  flag from `useData()`.
* Pattern: `{loading ? <PageSkeleton /> : <>{sections}</>}`
* Navbar and Footer are exempt — they have no data dependency.
* Symptom of missing gate: any component that accesses books/articles
  during initial render can crash the entire page silently.

### [LEARN: books Table Has No sort_order Column]
* The `books` table does NOT have a `sort_order` column in the live DB.
* Always order the books query by `created_at` descending.
* Correct: `.order("created_at", { ascending: false })`
* Symptom of violation: fetchBooks throws "column books.sort_order does
  not exist" and the entire homepage goes blank.

### [LEARN: Hero Carousel Selection Strategy]
* Never filter Hero carousel exclusively on `featured === true`.
  If no books have featured set, the carousel silently disappears.
* Always use a fallback: featured books first, slice(0, 4) if none.
* Pattern:
    const featuredBooks = books.filter(b => b.featured === true).length > 0
      ? books.filter(b => b.featured === true)
      : books.slice(0, 4);
* The empty-state guard must check `books.length === 0` (no DB rows at all),
  NOT `featuredBooks.length === 0`.

    ### [LEARN: Hero Layout — Single Flex Column]
  * All Hero content lives in ONE `flex-col items-center gap-0` column.
  * Order: Headline → Active title (h-11 fixed slot) → Shelf → Baseline
    decoration → ControlBar → CTA.
  * The shelf container uses `position: relative` with exact `height: CARD_H + 32px`.
  * Every BookCard uses `bottom: 0` anchor so all cards share the same baseline.
  * The CTA button must live OUTSIDE the onMouseEnter pause zone div.
  * Active card: zIndex 30, yLift -24px. Never let side cards exceed zIndex 20.

    ### [LEARN: getImageUrl Must Be Defined Before First Use]
  * `getImageUrl` is a `const` — it is NOT hoisted.
  * It must always be defined at the TOP of the file, before any component
    that calls it (e.g. BookCard).
  * Symptom of violation: images render as blank even though cover_url
    has a value in the DB.
  * Rule: always add getImageUrl as the FIRST non-import declaration in
    any file that renders book cover images.

        ### [LEARN: TaxtlarTeaser replaces EpicSpotlight]
    * EpicSpotlight.tsx (the hotspot map) has been removed from Index.tsx.
    * It is replaced by TaxtlarTeaser.tsx — Game of Thrones series block.
    * TaxtlarTeaser uses useData() articles + books — no new DB tables.
    * Article lookup: finds first published article with "taxtlar"/"game"/"thrones"
      in title, falls back to first published article.
    * Routes: CTA → /spotlight, quiz pill → /taxtlar-quiz, books → /library.
    * Do NOT re-add EpicSpotlight to Index.tsx.

    ### [LEARN: TaxtlarTeaser i18n + Theme Pattern]
* Translations live in a local TRANSLATIONS const — not in LanguageContext.
* Resolve with: const tx = TRANSLATIONS[(lang as TxLang)] ?? TRANSLATIONS.uz
* Light/dark theme switching uses TWO sibling divs with block dark:hidden
  and hidden dark:block — never a single inline style.
* Background: bg-amber-50/60 dark:bg-[#0a0806] on the section element.
* Pills: bg-white/80 dark:bg-white/[0.03] so they are visible in both modes.
* Never hardcode rgba color strings for backgrounds that must theme-switch.

### [LEARN: Theme is controlled in Navbar.tsx]
* There is no separate ThemeProvider. Theme state lives in Navbar.tsx.
* Default theme is set by: localStorage.getItem("zabarjad-theme") || "light"
* useEffect adds "dark" class to <html> for dark mode, "light" for light mode.
* Tailwind darkMode: ["class"] — dark: utilities activate when <html> has "dark".
* chart.tsx is NOT the theme provider — it is a Recharts wrapper only.


### [LEARN: No rgba in JSX style props for themed components]
* Never use style={{ background: "rgba(...)" }} for any color that must
  theme-switch between light and dark.
* Exception: backgroundImage texture patterns (repeating-linear-gradient
  for decorative mesh) may stay as inline style — they contain no solid
  background color, only transparent geometry.
* All themed colors must use Tailwind classes with dark: modifier.
* Vignette gradients must be expressed as Tailwind bg-[radial-gradient(...)]
  utility classes, not inline styles.

    ### [LEARN: MatchmakerQuiz is standalone — no quizConfig from DB]
  * MatchmakerQuiz.tsx does NOT use quizConfig from DataContext.
  * All questions, options, images and logic are hardcoded in WISE_AUNT_QUESTIONS.
  * Only `books` is consumed from useData() — for result matching only.
  * Recommendation: getTopGenre(answers) → counts genre tags → finds matching book.
  * Never re-introduce quizConfig or database-driven steps to this component.
  * Asset map: tea→teaImg, book→bookImg, compass→compassImg, key→keyImg.

    ### [LEARN: Taassurotlar component]
  * Taassurotlar.tsx is a standalone testimonials section — no DB dependency.
  * Reviews are hardcoded in REVIEWS array with rotate + offsetY per card.
  * Wax seal: absolute -top-4 -right-4 w-14 h-14 on every card.
  * Pen asset used twice: large background decoration + small title flanker.
  * Card hover straightens rotation to 0deg — "picking up the letter" effect.
  * useReducedMotion disables all rotation and lift transforms.
  * Add to Index.tsx between CuratedLibrary and Blog.

  ### [LEARN: TaxtlarTeaser uses swordImg asset — not Swords lucide icon]
* The ⚔ watermark is an <img src={swordImg}> — h-[120%] absolutely centered,
  opacity-5 dark:opacity-[0.08]. Never replace with a unicode character or
  Lucide icon.
* The title divider is <img src={swordImg}> rotate-90 h-6 — not <Swords />.
* The quiz pill icon is also swordImg inline — not <Swords />.
* swordImg is imported from "@/assets/design/sword.png".

### [LEARN: Import alone does not render a component]
* Taassurotlar was imported at the top of Index.tsx but never placed
  in the JSX render list — so it was invisible despite the import
  and skeleton both being correct.
* When adding a component to Index.tsx there are THREE required locations:
  1. import statement at the top
  2. <ComponentName /> inside the loading-false branch JSX
  3. Skeleton entry inside <PageSkeleton />
* All three must be present. Missing any one of them causes silent failure.

### [LEARN: Taassurotlar is a horizontal carousel]
* Layout: flex overflow-x-auto snap-x snap-mandatory.
* Scrollbar hidden via: scrollbarWidth:"none" + msOverflowStyle:"none"
  inline styles + scoped <style> for ::-webkit-scrollbar { display:none }.
* Cards: min-w-[300px] md:min-w-[360px] shrink-0 snap-center.
* Rotation alternates by index: index % 2 === 0 ? 1.8 : -1.8 deg.
* Wax seal and paper card styling are unchanged from original design.
* Always add a trailing spacer div (w-6 sm:w-10) at end of scroll row.

### [LEARN: Taassurotlar auto-play + pause architecture]
* scrollRight() checks atEnd → loops to 0 via scrollTo({left:0}).
* SCROLL_STEP = 432 (400px card + 32px gap).
* Auto-play: setInterval(scrollRight, 4000) cleared on unmount.
* Pause: isPaused state, set true on manual nav, cleared after 8000ms.
* useReducedMotion() disables both auto-play AND card rotations.
* pauseTimer ref must be cleared on unmount to prevent memory leak.
* WebKit scrollbar: scoped <style> tag + scrollbarWidth:"none" inline.

### [LEARN: Reviews moderation system]
* Table: `reviews` in Supabase with status: pending|published|rejected.
* RLS: anon can INSERT (pending only). Public SELECT only sees published.
* FeedbackForm.tsx: standalone form, inserts status:"pending" via submitReview().
* AdminReviews page: /admin/reviews — approve/reject pending reviews.
* Taassurotlar merges DB published reviews with SEED_REVIEWS as fallback.
* If dbReviews.length >= 4, seeds are hidden entirely.
* DataContext must expose: reviews[], submitReview() — paste DataContext
  for the surgical patch.
* Auto-play pauses when showForm is true.

### [LEARN: Reviews + FeedbackForm system]
* DataContext exposes: reviews[] (published only), submitReview(payload).
* fetchReviews() filters status="published" — pending rows never reach frontend.
* FeedbackForm has two modes: "general" and "book".
* Book mode: category dropdown first → filtered book dropdown second.
* Category values must match DB exactly: "new" | "soon" | "gold".
* submitReview inserts with status:"pending" — never published automatically.
* AdminReviews at /admin/reviews — approve sets status="published".
* Taassurotlar merges DB reviews with SEED_REVIEWS if dbReviews.length < 4.

### [LEARN: Admin sub-pages must NOT have standalone wrappers]
* Any page rendered inside AdminLayout via <Outlet /> must NOT have its
  own min-h-screen, header div, or page-level wrapper.
* It should only contain a <div className="space-y-6"> root.
* AdminReviews previously used createClient() directly — always use
  import { supabase } from "@/integrations/supabase/client" so the
  authenticated session is shared correctly.
* Supabase query chaining with conditional .eq() must use a let variable:
  let query = supabase.from(...).select(...)
  if (filter !== "all") { query = query.eq("status", filter) }

    ### [LEARN: StatsRow overlap pattern]
  * StatsRow uses absolute bottom-0 translate-y-1/2 to overlap section boundary.
  * The parent section needs pb-24 (not pb-16) so content above clears the cards.
  * The NEXT section (TaxtlarTeaser) needs pt-16 added to clear the
    overlapping cards visually — add pt-16 to TaxtlarTeaser's section element.

### [LEARN: Blog.tsx tabbed interface]
* Two tabs: "yangiliklar" (news) and "yangi-nashrlar" (new releases).
* Active tab background uses motion.span layoutId="tab-pill-bg" for
  smooth spring slide — NOT border-bottom or opacity tricks.
* Tab content switches via AnimatePresence mode="wait" + key={activeTab}.
* "See all" link only shows on yangiliklar tab.
* yangi-nashrlar currently uses reversed published articles as a
  placeholder — replace with a real category filter when DB supports it.

### [LEARN: StatsRow overlap architecture]
* StatsRow sits OUTSIDE the content column div, as last child of <section>.
* Section needs pb-28, content column needs pb-32 — both are required.
* StatsRow: absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20.
* Cards: bg-white dark:bg-neutral-900 — NOT backdrop-blur glassmorphism.
* Numbers: text-amber-600 dark:text-amber-500, font-serif, text-4xl md:text-5xl.
* Always flex-row gap-4 px-6 — never stack on mobile.
* TaxtlarTeaser needs pt-16 to clear the overlapping cards.

### [LEARN: Bookplate stat card design system]
* Cards use warm paper: bg-[#fdfbf7] dark:bg-[#1a1a1a] — NOT bg-white.
* Corners: rounded-sm — NOT rounded-2xl. Classic bookplate = sharp corners.
* Double border: border border-amber-300 + outline outline-1 outline-offset-4.
* Number: bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700
  bg-clip-text text-transparent — NOT a flat text color.
* Divider: w-10 h-px bg-amber-400/50 mx-auto my-3 between number and label.
* Label: font-serif uppercase tracking-[0.25em] text-amber-900/70.
* Shelf top margin must be mt-16 to prevent overlap with title text.
* Section pb-40, content column pb-36.

### [LEARN: Hero z-index stacking for 3D shelf]
* Headline wrapper must have relative z-20 — stays above shelf cards.
* Active book caption wrapper must have relative z-20.
* Shelf container must have relative with NO explicit z-index — this
  creates an isolated stacking context so cards inside (z-10 to z-30)
  never escape to block headline text.
* Never add z-40+ to cards — it breaks the stacking isolation.

### [LEARN: Hero.tsx caption position — DO NOT move below shelf]
* Active book caption (title + author) must stay BETWEEN headline and shelf.
* Order: Headline → Caption (mt-6) → Shelf (mt-36) → Baseline → Controls.
* Do NOT move caption below shelf — user tested and rejected this layout.
* Caption wrapper: relative z-20 h-11 mt-6 flex flex-col items-center.
* Shelf wrapper: relative w-full mt-36 with height: SHELF_H.

### [LEARN: Blog.tsx 3-tab premium editorial design]
* Three tabs: yangiliklar, nashrlar, maqolalar.
* Premium pill: bg-neutral-100/80 dark:bg-neutral-800/50 backdrop-blur-sm p-1.5.
* Active text: text-amber-700 dark:text-amber-400 (NOT text-foreground).
* Inactive text: text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300.
* layoutId must be "activeBlogTab" for the sliding background pill.
* Editorial empty state: border-dashed, <Feather /> icon, no emojis.
* Empty state text: "Hozircha ushbu ruknda maqolalar yo'q" (italic serif).
* maqolalar is intentionally an empty array to test the empty state.

### [LEARN: Navbar Mega Menu Architecture]
* Mega menu triggers on hover (onMouseEnter/onMouseLeave) on desktop only.
* Positioned with: absolute left-1/2 -translate-x-1/2 top-full pt-4.
* w-screen max-w-4xl makes it wide but centered under the trigger link.
* AnimatePresence wraps the mega menu for smooth enter/exit animations.
* Each category card links to /library?category={id} for future filtering.
* Mobile menu does NOT show the mega menu — it stays as a simple link.
* ChevronDown icon indicates the expandable menu visually.
* Glass card styling: glass-card border border-border/50 shadow-2xl rounded-2xl p-8.
* MEGA_MENU_CATEGORIES is a local const array — update it to add/remove categories.

### [LEARN: Navbar Mega Menu Positioning Fix]
* Mega menu must use: absolute top-full left-1/2 -translate-x-1/2 mt-6 z-50.
* Width must be fixed: w-[850px] max-w-[90vw] — NEVER w-screen (causes overflow).
* Always add invisible hover bridge: absolute top-full left-0 w-full h-6 bg-transparent
  between the trigger link and the mega menu panel to prevent premature closing.
* Glass effect must be explicit: bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md
  — do NOT use generic glass-card utility for mega menus.
* Border accent: border-amber-500/10 for subtle gold touch.
* z-50 is required to overlay all page content correctly.

### [LEARN: Mega Menu Full-Width Banner Pattern]
* Wide mega menus (>600px) MUST use the Full-Width Banner pattern.
* Architecture:
  - Outer wrapper: fixed left-0 w-full top-[72px] z-[100]
  - top-[72px] matches navbar height (adjust if navbar height changes)
  - Background/border on outer wrapper: bg-white/95 dark:bg-[#0a0806]/95
    backdrop-blur-xl border-b border-neutral-200 dark:border-white/10
  - Inner centering container: max-w-7xl mx-auto px-6 sm:px-12 py-10
  - Grid inside inner container: grid grid-cols-3 gap-8
* NO hover bridge needed — banner sits flush with navbar bottom edge.
* NO rounded corners — it's a full-width banner, not a card.
* Animation: y: -20 → 0 → -20 for dramatic slide down effect.
* DO NOT use absolute positioning — it anchors to parent <li>.
* DO NOT use left-1/2 -translate-x-1/2 centering — use left-0 w-full.

### [LEARN: Ornate editorial divider pattern]
* Thicker lines for premium feel: h-[2px] instead of h-px.
* Three-stop gradients for richer color: from-transparent via-{color}/50 to-{color}.
* Dark mode gradients use lighter mid-point: dark:via-amber-400/50.
* Rounded line caps: always add rounded-full to gradient lines.
* Ornament clusters use flexbox: flex items-center gap-3 with multiple elements.
* Star ornaments (✦) use smaller size + opacity-70 for supporting role.
* Central ornament (❦) uses larger size (text-4xl) as focal point.
* Add drop-shadow-sm to ornament clusters for subtle depth.
* Footer spacing: pt-12 (not section-padding) to reduce excessive top gap.
* Divider container: pt-0 pb-12 to pull divider tight to section top.
* CTA headings in footer: use vivid amber (text-amber-950 dark:text-amber-50)
  instead of neutral text-foreground for maximum impact.

    ### [LEARN: GlobalEffects Dark Academia design system]
  * GlobalEffects.tsx renders two overlays: PaperTexture + CustomCursor.
  * PaperTexture:
    - Inline SVG data URI with feTurbulence filter for seamless noise.
    - Fixed overlay: fixed inset-0 pointer-events-none z-[9999].
    - Very low opacity: opacity-[0.03] dark:opacity-[0.05].
    - Never use <img> or external file — always inline SVG data URI.
  * CustomCursor:
    - Only renders on desktop (pointer: fine media query check).
    - Gold circle: w-6 h-6 border-amber-500/50 bg-amber-500/10.
    - Spring physics: stiffness:150, damping:15, mass:0.5 for trailing effect.
    - mixBlendMode: "difference" for dynamic color inversion.
    - Center offset: x: clientX - 12, y: clientY - 12 (half of 24px).
    - z-index: z-[10000] (always on top).
    - Respects useReducedMotion() — hides cursor if motion reduced.
  * Integration: Import in App.tsx inside <BrowserRouter>, before <Routes>.
  * Never mount inside individual pages — GlobalEffects is app-wide.

    ### [LEARN: GlobalEffects performance optimization]
  * Custom cursor was removed due to rendering overhead (mousemove listener
    triggered re-renders on every pixel movement).
  * GlobalEffects.tsx now contains ONLY the static PaperTexture overlay.
  * PaperTexture is a pure component with zero runtime JavaScript:
    - No React hooks (no useState, useEffect)
    - No event listeners
    - No Framer Motion imports
    - Single static div with inline SVG background
  * The component is aliased: const GlobalEffects = PaperTexture for clean export.
  * Never add interactive elements to GlobalEffects — it must remain static
    for optimal performance across the entire app.

### [LEARN: BookOfTheMonth Dark Academia section]
* Full-width dark gradient section to break up lighter homepage sections.
* Background: bg-gradient-to-br from-[#0a0806] to-[#1a1510].
* Padding: py-24 sm:py-32 for dramatic vertical space.
* 2-column grid: Text left (badge + quote + author + CTA), book right.
* Pull quote must use <blockquote> semantic tag, NOT <p>.
* Quote styling: text-4xl md:text-6xl font-serif italic text-white/90.
* CTA button: border-2 border-amber-500/50 with hover:bg-amber-500/10.
* Floating animation: motion.div with animate={{ y: [-10, 10, -10] }}
  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}.
* Book placeholder: aspect-[2/3] to maintain book proportions.
* Integration: Place in Index.tsx immediately after <Hero />.
* Border: border-y border-white/5 for subtle section separation.

### [LEARN: BookOfTheMonth adaptive theming + 3D cover]
* Section background must adapt to theme:
  - Light: bg-[#fdfbf7]/50 (warm paper)
  - Dark: dark:bg-gradient-to-br dark:from-[#0a0806] dark:to-[#1a1510]
* All text must have light/dark variants:
  - Quote: text-neutral-900 dark:text-white/90
  - Author/Title: text-amber-900/80 dark:text-amber-200/60
  - CTA button: text-amber-900 dark:text-amber-100
* Border: border-neutral-200 dark:border-white/5
* Dynamic data from useData(): const spotlightBook = books.find(b => b.featured) || books[0]
* 3D book cover architecture:
  - Wrapper div with style={{ perspective: "1000px" }}
  - <img> with inline style={{ transform: "rotateY(-15deg) rotateX(5deg)" }}
  - Spine: border-l-4 border-black/20
  - Shadow: shadow-[20px_20px_30px_rgba(0,0,0,0.5)] dark:shadow-[20px_20px_40px_rgba(0,0,0,0.8)]
* Fallback placeholder if coverUrl is null (empty div with bg-amber-900/20).
* getImageUrl helper must handle both http(s) URLs and Supabase storage paths.

### [LEARN: BookOfTheMonth mobile + desktop layout polish]
* Mobile optimization requires text-center lg:text-left on column wrappers.
* All interactive elements (badges, buttons, books) need mx-auto lg:mx-0
  for centered mobile → left-aligned desktop flow.
* Quote sizing must be progressive: text-3xl sm:text-4xl lg:text-5xl
  (NOT text-4xl md:text-6xl — too large on mobile).
* Desktop gap reduction: max-w-5xl container + gap-8 grid (NOT max-w-7xl + gap-16).
* Premium badge pattern:
  - inline-flex items-center gap-2 px-4 py-1.5 rounded-full
  - border border-amber-500/30 bg-amber-500/10
  - Icon (<span>✦</span>) before text
* Decorative connector line between columns:
  - absolute left-[55%] top-[45%] w-32 -translate-y-1/2
  - Dashed line: border-t border-dashed border-amber-600 dark:border-amber-400
  - Arrow tip: w-2 h-2 rotate-45 border-t border-r (diamond rotated 45deg)
  - Desktop only: hidden lg:block opacity-40

  ### [LEARN: About.tsx immersive page architecture]
* Full-page fade-in: motion.div with initial={{ opacity: 0 }} animate={{ opacity: 1 }}.
* Background: bg-[#fdfbf7] dark:bg-[#1a1a1a] — warm paper light, deep dark.
* Hero structure: Badge → Headline → Mission paragraph (all centered, max-w-4xl).
* Timeline pattern: 4 alternating steps (Text/Image → Image/Text → repeat).
* Alternating order via: isEven ? "order-1" : "order-1 lg:order-2" on text column.
* Step animations: whileInView with viewport={{ once: true, margin: "-100px" }}
  triggers when step enters viewport with 100px preload margin.
* Each step delays by index * 0.1 for staggered entrance.
* Image placeholders: Use soft amber backgrounds + decorative emoji icons.
* Step title styling: text-3xl font-serif text-amber-900 dark:text-amber-200.
* Routing: Use Uzbek path /biz-haqimizda (NOT /about) for brand alignment.
* Always include <Navbar /> and <Footer /> in full-page layouts.

### [LEARN: Page transitions architecture]
* PageTransition.tsx is a simple wrapper — motion.div with enter/exit animations.
* Animation pattern: initial/animate/exit with x:20→0→-20 + blur:4px→0→4px.
* Duration must be 0.4s (NOT 0.6s or longer — feels sluggish).
* AnimatedRoutes.tsx wraps <Routes> with <AnimatePresence mode="wait">.
* mode="wait" is critical — ensures old page exits before new enters.
* key={location.pathname} on <Routes> triggers animations on route change.
* Admin routes must be in separate <Routes> block WITHOUT PageTransition
  — CMS users need instant navigation, not editorial delays.
* Every public route element must be wrapped: <PageTransition><Page /></PageTransition>.
* Do NOT wrap the <Route> itself — only the element prop contents.

### [LEARN: TaxtlarTeaser AI texture + molten metal typography]
* Background image pattern:
  - <img> with object-cover opacity-30 mix-blend-overlay contrast-125
  - Wrapped in absolute inset-0 pointer-events-none container
  - Followed by vignette gradient: bg-gradient-to-t from-[#0a0806] via-transparent to-[#0a0806]
* Molten metal text effect (3-color gradient):
  - bg-gradient-to-b from-[#fff7ad] via-[#ffc107] to-[#b91c1c]
  - bg-clip-text text-transparent (applies gradient to text)
  - drop-shadow-[0_2px_10px_rgba(255,160,0,0.6)] (outer glow)
  - [text-shadow:0_1px_0_#3f1a0a] (inner depth shadow — Tailwind arbitrary value)
* mix-blend-overlay makes white PNG backgrounds transparent, keeps texture visible.
* contrast-125 enhances texture detail without oversaturating.
* Always keep watermark/decorative elements ABOVE the background image layer.

### [LEARN: TaxtlarTeaser Cinematic Dark Mode island]
* This section MUST ignore global theme — it's always dark (#0a0806).
* Z-index fix: Section must be z-10 (NOT z-20+) to avoid blocking z-50 Navbar.
* Background image must have -z-10 to sit behind content without blocking.
* Blur effect requires scale-110 to cover edge artifacts.
* mix-blend-luminosity shows texture better than mix-blend-overlay.
* Vignette must use via-[#0a0806]/40 (NOT via-transparent) for stronger fade.
* Obsidian cards pattern:
  - bg-white/5 border-white/10 backdrop-blur-md
  - hover:bg-white/10 hover:border-amber-500/50
  - Text: text-amber-50 (titles), text-neutral-400 (subtitles)
* Remove ALL dark: prefixes when locking a section to dark mode.
* CTA button in dark mode: bg-amber-500/10 border-amber-500/30 text-amber-100.
* Never add border-y to cinematic dark sections — breaks immersion.

### [LEARN: TaxtlarTeaser readability optimization]
* Background images in dark sections must be crushed to 15% opacity (NOT 40%+).
* Always add heavy dark wash layer: bg-[#0a0806]/70 between image and vignette.
* Custom fonts (font-got) replace font-serif in themed sections.
* Quotes in dark sections: text-amber-50/90 (NOT text-neutral-300/400).
* Semantic HTML: Use <blockquote> for quotes, NOT multiple <p> tags.
* Quote visual indicators: border-l-2 border-amber-600 pl-4.
* Title drop shadows in dark mode: 0.4 opacity (NOT 0.6) for softer glow.
* Custom font sizing needs lg: breakpoint for smooth scaling.

### [LEARN: Custom fonts need extra line-height + padding]
* Custom display fonts (font-got) with tall ascenders/descenders MUST have:
  - leading-[1.3] or higher (NOT leading-tight or leading-none)
  - py-2 or higher for vertical breathing room
* Without these, letters get clipped at top/bottom edges.
* Background images in dark sections: opacity-25 is the sweet spot
  (15% too subtle, 40%+ too distracting).
* Always use descriptive alt text for decorative textures (NOT empty "").
* Watermarks in cinematic sections often become visual noise — delete if
  they compete with content readability.

  ### [LEARN: TaxtlarTeaser background brightness + promo card]
* Background images in dark sections should use mix-blend-overlay (NOT luminosity)
  when you want to preserve color — luminosity removes all hue.
* Opacity sweet spot for dark sections: 35-40% (NOT 15-25% too dark, 50%+ too bright).
* Dark wash layers should be 40% opacity (NOT 70%) when background is already subdued.
* Promotional cards in pill lists must use motion.div with variants={pillItem}
  to maintain stagger animation consistency.
* Image cropping: object-top is perfect for posters with text at bottom you want to hide.
* Hover effects on promo cards: scale-105 with duration-700 for smooth, premium feel.
* Mobile badges: use hidden sm:block to hide non-essential elements on small screens.
* Always add onClick handlers to promo cards — they must be interactive.

### [LEARN: Image framing with custom object positioning]
* object-top crops images from the top edge — can cut off important content.
* Use object-[center_X%] for precise vertical positioning:
  - object-[center_35%] = horizontally centered, 35% from top
  - object-[center_50%] = perfectly centered (same as object-center)
  - Syntax: object-[horizontal_vertical] where vertical is percentage from top
* When increasing card height, always verify gradient overlay strength.
* Text readability over colorful images: via-[color]/60 minimum for mid-gradient.
* Responsive card heights should use md: breakpoint: h-64 md:h-72 pattern.

### [LEARN: TaxtlarTeaser final polish patterns]
* Custom fonts need precise tracking: tracking-[0.1em] (NOT tracking-widest).
* Line height for tall fonts: leading-[1.4] minimum (NOT 1.3 or less).
* Series-specific book counts: Filter by series field with flexible matching
  (check for multiple keywords: "taxtlar", "game", "thrones").
* Pill components must support BOTH Lucide icons AND image paths:
  - Type: icon: React.ElementType | string
  - Render: typeof icon === "string" ? <img> : <Icon />
* Custom icon images: w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(217,119,6,0.3)]
* Epic CTA buttons in dark sections:
  - bg-gradient-to-r from-[#1a1510] to-[#0a0806]
  - border-amber-700/50, text-amber-500
  - font-serif tracking-widest uppercase
  - shadow-[0_0_15px...] + hover:shadow-[0_0_25px...]
  - rounded-sm (NOT rounded-xl — sharp medieval edges)
* All GoT routes should include ?series=got query parameter for filtering.

### [LEARN: TaxtlarTeaser horizontal control bar layout]
* Info cards must be at bottom in horizontal row (NOT vertical in right column).
* Layout: 2-column grid (text + banner) → horizontal 3-card row below.
* Card styling for readability over dark backgrounds:
  - Titles: font-bold text-amber-500 tracking-wide drop-shadow-sm
  - Subtitles: text-neutral-200/90 font-medium (NOT text-neutral-400 — too weak)
  - Glass effect: bg-black/40 (NOT bg-white/5 — too transparent)
* Icon sizes: w-12 h-12 in h-16 w-16 containers (NOT w-16 in h-20 — too large).
* Navbar special links (e.g., /spotlight): Use text-sm (same size) + custom font + special color.
  - text-amber-600 dark:text-amber-500 (NOT text-amber-500 always — needs light mode variant).
* Title max-width: max-w-xl for cinematic tight stacking.

### [LEARN: TaxtlarTeaser unified command center layout]
* Bottom toolbar pattern: Cards + button in SINGLE flex row with items-stretch.
* Tight vertical spacing: Section py-12 md:py-16, grid mb-6 (NOT mb-12).
* Banner height: Use fixed h-80 for "legendary" feel (NOT responsive h-64 md:h-72).
* Card compactness: gap-2 p-3 (NOT gap-3 p-4), icon container h-14 w-14 (NOT h-16 w-16).
* Icon glow must be strong: drop-shadow-[0_0_15px_rgba(251,191,36,0.4)] (NOT weak 8px glow).
* Card subtitle color: text-white/80 (NOT text-neutral-200/90 — too weak).
* Button in toolbar: w-full sm:w-auto h-full justify-center for stretch alignment.
* Footnote below toolbar: mt-4 (NOT mt-6 — keep tight).

### [LEARN: SpotlightPage cinematic archive with related content]
* SpotlightPage uses locked dark background (bg-[#0a0806]) — ignores theme.
* Hero section: Title (font-got gradient) → Books image (with glow) → Lore text → Buttons.
* Related sections use dark glass cards: bg-black/40 border-white/10 backdrop-blur-md.
* Text colors in dark sections: text-amber-50 (headings), text-neutral-400 (body).
* Links in dark sections: text-amber-500 hover:text-amber-400.
* Keep related books/articles unless explicitly told to remove them.
* Related books filter by b.featured, related articles filter by a.published.

### [LEARN: SpotlightPage cinematic image crop pattern]
* Fixed-height container with overflow-hidden crops images predictably.
* Image must be taller than container: h-[130%] allows cropping bottom 30%.
* Positioning: object-[center_15%] shows top 15% of image (hides bottom text).
* Dual gradient overlays blend sharp edges into page background:
  - bg-gradient-to-t from-[#0a0806] via-transparent to-[#0a0806]/50
  - bg-gradient-to-r from-[#0a0806] via-transparent to-[#0a0806]
* Title must have leading-tight whitespace-nowrap for desktop one-line display.
* Section top padding should be minimal (pt-8 md:pt-12) so title doesn't sit too high.
* Kolleksiya filter must check series field AND title fields (multi-language).
* Related content cards must use dark glass (bg-black/40 or bg-white/5) in dark sections.
* Always add section subtitles with text-neutral-400 for context.

### [LEARN: Custom font vertical clipping fix]
* Custom display fonts (font-got) with tall ascenders/descenders need:
  - leading-[1.4] or higher (NOT leading-tight — causes clipping)
  - py-4 or higher for vertical breathing room
* Never use whitespace-nowrap on titles with custom fonts — breaks mobile responsiveness.
* Title sizing should be progressive: text-4xl md:text-5xl lg:text-6xl (NOT jumping to text-7xl).

### [LEARN: Placeholder UI for empty sections]
* Always show placeholder content when dynamic data might be empty.
* Placeholder cards should use same styling as real cards (bg-white/5 border-white/10).
* Use emoji icons with grayscale + opacity-50, animate to full color on hover.
* Section headers with dividers: flex items-center gap-4 + h-px flex-grow pattern.

### [LEARN: LibraryPage premium filter pills pattern]
* Filter pills should be centered: flex items-center justify-center gap-3.
* Pill shape: rounded-full (NOT rounded-lg — too boxy).
* Touch targets: px-6 py-2.5 (NOT px-4 py-2 — too small).
* Active state must have transform scale-105 for visual feedback.
* Special category styling (e.g., GoT): bg-amber-500 text-black font-got tracking-wider.
* Regular active state: bg-foreground text-background (NOT bg-primary).
* Inactive state: bg-muted/50 with border-transparent + hover states.
* "All" category must show ALL books (active === "all" returns true immediately).
* Special categories (GoT) need custom filter logic checking series/title fields.
* Category labels should use helper function for multilingual support (NOT translation context).
* Header must be centered: text-center wrapper around badge + title.
* Badge: text-sm tracking-[0.2em] text-amber-500 (NOT text-primary).
* Title: font-serif without font-bold (serifs are already heavy).

### [LEARN: LibraryPage premium book cards with physical proportions]
* Book cards MUST use aspect-[2/3] (portrait) — NOT dynamic heights or landscape crops.
* Card hover must lift: hover:-translate-y-2 + shadow-2xl + shadow-primary/10.
* Image hover scale should be slow and dramatic: scale-110 duration-700 (NOT scale-105 duration-300).
* 3D depth effect: ring-1 ring-inset ring-black/10 dark:ring-white/10 on image container.
* Hover gradient overlay: bg-gradient-to-t from-black/60 via-transparent (darkens bottom).
* Delete HSL bg_color overlays when using gradient overlays (conflicts).
* Card body must be flex flex-col flex-grow for mt-auto action links at bottom.
* Title: text-lg font-bold line-clamp-2 (NOT text-base font-semibold).
* Action link pattern: mt-auto + opacity-0 -translate-y-2 → group-hover:opacity-100 translate-y-0.
* Use standard grid (NOT masonry columns) for book cards — prevents cropping issues.
* Grid responsive pattern: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8.

### [LEARN: Featured Books Carousel with auto-rotation]
* Auto-rotation pattern: useEffect with setInterval(5000ms) + cleanup with clearInterval.
* Carousel index increment: setCurrentIndex((prev) => (prev + 1) % FEATURED_BOOKS.length).
* AnimatePresence mode="wait" ensures one animation completes before next starts.
* Drop-down book animation: initial y: -50, rotate: -5 → animate y: 0, rotate: 0.
* Text slide-in: initial x: 50 → animate x: 0, delay: 0.1 (staggers after book).
* Glowing aura: absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full scale-75.
* Pagination dots pattern: w-2 h-2 (inactive) → w-8 bg-amber-500 (active).
* Dots must be absolutely positioned: bottom-6 left-1/2 -translate-x-1/2.
* Mobile carousel layout: flex-col md:flex-row for stacking on small screens.
* Gradient background: from-amber-500/5 via-card/50 to-background creates depth.

### [LEARN: Hero Carousel layout order and premium styling]
* Featured Hero Carousel MUST be first element on LibraryPage (before header/filters).
* Layout order: Hero → Header+Filters → Book Grid (NOT Header → Filters → Hero).
* Hero background must be theme-aware: from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-[#0a0806].
* Hero needs strong shadow: shadow-2xl (NOT shadow-lg — too weak).
* Badge must pop: font-bold tracking-[0.2em] text-xs (NOT font-semibold tracking-widest text-sm).
* CTA button needs glow: shadow-[0_0_15px_rgba(var(--primary),0.3)] (CSS variable reference).
* Header+Filters must be wrapped together: <div className="mb-10 mt-16">.
* Featured books should showcase publishing house titles (NOT generic bestsellers).
* Use external image URLs for mock data (Unsplash) until real cover images ready.

### [LEARN: LibraryPage final premium polish patterns]
* Hero decorative elements must be pointer-events-none to avoid blocking interactions.
* Corner accents: border-t border-l (top-left) + border-b border-r (bottom-right) with rounded corners.
* Watermark must be z-0 (behind content) with very low opacity: opacity-[0.03] dark:opacity-5.
* PDF catalog button uses inline SVG icon (Download icon from lucide-react equivalent).
* Filter + button layout: flex flex-col md:flex-row justify-between gap-6.
* Minimalist card pattern: NO wrapper background/border/padding — cover IS the card.
* Card text spacing: gap-4 between cover and text, px-1 on text container.
* Glass overlay on hover: bg-black/40 backdrop-blur-[2px] with centered badge.
* "Batafsil" badge: px-5 py-2.5 bg-amber-500 text-black uppercase tracking-widest rounded-full.
* Badge animation: scale-90 → group-hover:scale-100 for subtle pop.
* Remove action links at bottom of cards when using glass overlay badges.

### [LEARN: Featured Books carousel data best practices]
* Use semantic string IDs for featured books (e.g., "dorian", "zulayho") NOT numeric (1, 2, 3).
* Always use real book cover URLs from backend.book.uz or trusted sources (NOT placeholder images).
* Descriptions should be compelling and authentic (highlight unique aspects of each book).
* Book order in carousel matters — verify with user before finalizing.
* Cover image sources: backend.book.uz/user-api/img/ or upload.wikimedia.org for Uzbek editions.

### [LEARN: Museum placard typography for book cards]
* Text below book cards must be center-aligned: items-center text-center.
* Title sizing should be refined: text-base md:text-[17px] (NOT text-lg — too large).
* Leading must be snug (NOT tight) for better line height: leading-snug.
* Replace static borders with interactive expanding dividers for premium feel.
* Expanding divider pattern: w-8 → group-hover:w-16, bg-amber-500/40 → group-hover:bg-amber-500.
* Divider must have smooth animation: transition-all duration-500.
* Author labels need precise sizing: text-[11px] (NOT text-sm or text-[10px]).
* Author labels must be bold: font-semibold (NOT font-medium).
* Author tracking should be precise: tracking-[0.15em] (NOT tracking-wide).
* Never use top borders when expanding dividers are present — they conflict visually.

### [LEARN: BookFlipModal physical paper styling]
* Back buttons in modals should be fixed top-left with glass morphism: bg-background/50 backdrop-blur-md border border-border/50.
* Back button arrows need hover animation: group-hover:-translate-x-1 on arrow span.
* Physical book pages need asymmetric border radius: rounded-r-3xl rounded-l-md (NOT rounded-lg).
* Paper texture colors: bg-[#FDFBF7] (warm cream) in light mode, bg-[#1A1814] (dark brown) in dark mode.
* Book spine must be thick left border: border-l-[12px] border-[#3b2f2f] dark:border-[#0a0806].
* Page crease shadow: absolute left-0 w-12 bg-gradient-to-r from-black/10 to-transparent.
* Drop cap styling: first-letter:text-5xl first-letter:font-bold first-letter:text-amber-600 first-letter:mr-2 first-letter:float-left.
* Reading text must be justified: text-justify (NOT text-left — books use justified text).
* Navigation buttons need rounded-full + hover background for premium feel.
* All text inside book pages should use amber color scheme for cohesive theme.

### [LEARN: BookDetails page with Supabase integration]
* BookDetails uses useQuery from @tanstack/react-query for Supabase fetching.
* Query key pattern: ["book", id] for proper caching per book.
* Book type should be imported from @/context/DataContext (NOT redefined).
* Dynamic shadows use HSL color from bg_color column: hsl(${book.bg_color} / 0.4).
* Loading states must show spinner + Navbar/Footer for consistent layout.
* Error states must provide clear CTA to return to library.
* BookFlipModal must accept id in book prop for navigation to work.
* "Full Details" button should close modal THEN navigate (onClose before navigate).
* Back button uses navigate(-1) for browser history navigation (NOT hardcoded /library).
* Book cover uses same physical hardcover styling: rounded-r-3xl rounded-l-sm border-l-8.

### [LEARN: BookFlipModal z-index layering for visibility]
* Modal background must be z-[90] (NOT z-[100] — conflicts with buttons).
* Back button must be z-[101] (highest in modal, above background).
* Close button (X) must also be z-[101] for consistency.
* Button position must be top-24 (NOT top-6) to sit below fixed navbar at top-0.
* Buttons should be direct children of modal background motion.div (NOT nested deeper).
* Z-index layering order: Navbar (z-[100]) > Modal buttons (z-[101]) > Modal background (z-[90]).
* Button must come FIRST in JSX (before close button and content) for proper rendering.

### [LEARN: BookFlipModal viewport lock to prevent scrolling]
* Modal wrappers MUST have overflow-hidden to prevent infinite scroll.
* Explicit viewport constraints required: w-screen h-screen (NOT just inset-0).
* Buttons inside modals MUST use absolute positioning (NOT fixed — causes viewport anchoring).
* Content containers need max-width constraints: max-w-4xl (prevents horizontal overflow).
* Modal backgrounds need stronger blur for fullscreen modals: backdrop-blur-xl (NOT backdrop-blur-md).
* Z-index for modals should be z-[100] (NOT z-[90] — conflicts with navbar at z-[100]).
* Always use flex flex-col for vertical stacking in modals (allows justify-center).
* Top offset for buttons in modals: top-6 (NOT top-24 — no navbar in modal context).

### [LEARN: LibraryPage direct routing without modal]
* Book cards in LibraryPage must use <Link to={`/book/${book.id}`}> wrapper (NOT onClick with modal).
* Modal state (selectedBook) and BookFlipModal import must be completely removed.
* Move key prop from motion.div to Link wrapper when wrapping animated components.
* "Batafsil" badge should be a visual <span> (NOT <button>) — entire card is one clickable Link.
* AnimatePresence for modal at bottom of component must be deleted.
* Keep carousel state (currentIndex) and filter state (active) — only remove modal-related state.
* Direct routing provides better e-commerce UX: shareable URLs, browser history, SEO benefits.

### [LEARN: CuratedLibrary homepage preview refactoring]
* Homepage library previews must limit to exactly 3 books: .slice(0, 3) (NOT 6).
* Section headers on homepage should be centered: text-center wrapper.
* Category tabs must use premium pills: rounded-full, centered, scale-105 on active.
* Homepage cards must match LibraryPage design: 3D hardcover (rounded-l-sm rounded-r-xl).
* Modal behavior removed from homepage — all book cards use Link wrapper for direct routing.
* "View All" buttons should always be visible (NOT conditional based on book count).
* Grid must be standard (NOT masonry) for consistent card heights: grid-cols-2 md:grid-cols-3.
* Always add max-w-5xl mx-auto to grids for proper centering and width constraint.
* Route must be /book/:id (singular) — verify App.tsx matches all Link components.

### [LEARN: CuratedLibrary category sync and premium gold button]
* Homepage library preview must use same categories as LibraryPage: ["all", "new", "featured", "golden", "got"].
* Must use local getCategoryLabel() helper (NOT external constants) for category names.
* Filter logic must handle "all" (show all books) and "got" (series filter) specially.
* GoT category tab needs special styling when active: bg-amber-500 text-black font-got tracking-wider.
* Premium action buttons use gold gradient: from-amber-500 to-amber-600 with text-white.
* Gold buttons need glowing shadow: shadow-[0_10px_30px_rgba(245,158,11,0.3)] + hover variant.
* Gold button hover should lift up (hover:-translate-y-1) NOT scale.
* Arrow in buttons should be larger: text-lg leading-none (NOT default size).
* Default category should be "all" (show all books) NOT "new" for homepage preview.

### [LEARN: CuratedLibrary scaled-down grid + Valyrian Steel button]
* Homepage library preview must be compact: max-w-3xl md:max-w-4xl (NOT max-w-5xl).
* Individual book cards must be capped: max-w-[220px] mx-auto w-full on Link wrapper.
* Grid gap must be tight for compact view: gap-4 md:gap-8 (NOT gap-6 md:gap-10).
* Typography scales down: title text-sm md:text-base, author text-[9px] md:text-[10px].
* "Valyrian Steel" button pattern (from Hero):
  - Dark gradient: from-[#1a1510] to-[#0a0806] (NOT gold gradient)
  - Sharp corners: rounded-sm (NOT rounded-full)
  - Amber text on dark: text-amber-500 (NOT text-white)
  - Font-got typography: font-got tracking-[0.1em]
  - Subtle glow: shadow-[0_0_15px_rgba(217,119,6,0.1)]
  - Hover: bg-amber-900/20 + border-amber-400 + text-amber-400 (NOT lift effect)
* Homepage library preview goal: fit books + button in one screen view without scrolling.

### [LEARN: Hero-style button pattern for CuratedLibrary]
* "View All" buttons must match Hero section styling (NOT Valyrian Steel dark buttons).
* Hero button pattern:
  - Component: motion.button with onClick navigate (NOT Link component)
  - Shape: rounded-xl (NOT rounded-sm or rounded-full)
  - Border: border-primary/35 (light border, NOT dark gradient background)
  - Hover effect: Overlay fill pattern (absolute span bg-primary opacity-0 → opacity-100)
  - Text: text-foreground → group-hover:text-primary-foreground (theme-aware)
  - Font: font-sans font-semibold (NOT font-got or font-bold)
  - Icons: Library + ChevronRight lucide icons (NOT arrow span)
  - Animation: whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
  - ChevronRight slides right on hover: group-hover:translate-x-0.5
* Never use hardcoded colors (amber-500, etc.) in "View All" buttons — always use theme tokens.
* Book cards in CuratedLibrary can use motion.div with onClick (NOT Link wrapper) for simplicity.

### [LEARN: CuratedLibrary final visual polish patterns]
* Parchment texture must be very subtle: opacity-[0.03] dark:opacity-[0.05] (NOT higher).
* Texture blend modes: mix-blend-multiply (light mode) + mix-blend-screen (dark mode).
* Always pair texture with vignette gradient to fade edges into background.
* Section wrapper for textured sections needs: relative isolate overflow-hidden.
* Editorial subtitles should be: text-muted-foreground text-sm md:text-base max-w-2xl mx-auto font-medium.
* Floating badges position pattern: absolute top-4 right-0 translate-x-1 (sticks out from edge).
* Ribbon fold effect: Use border triangles (border-t-4 border-l-4 with transparent side).
* Badge text sizing: text-[9px] font-bold uppercase tracking-wider (small, impactful).
* When user says "DO NOT touch X", preserve that element exactly (no refactoring or "improvements").
### [LEARN] 
content-visibility: auto is incompatible with ;Framer Motion animations (whileHover, animate, layout, whileInView). Never apply [content-visibility:auto] to any element that has Framer Motion props — use bg-muted placeholder + aspect-ratio for CLS prevention instead.

supabase.auth.getSession() + onAuthStateChange together cause duplicate role fetches. onAuthStateChange fires INITIAL_SESSION on mount — getSession() is redundant. Always use only onAuthStateChange with a useRef userId guard.

### [LEARN] 

.setHeader() does NOT exist on the Supabase JS v2 query builder chain. Never use it. It throws a synchronous TypeError that can escape Promise.allSettled and prevent finally from running.

setLoading(false) in AuthContext MUST be inside a finally block wrapping the entire onAuthStateChange callback — not placed after an await call. Any await before it is a loading hang waiting to happen.

Always add a hard timeout safety net (5s) in AuthContext for the case where onAuthStateChange never fires due to Supabase initialization failure or network issues at startup.

### LEARN

AuthContext loading pattern — the only correct architecture:

initializeSession() owns setLoading(false) exclusively in a finally block
onAuthStateChange skips INITIAL_SESSION and never touches loading
No setTimeout safety net needed when finally is used correctly
No loadingResolvedRef needed when there is only one initialization path
For Vite HMR: only export the component and the hook — all helpers stay internal

