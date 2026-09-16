import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Preview from '../components/Preview'
import Features from '../components/Features'
import ResultsSection from '../components/Results'
import Pricing from '../components/Pricing'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Preview />
      <Features />
      <ResultsSection />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  )
}
