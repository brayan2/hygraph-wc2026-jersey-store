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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16">

          {/* ─── IMAGE PANEL ──────────────────────────────── */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative aspect-square bg-[#0e0e0e] border border-[rgba(255,255,255,0.06)] overflow-hidden">
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
                  <div className="w-full h-full flex items-center justify-center text-8xl opacity-10">👕</div>
                )}

                {/* Kit type */}
                <div className={`absolute top-4 left-4 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${
                  jersey.kitType === 'HOME'
                    ? 'bg-gold text-black'
                    : 'bg-white/10 backdrop-blur-sm text-white/80 border border-white/15'
                }`}>
                  {jersey.kitType === 'HOME' ? t[locale].homeKit : t[locale].awayKit}
                </div>
              </div>
            </div>
          </div>

          {/* ─── PURCHASE PANEL ───────────────────────────── */}
          <div className="pt-4 lg:pt-0">

            {/* Team */}
            {jersey.team && (
              <Link
                href={`/${locale}/teams/${jersey.team.slug}`}
                className="inline-flex items-center gap-2 text-zinc-600 hover:text-gold transition-colors mb-4 group"
              >
                <span className="text-2xl">{jersey.team.flagEmoji}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-black group-hover:text-gold transition-colors">
                  {jersey.team.name}
                </span>
              </Link>
            )}

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white leading-tight mb-2">
              {jersey.name}
            </h1>

            {/* Price */}
            <div className="text-3xl font-black text-gold mb-8">
              {jersey.currency} {jersey.price.toFixed(2)}
            </div>

            {/* Divider */}
            <div className="border-t border-[rgba(255,255,255,0.06)] mb-8" />

            {/* Sizes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] uppercase tracking-[0.25em] font-black text-zinc-500">{t[locale].sizes}</p>
                <span className="text-[10px] text-zinc-700 uppercase tracking-wider cursor-pointer hover:text-zinc-500 transition-colors">{t[locale].sizeGuide}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {jersey.sizes.map((size) => (
                  <button
                    key={size}
                    className="border border-[rgba(255,255,255,0.08)] py-3 text-xs font-black text-zinc-500 uppercase tracking-wider hover:border-gold/50 hover:text-white transition-all duration-200 hover:bg-gold/5"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            {jersey.material && (
              <div className="flex items-center gap-3 mb-8 py-4 border-t border-b border-[rgba(255,255,255,0.05)]">
                <span className="text-[10px] uppercase tracking-widest text-zinc-700 font-black shrink-0">{t[locale].material}</span>
                <span className="text-xs text-zinc-500">{jersey.material}</span>
              </div>
            )}

            {/* Description */}
            {jersey.description?.html && (
              <div
                className="prose-dark text-zinc-600 text-sm leading-relaxed mb-8"
                dangerouslySetInnerHTML={{ __html: jersey.description.html }}
              />
            )}

            {/* Add to cart */}
            <button className="w-full bg-gold text-black font-black py-4 text-sm uppercase tracking-[0.2em] hover:bg-gold-light transition-all duration-200 mb-3 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(201,168,76,0.3)] active:translate-y-0">
              {t[locale].addToCart}
            </button>
            <button className="w-full border border-[rgba(255,255,255,0.12)] text-zinc-400 font-black py-4 text-sm uppercase tracking-[0.2em] hover:border-white/25 hover:text-white transition-all duration-200">
              {t[locale].wishlist ?? 'Save to Wishlist'}
            </button>

            {/* Specs */}
            <div className="mt-8 space-y-3">
              {[
                { icon: '✓', text: t[locale].officialLicense },
                { icon: '✓', text: t[locale].freeShipping },
                { icon: '✓', text: t[locale].returns },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-xs text-zinc-700">
                  <span className="text-gold font-black">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ─── RELATED JERSEYS ────────────────────────────── */}
        {jersey.relatedJerseys && jersey.relatedJerseys.length > 0 && (
          <div className="mt-24 border-t border-[rgba(255,255,255,0.06)] pt-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-3">{t[locale].youMayAlsoLike}</p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-8">
              {t[locale].relatedProducts}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {jersey.relatedJerseys.map((rel, i) => (
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
