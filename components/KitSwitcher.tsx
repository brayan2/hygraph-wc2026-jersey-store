'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { KitType, KitVariant } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'

interface Props {
  variants: KitVariant[]
  locale: Locale
  onVariantChange: (v: KitVariant) => void
}

export default function KitSwitcher({ variants, locale, onVariantChange }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = variants[activeIndex]

  function select(i: number) {
    setActiveIndex(i)
    onVariantChange(variants[i])
  }

  if (!active) return null

  if (variants.length <= 1) {
    return (
      <div className="relative aspect-square bg-[#0e0e0e] border border-[rgba(255,255,255,0.06)] overflow-hidden">
        <KitImage imageUrl={active.imageUrl} name={active.variantName} />
        <KitBadge kitType={active.kitType} locale={locale} />
      </div>
    )
  }

  return (
    <div>
      <div className="relative aspect-square bg-[#0e0e0e] border border-[rgba(255,255,255,0.06)] overflow-hidden mb-4">
        <KitImage imageUrl={active.imageUrl} name={active.variantName} />
        <KitBadge kitType={active.kitType} locale={locale} />
      </div>

      <div className="flex gap-3">
        {variants.map((v, i) => (
          <button
            key={`${v.kitType}-${i}`}
            onClick={() => select(i)}
            className={`group relative flex-1 border transition-all duration-200 overflow-hidden ${
              activeIndex === i
                ? 'border-gold shadow-[0_0_0_1px_rgba(201,168,76,0.4)]'
                : 'border-[rgba(255,255,255,0.08)] hover:border-white/20'
            }`}
          >
            <div className="aspect-square bg-[#0e0e0e] relative overflow-hidden">
              {v.imageUrl ? (
                <Image
                  src={v.imageUrl}
                  alt={v.variantName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="20vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl opacity-10">👕</div>
              )}
            </div>
            <div className={`py-2 px-2 text-center text-[9px] font-black uppercase tracking-[0.15em] transition-colors ${
              activeIndex === i ? 'bg-gold text-black' : 'bg-[#111] text-zinc-500 group-hover:text-white'
            }`}>
              {v.kitType === 'HOME' ? t[locale].homeKit : t[locale].awayKit}
            </div>
            {activeIndex === i && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function KitImage({ imageUrl, name }: { imageUrl: string | null; name: string }) {
  if (!imageUrl) {
    return <div className="w-full h-full flex items-center justify-center text-8xl opacity-10">👕</div>
  }
  return (
    <Image
      src={imageUrl}
      alt={name}
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
