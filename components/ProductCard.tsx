import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/hygraph'
import type { Locale } from '@/lib/i18n'

export default function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  return (
    <Link href={`/${locale}/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div className="relative aspect-square bg-gray-50">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📦</div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-indigo-500 font-medium mb-1 uppercase tracking-wide">
            {product.category?.name}
          </p>
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-gray-900 mt-2">
            {product.currency} {product.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  )
}
