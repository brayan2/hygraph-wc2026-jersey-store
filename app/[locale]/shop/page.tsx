export const dynamic = 'force-dynamic'

import { fetchData, GET_JERSEYS, GET_TEAMS } from '@/lib/hygraph'
import type { Jersey, Team } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'
import JerseyCard from '@/components/JerseyCard'
import Link from 'next/link'

export default async function ShopPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params

  const [jerseysData, teamsData] = await Promise.all([
    fetchData<{ jerseys: Jersey[] }>(GET_JERSEYS, { locale }),
    fetchData<{ teams: Team[] }>(GET_TEAMS, { locale }),
  ])

  const jerseys = jerseysData?.jerseys ?? []
  const teams = teamsData?.teams ?? []

  return (
    <div className="min-h-screen bg-background">

      {/* Page header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-2">
            FIFA World Cup 2026™
          </p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-3">
            {t[locale].allJerseys}
          </h1>
          <p className="text-zinc-600 text-sm">
            {jerseys.length} jerseys · {teams.length} national teams
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Team filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-gold text-black">
            ⚽ {t[locale].allJerseys}
          </span>
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/${locale}/teams/${team.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-[rgba(255,255,255,0.08)] text-zinc-500 hover:text-white hover:border-white/20 transition-all duration-200"
            >
              <span>{team.flagEmoji}</span>
              <span>{team.name}</span>
            </Link>
          ))}
        </div>

        {/* Grid */}
        {jerseys.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-700 text-sm uppercase tracking-widest">{t[locale].noJerseys}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {jerseys.map((jersey, i) => (
              <div
                key={jersey.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 50, 400)}ms`, animationFillMode: 'both', opacity: 0 }}
              >
                <JerseyCard jersey={jersey} locale={locale} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
