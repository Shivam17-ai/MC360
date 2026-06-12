import HeroSection from '../components/landing/HeroSection'
import StatsSection from '../components/landing/StatsSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import ServicesSection from '../components/landing/ServicesSection'
import AboutSection from '../components/landing/AboutSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import CTASection from '../components/landing/CTASection'

export default function Landing() {
  return (
    <div className="pt-16">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ServicesSection />
      <AboutSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}