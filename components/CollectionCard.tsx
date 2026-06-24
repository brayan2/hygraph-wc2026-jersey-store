import Link from 'next/link'
import Image from 'next/image'
import type { Collection } from '@/lib/hygraph'
import { t, continentLabels, type Locale } from '@/lib/i18n'

export default function CollectionCard({
  collection,
  locale,
}: {
  collection: Pick<Collection, 'id' | 'name' | 'slug' | 'continent' | 'heroImageUrl' | 'teams' | 'jerseys'>
  locale: Locale
}) {
  return (
    <Link href={`/${locale}/collections/${collection.slug}`} className="group block">
      <div className="relative overflow-hidden aspect-[3/4] bg-[#111] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)]">

        {/* Background image */}
        {collection.heroImageUrl && (
          <Image
            src={collection.heroImageUrl}
            alt={collection.name}
            fill
            className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-50" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          {/* Top */}
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-black">
              {continentLabels[locale][collection.continent] || collection.continent}
            </span>
          </div>

          {/* Bottom */}
          <div>
            <h3 className="text-white font-black text-xl leading-tight uppercase tracking-tight mb-3 group-hover:text-gold transition-colors duration-300">
              {collection.name}
            </h3>

            {/* Team flags */}
            <div className="flex gap-1 mb-3">
              {collection.teams.slice(0, 5).map((team) => (
                <span key={team.id} className="text-xl drop-shadow-lg" title={team.name}>
                  {team.flagEmoji}
                </span>
              ))}
              {collection.teams.length > 5 && (
                <span className="text-white/40 text-sm ml-1 self-center">+{collection.teams.length - 5}</span>
              )}
            </div>

            {/* Counts */}
            <div className="flex items-center gap-3 text-white/40 text-[10px] uppercase tracking-[0.15em] font-bold">
              <span>{collection.teams.length} {t[locale].teamCount}</span>
              <span className="text-white/20">·</span>
              <span>{collection.jerseys.length} {t[locale].jerseyCount}</span>
            </div>
          </div>
        </div>

        {/* Hover arrow */}
        <div className="absolute top-6 right-6 w-8 h-8 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H7M17 7v10"/>
          </svg>
        </div>

      </div>
    </Link>
  )
}
