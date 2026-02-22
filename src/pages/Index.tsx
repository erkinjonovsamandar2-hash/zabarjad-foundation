import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TaxtlarTeaser from "@/components/TaxtlarTeaser";
import MatchmakerQuiz from "@/components/MatchmakerQuiz";
import CuratedLibrary from "@/components/CuratedLibrary";
import Blog from "@/components/Blog";
import Taassurotlar from "@/components/Taassurotlar";
import Footer from "@/components/Footer";
import { useData } from "@/context/DataContext";
import BookOfTheMonth from "@/components/BookOfTheMonth";

const Index = () => {
  const { loading } = useData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {loading ? (
        <PageSkeleton />
      ) : (
        <>
          <Hero />
          <BookOfTheMonth />
          <TaxtlarTeaser />
          <MatchmakerQuiz />
          <CuratedLibrary />
          <Taassurotlar />
          <Blog />
        </>
      )}

      <Footer />
    </div>
  );
};

// ── Page-level loading skeleton ───────────────────────────────────────────────
const PageSkeleton = () => (
  <div className="animate-pulse">
    {/* Hero skeleton */}
    <section className="relative min-h-screen flex flex-col items-center justify-center section-padding pt-24">
      <div className="text-center max-w-4xl mx-auto w-full space-y-4">
        <div className="h-3 w-32 bg-primary/20 rounded-full mx-auto" />
        <div className="h-14 w-3/4 bg-foreground/10 rounded-xl mx-auto" />
        <div className="h-14 w-1/2 bg-foreground/10 rounded-xl mx-auto" />
        <div className="h-5 w-2/3 bg-muted/30 rounded-lg mx-auto" />
        <div className="h-11 w-40 bg-primary/20 rounded-lg mx-auto mt-4" />
      </div>
      <div className="mt-16 w-full max-w-5xl flex items-end justify-center gap-6 h-52">
        {[0.52, 0.76, 1, 0.76, 0.52].map((s, i) => (
          <div
            key={i}
            className="rounded-xl bg-neutral-800 shrink-0"
            style={{
              width:   `${Math.round(120 * s)}px`,
              height:  `${Math.round(120 * s * 1.5)}px`,
              opacity: 1 - Math.abs(i - 2) * 0.2,
            }}
          />
        ))}
      </div>
    </section>

    {/* TaxtlarTeaser skeleton */}
    <section className="section-padding" style={{ backgroundColor: "#0a0806" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="h-2.5 w-20 bg-primary/20 rounded-full" />
            <div className="h-16 w-3/4 bg-foreground/10 rounded-xl" />
            <div className="h-4 w-2/3 bg-muted/20 rounded-lg" />
            <div className="h-4 w-1/2 bg-muted/10 rounded-lg" />
            <div className="h-11 w-40 bg-primary/15 rounded-xl mt-4" />
          </div>
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-white/[0.03] border border-white/5" />
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* CuratedLibrary skeleton */}
    <section className="section-padding bg-charcoal">
      <div className="mx-auto max-w-7xl">
        <div className="h-3 w-24 bg-primary/20 rounded-full mb-4" />
        <div className="h-8 w-64 bg-foreground/10 rounded-lg mb-8" />
        <div className="flex gap-2 mb-10">
          {[80, 96, 112].map((w, i) => (
            <div key={i} className="h-9 rounded-lg bg-white/5" style={{ width: `${w}px` }} />
          ))}
        </div>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="break-inside-avoid rounded-xl bg-neutral-800"
              style={{ aspectRatio: "2/3" }}
            />
          ))}
        </div>
      </div>
    </section>

    {/* Blog skeleton */}
    <section className="section-padding bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="h-8 w-48 bg-foreground/10 rounded-lg mb-8" />
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl bg-white/5 overflow-hidden">
              <div className="aspect-video bg-white/5" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-foreground/10 rounded" />
                <div className="h-3 w-full bg-muted/20 rounded" />
                <div className="h-3 w-2/3 bg-muted/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Taassurotlar skeleton */}
    <section className="section-padding bg-stone-50 dark:bg-[#0f0f0f] border-y border-stone-200 dark:border-neutral-800/60">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16 space-y-3">
          <div className="h-2.5 w-28 bg-primary/20 rounded-full mx-auto" />
          <div className="h-8 w-48 bg-foreground/10 rounded-lg mx-auto" />
          <div className="h-4 w-64 bg-muted/20 rounded-lg mx-auto" />
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-72 h-64 rounded-lg bg-white/5 animate-pulse"
              style={{ transform: `rotate(${[-2, 1.5, -1][i]}deg)` }}
            />
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Index;