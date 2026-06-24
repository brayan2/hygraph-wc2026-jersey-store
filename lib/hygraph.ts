import { GraphQLClient, gql } from 'graphql-request'

const endpoint = process.env.HYGRAPH_ENDPOINT ?? ''

// Use a placeholder URL so GraphQLClient constructs without throwing;
// actual requests will fail gracefully if the env var is missing.
export const hygraph = new GraphQLClient(endpoint || 'http://localhost:1')

export async function fetchData<T>(query: string, variables: Record<string, unknown>): Promise<T | null> {
  if (!endpoint) return null
  try {
    return await hygraph.request<T>(query, variables)
  } catch (e) {
    console.error('[Hygraph] fetch error:', e)
    return null
  }
}

export type Locale = 'en' | 'de' | 'fr'
export type KitType = 'HOME' | 'AWAY'

export interface KitVariant {
  kitType: KitType
  variantName: string
  price: number
  imageUrl: string | null
  material: string | null
}
export type JerseySize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'
export type Continent = 'EUROPE' | 'SOUTH_AMERICA' | 'NORTH_AMERICA' | 'AFRICA' | 'ASIA' | 'OCEANIA' | 'GLOBAL'

export interface Seo {
  metaTitle: string | null
  metaDescription: string | null
  ogImageUrl: string | null
  canonicalUrl: string | null
}

export interface HeroSection {
  headline: string
  subheading: string | null
  ctaLabel: string | null
  ctaUrl: string | null
  imageUrl: string | null
  badgeText: string | null
}

export interface PromotionalBanner {
  headline: string
  description: string | null
  ctaLabel: string | null
  ctaUrl: string | null
  imageUrl: string | null
  backgroundColor: string | null
}

export interface Team {
  id: string
  name: string
  slug: string
  country: string
  flagEmoji: string
  confederation: string
  seo?: Seo | null
  jerseys: Jersey[]
  collections: Collection[]
}

export type JerseyVariant = Pick<Jersey, 'id' | 'name' | 'slug' | 'price' | 'currency' | 'imageUrl' | 'kitType' | 'sizes' | 'team'>

export interface Jersey {
  id: string
  name: string
  slug: string
  price: number
  currency: string
  imageUrl: string | null
  kitType: KitType
  sizes: JerseySize[]
  material?: string | null
  description?: { html: string } | null
  seo?: Seo | null
  variants?: KitVariant[]
  relatedJerseys?: JerseyVariant[]
  team?: Pick<Team, 'id' | 'name' | 'slug' | 'flagEmoji' | 'country'>
  collection?: Pick<Collection, 'id' | 'name' | 'slug'> | null
}

export interface Collection {
  id: string
  name: string
  slug: string
  continent: Continent
  heroImageUrl: string | null
  description?: { html: string } | null
  seo?: Seo | null
  teams: Pick<Team, 'id' | 'name' | 'slug' | 'flagEmoji' | 'country' | 'confederation'>[]
  jerseys: Pick<Jersey, 'id' | 'name' | 'slug' | 'price' | 'currency' | 'imageUrl' | 'kitType' | 'sizes' | 'team'>[]
}

export interface Homepage {
  id: string
  title: string
  hero: HeroSection | null
  seo: Seo | null
  promotionalBanners: PromotionalBanner[]
  featuredCollections: Pick<Collection, 'id' | 'name' | 'slug' | 'continent' | 'heroImageUrl' | 'teams' | 'jerseys'>[]
  featuredJerseys: Pick<Jersey, 'id' | 'name' | 'slug' | 'price' | 'currency' | 'imageUrl' | 'kitType' | 'sizes' | 'team'>[]
}

const SEO_FIELDS = `seo { metaTitle metaDescription ogImageUrl canonicalUrl }`
const JERSEY_CARD_FIELDS = `id name slug price currency imageUrl kitType sizes team { id name slug flagEmoji country }`

export const GET_HOMEPAGE = gql`
  query GetHomepage($locale: Locale!) {
    homepages(first: 1, locales: [$locale, en]) {
      id
      title
      hero { headline subheading ctaLabel ctaUrl imageUrl badgeText }
      ${SEO_FIELDS}
      promotionalBanners { headline description ctaLabel ctaUrl imageUrl backgroundColor }
      featuredCollections {
        id name slug continent heroImageUrl
        teams { id name slug flagEmoji }
        jerseys { ${JERSEY_CARD_FIELDS} }
      }
      featuredJerseys { ${JERSEY_CARD_FIELDS} }
    }
  }
`

export const GET_COLLECTIONS = gql`
  query GetCollections($locale: Locale!) {
    collections(locales: [$locale, en]) {
      id name slug continent heroImageUrl
      teams { id name slug flagEmoji }
      jerseys { ${JERSEY_CARD_FIELDS} }
    }
  }
`

export const GET_COLLECTION = gql`
  query GetCollection($slug: String!, $locale: Locale!) {
    collection(where: { slug: $slug }, locales: [$locale, en]) {
      id name slug continent heroImageUrl
      description { html }
      ${SEO_FIELDS}
      teams { id name slug flagEmoji country confederation }
      jerseys { ${JERSEY_CARD_FIELDS} }
    }
  }
`

export const GET_TEAMS = gql`
  query GetTeams($locale: Locale!) {
    teams(first: 50, locales: [$locale, en]) {
      id name slug country flagEmoji confederation
    }
  }
`

export const GET_TEAM = gql`
  query GetTeam($slug: String!, $locale: Locale!) {
    team(where: { slug: $slug }, locales: [$locale, en]) {
      id name slug country flagEmoji confederation
      ${SEO_FIELDS}
      jerseys(first: 10, locales: [$locale, en]) { id name slug price currency imageUrl kitType sizes }
    }
  }
`

export const GET_JERSEYS = gql`
  query GetJerseys($locale: Locale!) {
    jerseys(first: 50, locales: [$locale, en]) {
      ${JERSEY_CARD_FIELDS}
    }
  }
`

export const GET_JERSEY = gql`
  query GetJersey($slug: String!, $locale: Locale!) {
    jersey(where: { slug: $slug }, locales: [$locale, en]) {
      id name slug price currency imageUrl kitType sizes material
      description { html }
      ${SEO_FIELDS}
      team { id name slug flagEmoji country }
      collection { id name slug }
      variants { kitType variantName price imageUrl material }
      relatedJerseys { ${JERSEY_CARD_FIELDS} }
    }
  }
`
