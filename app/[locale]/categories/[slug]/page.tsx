import { redirect } from 'next/navigation'

export default async function CategoryRedirect({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  redirect(`/${locale}/teams/${slug}`)
}
