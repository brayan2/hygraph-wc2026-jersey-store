'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'

export default function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
            <span className="text-xl">⚽</span>
            <div className="hidden sm:block">
              <span className="font-bold text-gray-900 text-sm leading-none block">Hygraph Store</span>
              <span className="text-xs text-indigo-600 font-medium">FIFA World Cup 2026™</span>
            </div>
          </Link>
          <div className="flex items-center gap-5">
            <Link href={`/${locale}`} className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium hidden md:block">
              Home
            </Link>
            <Link href={`/${locale}/shop`} className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium hidden sm:block">
              Shop
            </Link>
            <Link href={`/${locale}/collections`} className="text-gray-600 hover:text-indigo-600 transition-colors text-sm font-medium hidden sm:block">
              Collections
            </Link>
            <div className="flex items-center gap-0 border border-gray-200 rounded-lg overflow-hidden">
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    l === locale
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
