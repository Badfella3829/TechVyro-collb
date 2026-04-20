import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { PackageRecommender } from '@/components/recommender/package-recommender'
import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/footer/footer'

export const metadata = { title: 'Package Recommender' }

export default function RecommenderPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-mono mb-2 inline-flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> Smart Recommender
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Find the perfect package in <span className="gradient-text">60 seconds</span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-xl">
              Answer 4 quick questions and we&apos;ll suggest the best collaboration package for
              your goal, budget, and timeline — plus smart add-ons to maximise ROI.
            </p>
          </div>

          <PackageRecommender />
        </div>
      </section>

      <Footer />
    </main>
  )
}
