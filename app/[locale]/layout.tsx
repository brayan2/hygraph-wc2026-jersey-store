import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { isValidLocale, type Locale } from '@/lib/i18n'

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
    <div className="min-h-screen bg-gray-50">
      <Navbar locale={locale as Locale} />
      <main>{children}</main>
      <footer className="bg-white border-t border-gray-200 mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚽</span>
            <span>© 2026 Hygraph Store · FIFA World Cup 2026™</span>
          </div>
          <span>
            Powered by{' '}
            <a href="https://hygraph.com" className="text-indigo-600 hover:underline font-medium">
              Hygraph
            </a>
            {' '}+ Next.js
          </span>
        </div>
      </footer>
    </div>
  )
}
