import dynamic from 'next/dynamic'
import Nav from '@/components/Nav'
import SplitHero from '@/components/SplitHero'

// Sections below the fold are lazy-loaded — parsed and hydrated only when needed
const StorySection       = dynamic(() => import('@/components/StorySection'))
const CharactersSection  = dynamic(() => import('@/components/CharactersSection'))
const CitiesSection      = dynamic(() => import('@/components/CitiesSection'))
const WorldSection       = dynamic(() => import('@/components/WorldSection'))
const MapSection         = dynamic(() => import('@/components/MapSection'))
const SupportSection     = dynamic(() => import('@/components/SupportSection'))
const SupportersRanking  = dynamic(() => import('@/components/SupportersRanking'))
const FaqSection         = dynamic(() => import('@/components/FaqSection'))
const DevlogSection      = dynamic(() => import('@/components/DevlogSection'))
const NotifySection      = dynamic(() => import('@/components/NotifySection'))
const Footer             = dynamic(() => import('@/components/Footer'))

export default function Home() {
  return (
    <>
      <Nav />
      <SplitHero />
      <StorySection />
      <CharactersSection />
      <CitiesSection />
      <WorldSection />
      <MapSection />
      <SupportSection />
      <SupportersRanking />
      <FaqSection />
      <DevlogSection />
      <NotifySection />
      <Footer />
    </>
  )
}
