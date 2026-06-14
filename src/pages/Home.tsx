import { Hero } from '../components/sections/Hero';
import { ServicesSection } from '../components/sections/ServicesSection';
import { EquipmentCatalog } from '../components/sections/EquipmentCatalog';
import { Testimonials } from '../components/sections/Testimonials';

export function Home() {
  return (
    <main>
      <Hero />
      <EquipmentCatalog />
      <ServicesSection />
      <Testimonials />
    </main>
  );
}
