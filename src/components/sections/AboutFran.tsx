import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ShieldCheck, HeartHandshake, Zap, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import teamAssistant from '../../assets/team_assistant.jpg';

type MobileTab = 'Fran' | 'Italo' | 'Valores';

export function AboutFran() {
  const [mobileTab, setMobileTab] = useState<MobileTab>('Fran');
  const [showFranStory, setShowFranStory] = useState(false);
  const [showItaloStory, setShowItaloStory] = useState(false);

  const credentials = [
    { icon: ShieldCheck, title: 'Suporte Oficial Samsung', desc: 'Certificação direta para toda a linha Samsung Ultrasound.' },
    { icon: Award, title: 'Laudo de Segurança Elétrica', desc: 'Conformidade técnica completa com as exigências da ANVISA (RDC).' },
    { icon: Zap, title: 'Pronto Atendimento AC & RO', desc: 'Suporte local ágil para clínicas e hospitais no Acre e Rondônia.' },
    { icon: HeartHandshake, title: 'Suporte Humanizado', desc: 'Atendimento direto, transparente e focado em resolver seu problema.' }
  ];

  return (
    <section className="py-12 lg:py-24 bg-[#030712] relative overflow-hidden" id="sobre">
      
      {/* Background Decorative Lights */}
      <div className="absolute top-[20%] right-[-15%] w-[400px] h-[400px] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-15%] w-[400px] h-[400px] rounded-full bg-blue-950/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12">
        
        {/* ========================================================================= */}
        {/* MOBILE VIEW (Interactive Tabs, Summarized Content)                        */}
        {/* ========================================================================= */}
        <div className="lg:hidden w-full">
          
          {/* Tab Toggles */}
          <div className="flex justify-center gap-1.5 mb-8 bg-[#0b1329]/40 border border-slate-900 rounded-full p-1 max-w-sm mx-auto">
            <button
              onClick={() => setMobileTab('Fran')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                mobileTab === 'Fran' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fran
            </button>
            <button
              onClick={() => setMobileTab('Italo')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                mobileTab === 'Italo' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ítalo
            </button>
            <button
              onClick={() => setMobileTab('Valores')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                mobileTab === 'Valores' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Compromisso
            </button>
          </div>

          {/* Active Tab Content */}
          <AnimatePresence mode="wait">
            {mobileTab === 'Fran' && (
              <motion.div
                key="fran"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center bg-[#0b1329]/20 border border-slate-900 rounded-2xl p-6 shadow-md"
              >
                {/* Photo */}
                <div className="w-28 h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner mb-4 relative">
                  <img
                    src="https://res.cloudinary.com/ddqrpidxw/image/upload/v1777794165/SaveClip.App_618717554_18164592940396912_8713182462197004780_n_fwuyiv.jpg"
                    alt="Fran"
                    className="w-full h-full object-cover object-[center_20%]"
                  />
                  <div className="absolute bottom-1 right-1 bg-blue-600/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                    15+ Anos
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white">Fran</h3>
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mt-1 mb-3">
                  Especialista Principal & Fundador
                </span>

                <p className="text-slate-300 font-light text-sm leading-relaxed mb-6">
                  Especialista credenciado Samsung, focado em engenharia de transdutores e placas eletrônicas de alta complexidade.
                </p>

                {/* Highlights list */}
                <ul className="w-full text-left space-y-3 mb-6 border-t border-slate-900/60 pt-4 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span>Engenharia aplicada a transdutores complexos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span>Diagnóstico sênior a nível de componente</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span>Atendimento prioritário em toda a região</span>
                  </li>
                </ul>

                {/* Collapsible Story Narrative */}
                <button
                  onClick={() => setShowFranStory(!showFranStory)}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 mb-2 cursor-pointer"
                >
                  {showFranStory ? 'Ocultar História' : 'Ler História Completa'}
                  {showFranStory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                <AnimatePresence>
                  {showFranStory && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden text-left text-slate-400 text-xs font-light leading-relaxed border-t border-slate-900/60 pt-4 mt-2 space-y-2.5"
                    >
                      <p>
                        Há mais de 15 anos, iniciei minha jornada com uma missão muito clara: garantir que médicos e clínicas em Rondônia e no Acre pudessem confiar plenamente em seus diagnósticos por imagem.
                      </p>
                      <p>
                        Como especialista credenciado Samsung, dediquei minha carreira a desvendar a engenharia de transdutores e placas eletrônicas. Ao longo dos anos, entendi que um ultrassom parado não representa apenas um prejuízo financeiro para a clínica — representa exames adiados e pacientes sem o diagnóstico de que precisam.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {mobileTab === 'Italo' && (
              <motion.div
                key="italo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center bg-[#0b1329]/20 border border-slate-900 rounded-2xl p-6 shadow-md"
              >
                {/* Photo */}
                <div className="w-28 h-36 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner mb-4 relative">
                  <img
                    src={teamAssistant}
                    alt="Ítalo Loran"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute bottom-1 right-1 bg-blue-600/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                    Suporte Campo
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white">Ítalo Loran</h3>
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase mt-1 mb-3">
                  Assistente Técnico de Ultrassom
                </span>

                <p className="text-slate-300 font-light text-sm leading-relaxed mb-6">
                  Auxiliar técnico responsável pelas revisões periódicas preventivas e conformidade de segurança elétrica (ANVISA).
                </p>

                {/* Highlights list */}
                <ul className="w-full text-left space-y-3 mb-6 border-t border-slate-900/60 pt-4 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span>Testes rigorosos de Segurança Elétrica (RDC)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span>Manutenções preventivas e higienizações internas</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span>Calibrações de imagem e testes de transdutores</span>
                  </li>
                </ul>

                {/* Collapsible Story Narrative */}
                <button
                  onClick={() => setShowItaloStory(!showItaloStory)}
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300 mb-2 cursor-pointer"
                >
                  {showItaloStory ? 'Ocultar História' : 'Ler História Completa'}
                  {showItaloStory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                <AnimatePresence>
                  {showItaloStory && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden text-left text-slate-400 text-xs font-light leading-relaxed border-t border-slate-900/60 pt-4 mt-2 space-y-2.5"
                    >
                      <p>
                        Treinado pessoalmente sob o rigoroso padrão de exigência de Fran, assumi o papel vital de cuidar das manutenções preventivas de rotina e dos testes minuciosos de conformidade técnica.
                      </p>
                      <p>
                        Com a nossa atuação conjunta, conseguimos acelerar os atendimentos em Rondônia e no Acre, liberando as clínicas de falhas inesperadas no dia a dia.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {mobileTab === 'Valores' && (
              <motion.div
                key="valores"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center bg-transparent w-full"
              >
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-white">Sinergia que gera confiança</h3>
                  <p className="text-slate-400 font-light text-xs mt-2 max-w-sm">
                    Trabalhamos sob uma única promessa: <strong>sua clínica não pode parar</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 w-full">
                  {credentials.map((cred, idx) => (
                    <div key={idx} className="flex gap-3.5 p-4 bg-[#0b1329]/20 border border-slate-900 rounded-xl text-left">
                      <div className="w-8 h-8 rounded-lg bg-blue-950/40 border border-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                        <cred.icon size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-0.5">{cred.title}</h4>
                        <p className="text-slate-400 text-[10px] font-light leading-relaxed">{cred.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <a 
                  href="https://wa.me/556999650890?text=Olá%20Fran%20e%20Ítalo!%20Gostaria%20de%20solicitar%20um%20suporte%20técnico."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 bg-blue-600 hover:bg-blue-500 text-white w-full py-3.5 text-xs font-bold uppercase tracking-wider transition-all rounded-md flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.25)] cursor-pointer"
                >
                  Falar com a Nossa Equipe <ArrowRight size={14} />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW (Rich Alternating Storytelling)                              */}
        {/* ========================================================================= */}
        <div className="hidden lg:block w-full">
          {/* Capitulo 1: O Início (Fran) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-24">
            {/* Coluna da Imagem (Esquerda) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 relative order-2 lg:order-1"
            >
              {/* Dark Styled Background Frame */}
              <div className="absolute -inset-4 bg-[#0b1329]/10 border border-slate-900 transform -rotate-2 z-0 hidden md:block rounded-3xl" />

              {/* Main Image */}
              <div className="relative z-10 aspect-[4/5] w-full bg-[#0b1329]/40 items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-slate-900">
                <img
                  src="https://res.cloudinary.com/ddqrpidxw/image/upload/v1777794165/SaveClip.App_618717554_18164592940396912_8713182462197004780_n_fwuyiv.jpg"
                  alt="Fran - Especialista Samsung"
                  className="object-cover object-[center_20%] w-full h-full filter brightness-90 contrast-105"
                />
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-6 -right-6 bg-blue-950/80 text-white p-6 shadow-2xl z-20 flex flex-col items-center justify-center rounded-xl border border-blue-500/20 backdrop-blur-md">
                <span className="text-4xl font-extrabold mb-0.5 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">15+</span>
                <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-blue-400 text-center leading-tight">
                  Anos de<br />Experiência
                </span>
              </div>
            </motion.div>

            {/* Coluna de Texto (Direita) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-center lg:text-left order-1 lg:order-2 flex flex-col items-center lg:items-start"
            >
              <span className="block text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-3">
                A Origem
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                Uma década de compromisso com a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">precisão.</span>
              </h2>

              <div className="space-y-4 text-slate-300 font-light text-base md:text-lg leading-relaxed text-left">
                <p>
                  Olá, sou o <strong className="text-white font-semibold">Fran</strong>. Há mais de 15 anos, iniciei minha jornada com uma missão muito clara: garantir que médicos e clínicas em Rondônia e no Acre pudessem confiar plenamente em seus diagnósticos por imagem.
                </p>
                <p>
                  Como especialista credenciado Samsung, dediquei minha carreira a desvendar a engenharia de transdutores e placas eletrônicas. Ao longo dos anos, entendi que um ultrassom parado não representa apenas um prejuízo financeiro para a clínica — representa exames adiados e pacientes sem o diagnóstico de que precisam.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Capitulo 2: O Crescimento e a Parceria (Italo) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mb-24">
            
            {/* Coluna de Texto (Esquerda) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start"
            >
              <span className="block text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-3">
                O Crescimento
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                Ítalo Loran: Rigor técnico e <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">suporte de campo.</span>
              </h2>

              <div className="space-y-4 text-slate-300 font-light text-base md:text-lg leading-relaxed text-left">
                <p>
                  Para atender à crescente demanda de clínicas da região mantendo a velocidade e a qualidade que sempre me definiram, percebi que precisava somar forças.
                </p>
                <p>
                  Foi assim que estruturei nossa equipe técnica, trazendo <strong className="text-white font-semibold">Ítalo Loran</strong> como assistente técnico de ultrassom. Treinado pessoalmente sob meu rigoroso padrão de exigência, Ítalo assumiu o papel vital de cuidar das manutenções preventivas de rotina, testes minuciosos de segurança elétrica (ANVISA/RDC), calibração detalhada de imagem e higienização interna de placas.
                </p>
                <p>
                  Com a chegada dele, duplicamos nossa capacidade de ação. Enquanto Ítalo assegura a estabilidade e a prevenção de falhas em campo, conseguimos coordenar diagnósticos complexos e reparos eletrônicos de placas a nível de componente em tempo recorde.
                </p>
              </div>
            </motion.div>

            {/* Coluna da Imagem (Direita) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 relative"
            >
              {/* Dark Styled Background Frame */}
              <div className="absolute -inset-4 bg-[#0b1329]/10 border border-slate-900 transform rotate-2 z-0 hidden md:block rounded-3xl" />

              {/* Main Image */}
              <div className="relative z-10 aspect-[4/5] w-full bg-[#0b1329]/40 items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-slate-900">
                <img
                  src={teamAssistant}
                  alt="Ítalo Loran - Assistente Técnico"
                  className="object-cover object-center w-full h-full filter brightness-95"
                />
              </div>

              {/* Role Badge */}
              <div className="absolute -bottom-6 -left-6 bg-blue-950/80 text-white p-5 shadow-2xl z-20 flex flex-col items-center justify-center rounded-xl border border-blue-500/20 backdrop-blur-md">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-400 text-center leading-tight">
                  Assistente<br />Técnico
                </span>
              </div>
            </motion.div>
          </div>

          {/* Capitulo 3: Nosso Compromisso Conjunto */}
          <div className="border-t border-slate-900/80 pt-16 max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="block text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-3">
                Valores Compartilhados
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                Sinergia que gera <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">confiança.</span>
              </h2>
              <p className="text-slate-400 font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Juntos, trabalhamos sob uma única promessa: <strong>sua clínica não pode parar</strong>. Oferecemos suporte completo com responsabilidade técnica e agilidade.
              </p>
            </div>

            {/* Grid de Credenciais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {credentials.map((cred, idx) => (
                <div key={idx} className="flex gap-4 p-6 bg-[#0b1329]/20 border border-slate-900 hover:border-blue-500/20 rounded-xl transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-blue-950/40 border border-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <cred.icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1.5">{cred.title}</h4>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">{cred.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA de Contato */}
            <div className="flex justify-center mt-16">
              <a 
                href="https://wa.me/556999650890?text=Olá%20Fran%20e%20Ítalo!%20Gostaria%20de%20solicitar%20um%20suporte%20técnico."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 text-xs font-bold uppercase tracking-wider transition-all rounded-md flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.25)] cursor-pointer"
              >
                Falar com a Nossa Equipe <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}