import dynamic from 'next/dynamic'
import Nav from '@/components/Nav'
import SplitHero from '@/components/SplitHero'

// Sections below the fold are lazy-loaded — parsed and hydrated only when needed
const RiftExpandCards    = dynamic(() => import('@/components/RiftExpandCards'))
const ClassesSection     = dynamic(() => import('@/components/ClassesSection'))
const StorySection       = dynamic(() => import('@/components/StorySection'))
const CharactersSection  = dynamic(() => import('@/components/CharactersSection'))
const CitiesSection      = dynamic(() => import('@/components/CitiesSection'))
const WorldSection       = dynamic(() => import('@/components/WorldSection'))
const SupportSection     = dynamic(() => import('@/components/SupportSection'))
const SupportersRanking  = dynamic(() => import('@/components/SupportersRanking'))
const FaqSection         = dynamic(() => import('@/components/FaqSection'))
const TerminalSection    = dynamic(() => import('@/components/TerminalSection'))
const DevlogSection      = dynamic(() => import('@/components/DevlogSection'))
const Footer             = dynamic(() => import('@/components/Footer'))

export default function Home() {
  return (
    <>
      <Nav />
      <SplitHero />
      <RiftExpandCards />
      <WorldSection />
      <CharactersSection />
      <CitiesSection />
      <ClassesSection />
      <TerminalSection />
      <DevlogSection />
      <SupportSection />
      <SupportersRanking />
      <FaqSection />
      <Footer />
    </>
  )
}
