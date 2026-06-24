'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { KitType, JerseyVariant } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'

interface Props {
  current: JerseyVariant
  variants: JerseyVariant[]
  locale: Locale
}

export default function KitSwitcher({ current, variants, locale }: Props) {
  const [active, setActive] = useState<JerseyVariant>(current)

  if (variants.length <= 1) {
    return (
      <div className="relative aspect-square bg-[#0e0e0e] border border-[rgba(255,255,255,0.06)] overflow-hidden">
        <KitImage jersey={current} locale={locale} />
        <KitBadge kitType={current.kitType} locale={locale} />
      </div>
    )
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square bg-[#0e0e0e] border border-[rgba(255,255,255,0.06)] overflow-hidden mb-4">
        <KitImage jersey={active} locale={locale} />
        <KitBadge kitType={active.kitType} locale={locale} />
      </div>

      {/* Swatches */}
      <div className="flex gap-3">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => setActive(v)}
            className={`group relative flex-1 border transition-all duration-200 overflow-hidden ${
              active.id === v.id
                ? 'border-gold shadow-[0_0_0_1px_rgba(201,168,76,0.4)]'
                : 'border-[rgba(255,255,255,0.08)] hover:border-white/20'
            }`}
          >
            {/* Thumbnail */}
            <div className="aspect-square bg-[#0e0e0e] relative overflow-hidden">
              {v.imageUrl ? (
                <Image
                  src={v.imageUrl}
                  alt={v.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="20vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl opacity-10">👕</div>
              )}
            </div>

            {/* Label */}
            <div className={`py-2 px-2 text-center text-[9px] font-black uppercase tracking-[0.15em] transition-colors ${
              active.id === v.id ? 'bg-gold text-black' : 'bg-[#111] text-zinc-500 group-hover:text-white'
            }`}>
              {v.kitType === 'HOME' ? t[locale].homeKit : t[locale].awayKit}
            </div>

            {/* Active indicator */}
            {active.id === v.id && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Navigate to selected kit if different from current page */}
      {active.id !== current.id && (
        <Link
          href={`/${locale}/jerseys/${active.slug}`}
          className="mt-4 w-full flex items-center justify-center gap-2 border border-gold/40 text-gold hover:bg-gold hover:text-black text-[10px] font-black uppercase tracking-[0.2em] py-3 transition-all duration-200"
        >
          {active.kitType === 'HOME' ? t[locale].homeKit : t[locale].awayKit} — {active.currency} {active.price.toFixed(2)}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      )}
    </div>
  )
}

function KitImage({ jersey, locale }: { jersey: JerseyVariant; locale: Locale }) {
  if (!jersey.imageUrl) {
    return <div className="w-full h-full flex items-center justify-center text-8xl opacity-10">👕</div>
  }
  return (
    <Image
      src={jersey.imageUrl}
      alt={jersey.name}
      fill
      className="object-cover"
      sizes="(max-width: 1024px) 100vw, 50vw"
      priority
    />
  )
}

function KitBadge({ kitType, locale }: { kitType: KitType; locale: Locale }) {
  return (
    <div className={`absolute top-4 left-4 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] ${
      kitType === 'HOME'
        ? 'bg-gold text-black'
        : 'bg-white/10 backdrop-blur-sm text-white/80 border border-white/15'
    }`}>
      {kitType === 'HOME' ? t[locale].homeKit : t[locale].awayKit}
    </div>
  )
}
