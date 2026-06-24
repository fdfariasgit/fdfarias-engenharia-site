import { motion, type Variants } from 'framer-motion';
import { Settings, ShieldAlert, Activity, Cpu, Check, MoveRight } from 'lucide-react';
import type { ServiceCardProps } from '../../types';

const servicesData: ServiceCardProps[] = [
  {
    id: 'preventiva',
    title: 'Manutenção Preventiva',
    description: 'Evite paradas inesperadas. Revisão completa de hardware, limpeza interna profunda e calibração de imagem.',
    icon: Activity,
    features: ['Limpeza de placas e filtros', 'Calibração de transdutores', 'Relatório de conformidade']
  },
  {
    id: 'corretiva',
    title: 'Manutenção Corretiva',
    description: 'Diagnóstico rápido e preciso para equipamentos parados, minimizando o tempo de inatividade da sua clínica.',
    icon: Settings,
    features: ['Atendimento prioritário', 'Diagnóstico em até 24h', 'Reparo de placas a nível de componente']
  },
  {
    id: 'pecas',
    title: 'Peças e Transdutores',
    description: 'Fornecimento de peças originais Samsung e reparo especializado de transdutores (sondas) danificados.',
    icon: Cpu,
    features: ['Peças originais com garantia', 'Reparo de membrana e cristal', 'Cabo e conector']
  },
  {
    id: 'seguranca',
    title: 'Segurança Elétrica',
    description: 'Garantia de que seu equipamento está dentro das normas da ANVISA, protegendo o paciente e o operador.',
    icon: ShieldAlert,
    features: ['Aferição de fuga de corrente', 'Certificação técnica', 'Adequação RDC']
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 80, damping: 20 }
  }
};

export function ServicesSection() {
  return (
    <section className="py-12 lg:py-24 bg-transparent relative transition-colors border-t border-slate-200" id="servicos">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

        {/* Header da Seção */}
        <div className="text-center max-w-3xl mx-auto mb-8 lg:mb-20">
          <span className="block text-xs font-bold tracking-[0.2em] text-blue-600 uppercase mb-4">
            Expertise Técnica
          </span>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight transition-colors"
          >
            Soluções de <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Alta Precisão.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-slate-600 font-light max-w-xl mx-auto leading-relaxed transition-colors"
          >
            Com foco no Acre e Rondônia, garantimos a máxima disponibilidade do seu parque tecnológico através de intervenções exatas e em conformidade com as normas vigentes.
          </motion.p>

          {/* Indicador de Swipe (Apenas Mobile) */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-8 md:hidden text-slate-500 opacity-80"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Deslize para explorar</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <MoveRight size={16} />
            </motion.div>
          </motion.div>
        </div>

        {/* Grid de Serviços */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex md:grid md:grid-cols-2 gap-6 overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
        >
          {servicesData.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="w-[85vw] sm:w-[400px] md:w-auto shrink-0 snap-center bg-white p-8 md:p-10 border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-blue-100 transition-all duration-500 group relative overflow-hidden rounded-xl"
            >
              {/* Barra de destaque lateral (Minimalista Azul) */}
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />

              <div className="flex flex-col sm:flex-row items-start gap-6 md:gap-8">
                <div className="p-4 bg-slate-50 text-slate-500 group-hover:bg-blue-600 group-hover:text-white border border-slate-200 group-hover:border-blue-300 transition-colors duration-500 rounded-lg">
                  <service.icon size={32} strokeWidth={1} />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">{service.title}</h3>
                  <p className="text-slate-600 text-sm mb-8 leading-relaxed font-light transition-colors">
                    {service.description}
                  </p>

                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start md:items-center text-xs text-slate-600 font-medium tracking-wide transition-colors">
                        <Check size={14} strokeWidth={2} className="text-blue-500 mr-3 flex-shrink-0 mt-0.5 md:mt-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner Fim da Seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 lg:mt-20 bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-blue-300 p-6 md:p-14 flex flex-col lg:flex-row items-center justify-between relative overflow-hidden rounded-2xl transition-colors shadow-sm"
        >
          <div className="relative z-10 text-center lg:text-left mb-8 lg:mb-0 lg:max-w-xl">
            <h4 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Equipamento parado?</h4>
            <p className="text-slate-600 font-medium">Atendimento emergencial prioritário para clínicas da região.</p>
          </div>
          <a 
            href="https://wa.me/556999650890?text=Olá!%20Meu%20equipamento%20está%20parado%20e%20preciso%20de%20assistência%20urgente."
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest transition-all w-full lg:w-auto text-center rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.25)] hover:shadow-[0_0_20px_rgba(37,99,235,0.45)] cursor-pointer"
          >
            Falar no WhatsApp
          </a>
        </motion.div>

      </div>
    </section>
  );
}