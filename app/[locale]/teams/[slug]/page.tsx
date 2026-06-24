export const dynamic = 'force-dynamic'

import { fetchData, GET_TEAM, GET_TEAMS } from '@/lib/hygraph'
import type { Team } from '@/lib/hygraph'
import { t, type Locale } from '@/lib/i18n'
import JerseyCard from '@/components/JerseyCard'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  try {
    const data = await fetchData<{ teams: Team[] }>(GET_TEAMS, { locale: 'en' })
    return data?.teams.map((team) => ({ slug: team.slug })) ?? []
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
  const data = await fetchData<{ team: Team | null }>(GET_TEAM, { slug, locale })
  const team = data?.team ?? null

  if (!team) notFound()

  return (
    <div className="min-h-screen bg-background">

      {/* Back nav */}
      <div className="border-b border-[rgba(255,255,255,0.05)] bg-[#0c0c0c] py-3 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 text-zinc-600 hover:text-gold transition-colors text-[10px] font-bold uppercase tracking-widest"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {t[locale].backToShop}
          </Link>
        </div>
      </div>

      {/* Team header */}
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0c0c0c] py-12 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <span className="text-7xl drop-shadow-lg">{team.flagEmoji}</span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-1">
              {team.confederation}
            </p>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-white leading-none">
              {team.name}
            </h1>
            <p className="text-zinc-600 text-sm mt-1">{team.country}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {team.jerseys.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-700 text-sm uppercase tracking-widest">{t[locale].noJerseys}</p>
          </div>
        ) : (
          <>
            <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-700 font-black mb-6">
              {team.jerseys.length} {team.jerseys.length === 1 ? t[locale].kit : t[locale].kits} {t[locale].available}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.jerseys.map((jersey, i) => (
                <div
                  key={jersey.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both', opacity: 0 }}
                >
                  <JerseyCard
                    jersey={{ ...jersey, team: { id: team.id, name: team.name, slug: team.slug, flagEmoji: team.flagEmoji, country: team.country } }}
                    locale={locale}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
