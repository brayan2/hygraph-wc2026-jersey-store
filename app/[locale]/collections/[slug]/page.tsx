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
    <div>
      {/* Hero */}
      <div className="relative h-64 sm:h-80 bg-indigo-900 overflow-hidden">
        {collection.heroImageUrl && (
          <Image
            src={collection.heroImageUrl}
            alt={collection.name}
            fill
            className="object-cover opacity-40"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-8 max-w-7xl mx-auto">
          <Link href={`/${locale}/collections`} className="text-white/70 hover:text-white text-sm mb-3 inline-block transition-colors">
            {t[locale].backToCollection}
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
              {continentLabels[locale][collection.continent]}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{collection.name}</h1>
          <div className="flex gap-3 mt-2 text-white/70 text-sm">
            <span>{collection.teams.length} {t[locale].teamCount}</span>
            <span>·</span>
            <span>{collection.jerseys.length} {t[locale].jerseyCount}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Description */}
        {collection.description?.html && (
          <div
            className="prose prose-lg max-w-3xl mb-10 text-gray-600"
            dangerouslySetInnerHTML={{ __html: collection.description.html }}
          />
        )}

        {/* Teams in this collection */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">{t[locale].teams}</h2>
          <div className="flex flex-wrap gap-3">
            {collection.teams.map((team) => (
              <Link
                key={team.id}
                href={`/${locale}/teams/${team.slug}`}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-sm font-medium text-gray-700"
              >
                <span className="text-lg">{team.flagEmoji}</span>
                <span>{team.name}</span>
                <span className="text-xs text-gray-400">({team.confederation})</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Jerseys grid */}
        {collection.jerseys.length === 0 ? (
          <p className="text-gray-500 text-center py-16">{t[locale].noJerseys}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collection.jerseys.map((jersey) => (
              <JerseyCard key={jersey.id} jersey={jersey} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
