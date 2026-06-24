import { hygraph, GET_TEAM, GET_TEAMS } from '@/lib/hygraph'
import type { Team } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'
import JerseyCard from '@/components/JerseyCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  try {
    const { teams } = await hygraph.request<{ teams: Team[] }>(GET_TEAMS, { locale: 'en' })
    return teams.map((team) => ({ slug: team.slug }))
  } catch {
    return []
  }
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const { team } = await hygraph.request<{ team: Team | null }>(GET_TEAM, { slug, locale })

  if (!team) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/${locale}/shop`} className="text-sm text-indigo-600 hover:underline mb-8 inline-block">
        {t[locale].backToShop}
      </Link>

      {/* Team header */}
      <div className="flex items-center gap-4 mb-10 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <span className="text-6xl">{team.flagEmoji}</span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span>{team.country}</span>
            <span>•</span>
            <span>{t[locale].confederation}: <strong className="text-gray-700">{team.confederation}</strong></span>
          </div>
        </div>
      </div>

      {team.jerseys.length === 0 ? (
        <p className="text-gray-500 text-center py-20">{t[locale].noJerseys}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.jerseys.map((jersey) => (
            <JerseyCard
              key={jersey.id}
              jersey={{ ...jersey, team: { id: team.id, name: team.name, slug: team.slug, flagEmoji: team.flagEmoji, country: team.country } }}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  )
}
