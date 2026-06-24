import Link from 'next/link'
import Image from 'next/image'
import { hygraph, GET_HOMEPAGE } from '@/lib/hygraph'
import type { Homepage } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'
import JerseyCard from '@/components/JerseyCard'
import CollectionCard from '@/components/CollectionCard'

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const { homepages } = await hygraph.request<{ homepages: Homepage[] }>(GET_HOMEPAGE, { locale })
  const page = homepages[0]

  if (!page) {
    return <div className="p-8 text-center text-gray-400">Homepage content not found.</div>
  }

  const hero = page.hero

  return (
    <div>
      {/* CMS-driven Hero */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white overflow-hidden min-h-[480px] flex items-center">
        {hero?.imageUrl && (
          <Image src={hero.imageUrl} alt="" fill className="object-cover opacity-20" sizes="100vw" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-purple-900/60" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center w-full">
          {hero?.badgeText && (
            <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              🏆 {hero.badgeText}
            </div>
          )}
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 tracking-tight">
            {hero?.headline || page.title}
          </h1>
          {hero?.subheading && (
            <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">{hero.subheading}</p>
          )}
          {hero?.ctaLabel && hero.ctaUrl && (
            <Link
              href={`/${locale}${hero.ctaUrl}`}
              className="inline-block bg-white text-indigo-900 font-bold px-10 py-4 rounded-full hover:bg-indigo-50 transition-colors text-lg shadow-xl"
            >
              {hero.ctaLabel}
            </Link>
          )}
        </div>
      </section>

      {/* Promotional Banners */}
      {page.promotionalBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {page.promotionalBanners.map((banner, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl p-6 flex items-center justify-between gap-4 text-white"
                style={{ backgroundColor: banner.backgroundColor || '#4F46E5' }}
              >
                {banner.imageUrl && (
                  <Image src={banner.imageUrl} alt="" fill className="object-cover opacity-20" sizes="50vw" />
                )}
                <div className="relative z-10">
                  <p className="font-bold text-lg leading-tight">{banner.headline}</p>
                  {banner.description && <p className="text-sm text-white/80 mt-1">{banner.description}</p>}
                </div>
                {banner.ctaLabel && banner.ctaUrl && (
                  <Link
                    href={`/${locale}${banner.ctaUrl}`}
                    className="relative z-10 shrink-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors whitespace-nowrap"
                  >
                    {banner.ctaLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Collections */}
      {page.featuredCollections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{t[locale].featuredCollections}</h2>
            <Link href={`/${locale}/collections`} className="text-sm font-medium text-indigo-600 hover:underline">
              {t[locale].viewAll} →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {page.featuredCollections.map((col) => (
              <CollectionCard key={col.id} collection={col} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Jerseys */}
      {page.featuredJerseys.length > 0 && (
        <section className="bg-gray-50 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{t[locale].featuredJerseys}</h2>
              <Link href={`/${locale}/shop`} className="text-sm font-medium text-indigo-600 hover:underline">
                {t[locale].viewAll} →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.featuredJerseys.map((jersey) => (
                <JerseyCard key={jersey.id} jersey={jersey} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
