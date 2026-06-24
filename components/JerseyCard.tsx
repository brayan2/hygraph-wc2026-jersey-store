import Link from 'next/link'
import Image from 'next/image'
import type { Jersey } from '@/lib/hygraph'
import type { Locale } from '@/lib/i18n'
import { t } from '@/lib/i18n'

export default function JerseyCard({ jersey, locale }: { jersey: Jersey; locale: Locale }) {
  return (
    <Link href={`/${locale}/jerseys/${jersey.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1">
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
          {jersey.imageUrl ? (
            <Image
              src={jersey.imageUrl}
              alt={jersey.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">👕</div>
          )}
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
            jersey.kitType === 'HOME'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-900 text-white'
          }`}>
            {jersey.kitType === 'HOME' ? t[locale].homeKit : t[locale].awayKit}
          </div>
        </div>
        <div className="p-4">
          {jersey.team && (
            <p className="text-sm font-medium text-indigo-500 mb-1 flex items-center gap-1.5">
              <span>{jersey.team.flagEmoji}</span>
              <span>{jersey.team.name}</span>
            </p>
          )}
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">
            {jersey.name}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-gray-900">
              {jersey.currency} {jersey.price.toFixed(2)}
            </span>
            <div className="flex gap-1">
              {jersey.sizes.slice(0, 3).map((s) => (
                <span key={s} className="text-xs border border-gray-200 rounded px-1.5 py-0.5 text-gray-500">
                  {s}
                </span>
              ))}
              {jersey.sizes.length > 3 && (
                <span className="text-xs text-gray-400">+{jersey.sizes.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
