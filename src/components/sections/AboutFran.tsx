import { motion } from 'framer-motion';
import franPhoto from '../../assets/fran.webp';
import italoPhoto from '../../assets/italo.webp';
import { useSiteConfig } from '../../contexts/SiteConfigContext';

export function AboutFran() {
  const { settings } = useSiteConfig();

  // Helper to extract first phone for WhatsApp
  const getWhatsAppNumber = (phoneStr: string | undefined): string => {
    if (!phoneStr) return '556999650890';
    const firstPhone = phoneStr.split(/[/,]/)[0].trim();
    const digits = firstPhone.replace(/\D/g, '');
    return digits.startsWith('55') ? digits : `55${digits}`;
  };

  const team = [
    {
      name: 'Farias',
      role: 'Especialista Técnico & Fundador',
      photo: franPhoto,
      desc: 'Especialista em manutenção preventiva, corretiva e venda de equipamentos de ultrassom de alta complexidade. Com mais de 15 anos de atuação, garante a precisão e confiabilidade nos diagnósticos da região.',
      badge: '15+ Anos'
    },
    {
      name: 'Ítalo Loran',
      role: 'Assistente Técnico de Campo',
      photo: italoPhoto,
      desc: 'Responsável pelo suporte presencial, manutenções preventivas periódicas, calibrações de imagem e testes detalhados de conformidade com as normas da ANVISA.',
      badge: 'Suporte Campo'
    }
  ];

  return (
    <section className="py-12 lg:py-20 bg-white relative overflow-hidden" id="sobre">
      {/* Decorative gradients */}
      <div className="absolute top-[10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="group flex flex-col items-center text-center bg-slate-50 hover:bg-white rounded-3xl p-8 border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,85,204,0.06)] relative"
            >
              {/* Photo Container */}
              <div className="relative w-44 h-56 rounded-2xl overflow-hidden bg-slate-200 border border-slate-200 shadow-inner mb-6 transition-transform duration-500 group-hover:scale-[1.03] z-10 flex items-center justify-center">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute bottom-3 right-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-sm">
                  {member.badge}
                </div>
              </div>

              {/* Text Info */}
              <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                {member.name}
              </h3>
              <span className="text-[11px] font-extrabold tracking-widest text-blue-600 uppercase mt-1.5 mb-4 block">
                {member.role}
              </span>
              <p className="text-slate-600 font-light text-sm leading-relaxed max-w-sm flex-grow">
                {member.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Support CTA block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center border-t border-slate-100 pt-12"
        >
          <a
            href={`https://wa.me/${getWhatsAppNumber(settings?.phone)}?text=Olá!%20Gostaria%20de%20solicitar%20um%20suporte%20técnico.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,85,204,0.1)] hover:shadow-[0_0_25px_rgba(0,85,204,0.25)] active:scale-95 cursor-pointer"
          >
            Falar com a Nossa Equipe
          </a>
        </motion.div>
      </div>
    </section>
  );
}