import Link from 'next/link'
import Image from 'next/image'
import type { Collection } from '@/lib/hygraph'
import { t, continentLabels, type Locale } from '@/lib/i18n'

export default function CollectionCard({ collection, locale }: { collection: Pick<Collection, 'id' | 'name' | 'slug' | 'continent' | 'heroImageUrl' | 'teams' | 'jerseys'>; locale: Locale }) {
  return (
    <Link href={`/${locale}/collections/${collection.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-indigo-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 aspect-[4/3]">
        {collection.heroImageUrl && (
          <Image
            src={collection.heroImageUrl}
            alt={collection.name}
            fill
            className="object-cover opacity-50 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-5">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full mb-2 w-fit">
            {continentLabels[locale][collection.continent] || collection.continent}
          </span>
          <h3 className="text-white font-bold text-xl leading-tight group-hover:text-indigo-200 transition-colors">
            {collection.name}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-white/70 text-sm">
            <span>{collection.teams.length} {t[locale].teamCount}</span>
            <span>·</span>
            <span>{collection.jerseys.length} {t[locale].jerseyCount}</span>
          </div>
          <div className="flex gap-1 mt-2">
            {collection.teams.slice(0, 5).map((team) => (
              <span key={team.id} className="text-lg" title={team.name}>{team.flagEmoji}</span>
            ))}
            {collection.teams.length > 5 && (
              <span className="text-white/60 text-sm ml-1">+{collection.teams.length - 5}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
