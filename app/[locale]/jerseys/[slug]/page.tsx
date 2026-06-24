export const dynamic = 'force-dynamic'

import { fetchData, GET_JERSEY, GET_JERSEYS } from '@/lib/hygraph'
import type { Jersey } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import JerseyProductView from '@/components/JerseyProductView'

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

  const related = jersey.relatedJerseys?.filter((r) => r.id !== jersey.id) ?? []

  return (
    <div className="min-h-screen bg-background">

      {/* Back nav */}
      <div className="border-b border-[rgba(255,255,255,0.05)] bg-[#0c0c0c] py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href={jersey.team ? `/${locale}/teams/${jersey.team.slug}` : `/${locale}/shop`}
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-gold transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {jersey.team ? t[locale].backToTeam : t[locale].backToShop}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <JerseyProductView jersey={jersey} locale={locale} />

        {/* ─── RELATED JERSEYS ──────────────────────── */}
        {related.length > 0 && (
          <div className="mt-24 border-t border-[rgba(255,255,255,0.06)] pt-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-3">{t[locale].youMayAlsoLike}</p>
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                {jersey.collection?.name}
              </h2>
              {jersey.collection && (
                <Link
                  href={`/${locale}/collections/${jersey.collection.slug}`}
                  className="text-[10px] text-zinc-600 hover:text-gold transition-colors font-black uppercase tracking-widest"
                >
                  {t[locale].viewAll} →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.slice(0, 4).map((rel, i) => (
                <Link key={rel.id} href={`/${locale}/jerseys/${rel.slug}`} className="group block">
                  <div
                    className="animate-fade-up"
                    style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both', opacity: 0 }}
                  >
                    <div className="relative aspect-square bg-[#0e0e0e] border border-[rgba(255,255,255,0.06)] overflow-hidden mb-3 group-hover:border-gold/20 transition-all duration-300">
                      {rel.imageUrl ? (
                        <Image
                          src={rel.imageUrl}
                          alt={rel.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-10">👕</div>
                      )}
                      <div className={`absolute top-2 left-2 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider ${
                        rel.kitType === 'HOME' ? 'bg-gold text-black' : 'bg-white/10 text-white border border-white/15'
                      }`}>
                        {rel.kitType === 'HOME' ? t[locale].homeKit : t[locale].awayKit}
                      </div>
                    </div>
                    {rel.team && (
                      <p className="text-[9px] uppercase tracking-widest text-zinc-600 mb-0.5">
                        {rel.team.flagEmoji} {rel.team.name}
                      </p>
                    )}
                    <p className="text-xs font-bold text-zinc-400 group-hover:text-gold transition-colors truncate mb-1">{rel.name}</p>
                    <p className="text-sm font-black text-gold">{rel.currency} {rel.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
