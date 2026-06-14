import { AboutFran } from '../components/sections/AboutFran';

export function AboutPage() {
  return (
    <main className="pt-24 lg:pt-32 pb-16 bg-[#030712]">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Nossa História</h1>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Conheça mais sobre a trajetória da Fran Ultrassom e nosso compromisso com a excelência em diagnóstico por imagem.</p>
      </div>
      <AboutFran />
    </main>
  );
}
