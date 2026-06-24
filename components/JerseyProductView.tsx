'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Jersey, KitVariant } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'
import KitSwitcher from './KitSwitcher'

interface Props {
  jersey: Jersey
  locale: Locale
}

export default function JerseyProductView({ jersey, locale }: Props) {
  const defaultVariant = jersey.variants?.[0] ?? null
  const [activeVariant, setActiveVariant] = useState<KitVariant | null>(defaultVariant)

  const displayName = activeVariant?.variantName ?? jersey.name
  const displayPrice = activeVariant?.price ?? jersey.price
  const displayMaterial = activeVariant?.material ?? jersey.material

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-16">

      {/* ─── IMAGE PANEL ───────────────────────────── */}
      <div className="relative">
        <div className="sticky top-24">
          {jersey.variants && jersey.variants.length > 0 ? (
            <KitSwitcher
              variants={jersey.variants}
              locale={locale}
              onVariantChange={setActiveVariant}
            />
          ) : (
            <div className="relative aspect-square bg-[#0e0e0e] border border-[rgba(255,255,255,0.06)] overflow-hidden">
              {jersey.imageUrl ? (
                <Image src={jersey.imageUrl} alt={jersey.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl opacity-10">👕</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── PURCHASE PANEL ───────────────────────── */}
      <div className="pt-4 lg:pt-0">

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

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white leading-tight mb-2">
          {displayName}
        </h1>

        <div className="text-3xl font-black text-gold mb-8">
          {jersey.currency} {displayPrice.toFixed(2)}
        </div>

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
        {displayMaterial && (
          <div className="flex items-center gap-3 mb-8 py-4 border-t border-b border-[rgba(255,255,255,0.05)]">
            <span className="text-[10px] uppercase tracking-widest text-zinc-700 font-black shrink-0">{t[locale].material}</span>
            <span className="text-xs text-zinc-500">{displayMaterial}</span>
          </div>
        )}

        {/* Description */}
        {jersey.description?.html && (
          <div
            className="prose-dark text-zinc-600 text-sm leading-relaxed mb-8"
            dangerouslySetInnerHTML={{ __html: jersey.description.html }}
          />
        )}

        <button className="w-full bg-gold text-black font-black py-4 text-sm uppercase tracking-[0.2em] hover:bg-gold-light transition-all duration-200 mb-3 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(201,168,76,0.3)] active:translate-y-0">
          {t[locale].addToCart}
        </button>
        <button className="w-full border border-[rgba(255,255,255,0.12)] text-zinc-400 font-black py-4 text-sm uppercase tracking-[0.2em] hover:border-white/25 hover:text-white transition-all duration-200">
          {t[locale].wishlist ?? 'Save to Wishlist'}
        </button>

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
  )
}
