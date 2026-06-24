'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { locales, t, type Locale } from '@/lib/i18n'

export default function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  const isActive = (href: string) => pathname === href || (href !== `/${locale}` && pathname.startsWith(href))

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(8,8,8,0.92)] backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 shrink-0 group">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-base transition-transform group-hover:scale-105">
              ⚽
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-white text-sm leading-none block tracking-[0.15em] uppercase">
                WC 2026
              </span>
              <span className="text-[9px] text-gold font-bold tracking-[0.25em] uppercase">
                {t[locale].officialStore}
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: `/${locale}`, label: t[locale].home },
              { href: `/${locale}/shop`, label: t[locale].shop },
              { href: `/${locale}/collections`, label: t[locale].collections },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-bold uppercase tracking-[0.15em] transition-colors duration-200 relative group ${
                  isActive(link.href) ? 'text-white' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-[22px] left-0 right-0 h-px bg-gold" />
                )}
              </Link>
            ))}
          </div>

          {/* Right: locale + cart */}
          <div className="flex items-center gap-3">
            {/* Locale switcher */}
            <div className="flex items-center border border-[rgba(255,255,255,0.1)] overflow-hidden">
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={`px-2.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                    l === locale
                      ? 'bg-gold text-black'
                      : 'text-zinc-600 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Cart icon */}
            <button className="w-9 h-9 flex items-center justify-center border border-[rgba(255,255,255,0.08)] text-zinc-500 hover:text-white hover:border-gold/30 transition-all">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  )
}
