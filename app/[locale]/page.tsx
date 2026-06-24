export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { fetchData, GET_HOMEPAGE } from '@/lib/hygraph'
import type { Homepage } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'
import JerseyCard from '@/components/JerseyCard'
import CollectionCard from '@/components/CollectionCard'

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const data = await fetchData<{ homepages: Homepage[] }>(GET_HOMEPAGE, { locale })
  const page = data?.homepages?.[0]

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div className="animate-fade-up">
          <p className="text-5xl mb-6">⚽</p>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-3">
            {t[locale].heroTitle}<br />
            <span className="text-gradient-gold">{t[locale].allJerseys}</span>
          </h1>
          <p className="text-zinc-600 text-sm uppercase tracking-widest">{t[locale].contentLoading}</p>
        </div>
      </div>
    )
  }

  const hero = page.hero

  return (
    <div className="bg-background">

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#060606]">
        {hero?.imageUrl && (
          <>
            <Image
              src={hero.imageUrl}
              alt=""
              fill
              className="object-cover opacity-25"
              sizes="100vw"
              priority
            />
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Badge */}
          {hero?.badgeText && (
            <div className="animate-fade-up inline-flex items-center gap-2 border border-gold/30 bg-gold/10 px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-gold text-[10px] font-black uppercase tracking-[0.3em]">
                {hero.badgeText}
              </span>
            </div>
          )}

          {/* Headline */}
          <h1 className="animate-fade-up delay-100 text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            <span className="text-white">{hero?.headline || page.title}</span>
          </h1>

          {/* Subheading */}
          {hero?.subheading && (
            <p className="animate-fade-up delay-200 text-zinc-400 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              {hero.subheading}
            </p>
          )}

          {/* CTA */}
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            {hero?.ctaLabel && hero.ctaUrl && (
              <Link
                href={`/${locale}${hero.ctaUrl}`}
                className="group inline-flex items-center gap-3 bg-gold text-black font-black px-8 py-4 text-sm uppercase tracking-[0.15em] hover:bg-gold-light transition-all duration-200 hover:-translate-y-0.5"
              >
                {hero.ctaLabel}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            )}
            <Link
              href={`/${locale}/collections`}
              className="inline-flex items-center gap-2 border border-white/15 text-white/70 hover:text-white hover:border-white/30 px-8 py-4 text-sm uppercase tracking-[0.15em] font-bold transition-all duration-200"
            >
              {t[locale].allCollections}
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-700">
          <span className="text-zinc-700 text-[9px] uppercase tracking-[0.3em] font-bold">{t[locale].scroll}</span>
          <div className="w-px h-10 bg-gradient-to-b from-zinc-700 to-transparent" />
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────── */}
      <section className="border-y border-[rgba(255,255,255,0.06)] bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[rgba(255,255,255,0.06)]">
            {[
              { num: '32', label: t[locale].statsNations },
              { num: '13', label: t[locale].statsTeams },
              { num: '13', label: t[locale].statsJerseys },
              { num: '5', label: t[locale].statsCollections },
            ].map((s) => (
              <div key={s.label} className="py-6 px-6 sm:px-10 text-center">
                <div className="text-2xl sm:text-3xl font-black text-gradient-gold mb-1">{s.num}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROMOTIONAL BANNERS ──────────────────────────── */}
      {page.promotionalBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {page.promotionalBanners.map((banner, i) => (
              <div
                key={i}
                className="relative overflow-hidden p-8 flex items-center justify-between gap-6 border border-[rgba(255,255,255,0.07)] hover:border-gold/20 transition-all duration-300 group"
                style={{ backgroundColor: banner.backgroundColor || '#111111' }}
              >
                {banner.imageUrl && (
                  <Image src={banner.imageUrl} alt="" fill className="object-cover opacity-15 group-hover:opacity-25 transition-opacity duration-500" sizes="50vw" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="relative z-10">
                  <p className="font-black text-white text-lg uppercase tracking-tight leading-tight mb-1">{banner.headline}</p>
                  {banner.description && <p className="text-sm text-zinc-500 mt-1 leading-relaxed">{banner.description}</p>}
                </div>
                {banner.ctaLabel && banner.ctaUrl && (
                  <Link
                    href={`/${locale}${banner.ctaUrl}`}
                    className="relative z-10 shrink-0 border border-gold/50 text-gold hover:bg-gold hover:text-black text-xs font-black px-5 py-2.5 uppercase tracking-wider transition-all duration-200 whitespace-nowrap"
                  >
                    {banner.ctaLabel}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── FEATURED COLLECTIONS ─────────────────────────── */}
      {page.featuredCollections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-2">
                {t[locale].browseByContinent}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                {t[locale].featuredCollections}
              </h2>
            </div>
            <Link
              href={`/${locale}/collections`}
              className="hidden sm:inline-flex items-center gap-2 text-zinc-600 hover:text-gold transition-colors text-xs font-black uppercase tracking-widest group"
            >
              {t[locale].viewAll}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {page.featuredCollections.map((col, i) => (
              <div
                key={col.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both', opacity: 0 }}
              >
                <CollectionCard collection={col} locale={locale} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── FEATURED JERSEYS ─────────────────────────────── */}
      {page.featuredJerseys.length > 0 && (
        <section className="bg-[#0c0c0c] border-t border-[rgba(255,255,255,0.05)] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-2">
                  {t[locale].newArrivals}
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-none">
                  {t[locale].featuredJerseys}
                </h2>
              </div>
              <Link
                href={`/${locale}/shop`}
                className="hidden sm:inline-flex items-center gap-2 text-zinc-600 hover:text-gold transition-colors text-xs font-black uppercase tracking-widest group"
              >
                {t[locale].viewAll}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-0.5 transition-transform">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {page.featuredJerseys.map((jersey, i) => (
                <div
                  key={jersey.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both', opacity: 0 }}
                >
                  <JerseyCard jersey={jersey} locale={locale} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA STRIP ────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gold py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-black/60 font-black mb-2">{t[locale].limitedEdition}</p>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-black leading-tight mb-6">
            {t[locale].ctaLine1}<br />{t[locale].ctaLine2}
          </h2>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-3 bg-black text-white font-black px-10 py-4 text-sm uppercase tracking-[0.15em] hover:bg-zinc-900 transition-all duration-200"
          >
            {t[locale].shopAllJerseys}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

    </div>
  )
}
