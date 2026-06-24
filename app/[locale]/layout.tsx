import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { isValidLocale, t, type Locale } from '@/lib/i18n'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'de' }, { locale: 'fr' }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isValidLocale(locale)) notFound()

  return (
    <div className="min-h-screen bg-background">
      <Navbar locale={locale as Locale} />
      <main className="pt-16">{children}</main>
      <footer className="border-t border-[rgba(255,255,255,0.07)] mt-24 pb-10 pt-12 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-sm">⚽</div>
              <div>
                <span className="text-white font-black text-sm uppercase tracking-widest block">WC 2026 Store</span>
                <span className="text-zinc-600 text-xs">{t[locale as Locale].copyright}</span>
              </div>
            </div>
            <div className="flex items-center gap-8 text-xs text-zinc-600 uppercase tracking-widest">
              <a href={`/${locale}`} className="hover:text-gold transition-colors">{t[locale as Locale].home}</a>
              <a href={`/${locale}/shop`} className="hover:text-gold transition-colors">{t[locale as Locale].shop}</a>
              <a href={`/${locale}/collections`} className="hover:text-gold transition-colors">{t[locale as Locale].collections}</a>
            </div>
            <span className="text-xs text-zinc-700">
              {t[locale as Locale].poweredBy}{' '}
              <a href="https://hygraph.com" className="text-gold hover:text-gold-light transition-colors font-medium" target="_blank" rel="noopener noreferrer">
                Hygraph
              </a>
              {' '}+ Next.js
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
