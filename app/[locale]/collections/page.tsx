import { hygraph, GET_COLLECTIONS } from '@/lib/hygraph'
import type { Collection } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'
import CollectionCard from '@/components/CollectionCard'

export default async function CollectionsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const { collections } = await hygraph.request<{ collections: Collection[] }>(GET_COLLECTIONS, { locale })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t[locale].allCollections}</h1>
        <p className="text-gray-500">{t[locale].browseByContinent}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <CollectionCard key={col.id} collection={col} locale={locale} />
        ))}
      </div>
    </div>
  )
}
