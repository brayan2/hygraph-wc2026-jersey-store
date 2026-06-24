export const dynamic = 'force-dynamic'

import { hygraph, GET_JERSEYS, GET_TEAMS } from '@/lib/hygraph'
import type { Jersey, Team } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'
import JerseyCard from '@/components/JerseyCard'
import Link from 'next/link'

export default async function ShopPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  const [{ jerseys }, { teams }] = await Promise.all([
    hygraph.request<{ jerseys: Jersey[] }>(GET_JERSEYS, { locale }),
    hygraph.request<{ teams: Team[] }>(GET_TEAMS, { locale }),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t[locale].allJerseys}</h1>
        <p className="text-gray-500">{jerseys.length} jerseys from {teams.length} national teams</p>
      </div>

      {/* Team filter chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-indigo-600 text-white">
          ⚽ {t[locale].allJerseys}
        </span>
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`/${locale}/teams/${team.slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
          >
            <span>{team.flagEmoji}</span>
            <span>{team.name}</span>
          </Link>
        ))}
      </div>

      {jerseys.length === 0 ? (
        <p className="text-gray-500 text-center py-20">{t[locale].noJerseys}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jerseys.map((jersey) => (
            <JerseyCard key={jersey.id} jersey={jersey} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}
