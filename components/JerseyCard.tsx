import Link from 'next/link'
import Image from 'next/image'
import type { Jersey } from '@/lib/hygraph'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

export default function JerseyCard({ jersey, locale }: { jersey: Jersey; locale: Locale }) {
  return (
    <Link href={`/${locale}/jerseys/${jersey.slug}`} className="group block">
      <div className="bg-surface border border-[rgba(255,255,255,0.07)] overflow-hidden transition-all duration-300 hover:border-[rgba(255,255,255,0.15)] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)]">

        {/* Image */}
        <div className="relative aspect-square bg-[#0e0e0e] overflow-hidden">
          {jersey.imageUrl ? (
            <Image
              src={jersey.imageUrl}
              alt={jersey.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">👕</div>
          )}

          {/* Kit badge */}
          <div className={`absolute top-3 left-3 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] ${
            jersey.kitType === 'HOME'
              ? 'bg-gold text-black'
              : 'bg-white/10 backdrop-blur-sm text-white/80 border border-white/15'
          }`}>
            {jersey.kitType === 'HOME' ? t[locale].homeKit : t[locale].awayKit}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.05)]">
          {jersey.team && (
            <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-600 mb-1.5 flex items-center gap-1.5">
              <span>{jersey.team.flagEmoji}</span>
              <span>{jersey.team.name}</span>
            </p>
          )}
          <h3 className="font-bold text-zinc-200 group-hover:text-gold transition-colors duration-200 leading-snug text-sm mb-3">
            {jersey.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-base font-black text-gold tracking-tight">
              {jersey.currency} {jersey.price.toFixed(2)}
            </span>
            <div className="flex gap-1">
              {jersey.sizes.slice(0, 3).map((s) => (
                <span key={s} className="text-[9px] border border-[rgba(255,255,255,0.08)] px-1.5 py-0.5 text-zinc-600 font-bold uppercase">
                  {s}
                </span>
              ))}
              {jersey.sizes.length > 3 && (
                <span className="text-[10px] text-zinc-700">+{jersey.sizes.length - 3}</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </Link>
  )
}
