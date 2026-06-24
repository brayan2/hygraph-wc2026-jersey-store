export const dynamic = 'force-dynamic'

import { fetchData, GET_COLLECTION, GET_COLLECTIONS } from '@/lib/hygraph'
import type { Collection } from '@/lib/hygraph'
import { t, continentLabels, type Locale } from '@/lib/i18n'
import JerseyCard from '@/components/JerseyCard'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  try {
    const data = await fetchData<{ collections: Collection[] }>(GET_COLLECTIONS, { locale: 'en' })
    return data?.collections.map((c) => ({ slug: c.slug })) ?? []
  } catch {
    return []
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const data = await fetchData<{ collection: Collection | null }>(GET_COLLECTION, { slug, locale })
  const collection = data?.collection

  if (!collection) notFound()

  return (
    <div className="min-h-screen bg-background">

      {/* ─── CINEMATIC HERO ─────────────────────────────── */}
      <div className="relative h-[55vh] sm:h-[65vh] bg-[#050505] overflow-hidden">
        {collection.heroImageUrl && (
          <Image
            src={collection.heroImageUrl}
            alt={collection.name}
            fill
            className="object-cover opacity-50"
            sizes="100vw"
            priority
          />
        )}
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <Link
              href={`/${locale}/collections`}
              className="inline-flex items-center gap-2 text-zinc-600 hover:text-gold transition-colors text-[10px] font-bold uppercase tracking-widest mb-6"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              {t[locale].backToCollection}
            </Link>

            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-3">
              {continentLabels[locale][collection.continent]}
            </p>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-4">
              {collection.name}
            </h1>

            <div className="flex items-center gap-4 text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
              <span>{collection.teams.length} {t[locale].teamCount}</span>
              <span className="text-zinc-800">·</span>
              <span>{collection.jerseys.length} {t[locale].jerseyCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BODY ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Description */}
        {collection.description?.html && (
          <div
            className="prose-dark max-w-2xl mb-12 text-zinc-500 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: collection.description.html }}
          />
        )}

        {/* Teams */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-700 font-black mb-4">
            {t[locale].teams}
          </p>
          <div className="flex flex-wrap gap-2">
            {collection.teams.map((team) => (
              <Link
                key={team.id}
                href={`/${locale}/teams/${team.slug}`}
                className="inline-flex items-center gap-2 border border-[rgba(255,255,255,0.07)] hover:border-gold/30 hover:text-gold px-4 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider transition-all duration-200"
              >
                <span className="text-base">{team.flagEmoji}</span>
                <span>{team.name}</span>
                <span className="text-zinc-700 text-[10px]">{team.confederation}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="gold-line mb-12" />

        {/* Jerseys grid */}
        {collection.jerseys.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-700 text-sm uppercase tracking-widest">{t[locale].noJerseys}</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-700 font-black mb-6">
              {collection.jerseys.length} {t[locale].jerseyCount}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {collection.jerseys.map((jersey, i) => (
                <div
                  key={jersey.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both', opacity: 0 }}
                >
                  <JerseyCard jersey={jersey} locale={locale} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
