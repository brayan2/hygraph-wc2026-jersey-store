export const dynamic = 'force-dynamic'

import { fetchData, GET_JERSEY, GET_JERSEYS } from '@/lib/hygraph'
import type { Jersey } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  try {
    const data = await fetchData<{ jerseys: Jersey[] }>(GET_JERSEYS, { locale: 'en' })
    return data?.jerseys.map((j) => ({ slug: j.slug })) ?? []
  } catch {
    return []
  }
}

export default async function JerseyPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const data = await fetchData<{ jersey: Jersey | null }>(GET_JERSEY, { slug, locale })
  const jersey = data?.jersey ?? null

  if (!jersey) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={jersey.team ? `/${locale}/teams/${jersey.team.slug}` : `/${locale}/shop`}
        className="text-sm text-indigo-600 hover:underline mb-8 inline-block"
      >
        {jersey.team ? t[locale].backToTeam : t[locale].backToShop}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
          {jersey.imageUrl ? (
            <Image
              src={jersey.imageUrl}
              alt={jersey.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">👕</div>
          )}
          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow ${
            jersey.kitType === 'HOME' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-white'
          }`}>
            {jersey.kitType === 'HOME' ? t[locale].homeKit : t[locale].awayKit}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-start pt-2">
          {jersey.team && (
            <Link
              href={`/${locale}/teams/${jersey.team.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-500 hover:underline mb-3"
            >
              <span className="text-2xl">{jersey.team.flagEmoji}</span>
              <span>{jersey.team.name}</span>
            </Link>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">{jersey.name}</h1>

          <div className="text-3xl font-extrabold text-gray-900 mb-6">
            {jersey.currency} {jersey.price.toFixed(2)}
          </div>

          {/* Sizes */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">{t[locale].sizes}</p>
            <div className="flex flex-wrap gap-2">
              {jersey.sizes.map((size) => (
                <button
                  key={size}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          {jersey.description?.html && (
            <div
              className="text-gray-600 text-base mb-6 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: jersey.description.html }}
            />
          )}

          {/* Material */}
          {jersey.material && (
            <div className="flex items-start gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-semibold text-gray-600 shrink-0">{t[locale].material}:</span>
              <span className="text-sm text-gray-600">{jersey.material}</span>
            </div>
          )}

          <button className="mt-auto bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-700 active:bg-indigo-800 transition-colors text-lg w-full shadow-lg shadow-indigo-200">
            {t[locale].addToCart}
          </button>
        </div>
      </div>

      {/* Related Jerseys */}
      {jersey.relatedJerseys && jersey.relatedJerseys.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t[locale].relatedProducts}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {jersey.relatedJerseys.map((rel) => (
              <Link key={rel.id} href={`/${locale}/jerseys/${rel.slug}`} className="group block">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 shadow-sm group-hover:shadow-md transition-shadow">
                  {rel.imageUrl ? (
                    <Image src={rel.imageUrl} alt={rel.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="25vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">👕</div>
                  )}
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${rel.kitType === 'HOME' ? 'bg-indigo-600 text-white' : 'bg-gray-900 text-white'}`}>
                    {rel.kitType === 'HOME' ? t[locale].homeKit : t[locale].awayKit}
                  </div>
                </div>
                <div className="mt-2 px-1">
                  {rel.team && <p className="text-xs text-gray-400">{rel.team.flagEmoji} {rel.team.name}</p>}
                  <p className="text-sm font-semibold text-gray-800 truncate">{rel.name}</p>
                  <p className="text-sm font-bold text-gray-900">{rel.currency} {rel.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
