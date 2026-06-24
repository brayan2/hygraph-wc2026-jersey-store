export const dynamic = 'force-dynamic'

import { fetchData, GET_COLLECTIONS } from '@/lib/hygraph'
import type { Collection } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'
import CollectionCard from '@/components/CollectionCard'

export default async function CollectionsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const data = await fetchData<{ collections: Collection[] }>(GET_COLLECTIONS, { locale })
  const collections = data?.collections ?? []

  return (
    <div className="min-h-screen bg-background">

      {/* Page header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-2">
            Shop by Continent
          </p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-3">
            {t[locale].allCollections}
          </h1>
          <p className="text-zinc-600 text-sm">{t[locale].browseByContinent}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {collections.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-700 text-sm uppercase tracking-widest">No collections yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((col, i) => (
              <div
                key={col.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both', opacity: 0 }}
              >
                <CollectionCard collection={col} locale={locale} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
