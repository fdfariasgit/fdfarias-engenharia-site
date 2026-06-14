import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Microchip, Monitor, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Equipment } from '../../types';
import { useState, useEffect, memo } from 'react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Equipment | null;
}

const TABS = [
  { id: 'overview', label: 'Visão Geral' },
  { id: 'tech', label: 'Inteligência Artificial' },
  { id: 'design', label: 'Ergonomia & Eco' },
  { id: 'images', label: 'Galeria de Imagens' }
] as const;

export const ProductModal = memo(function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tech' | 'design' | 'images'>('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Trava a rolagem do fundo (body) quando o modal estiver aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0); // Reset gallery index on open
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function para caso o componente seja desmontado
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!product) return null;

  const images = product.gallery || [product.imageUrl];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: "100%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 top-[5vh] md:inset-4 md:top-12 z-50 bg-[#050b14] border border-slate-900 rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header Fixo do Modal */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-900 bg-[#050b14] sticky top-0 z-10 transition-colors">
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-blue-400 block mb-1">
                  SAMSUNG ULTRASOUND
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">{product.name}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Corpo do Modal - Scrollável */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="flex flex-col lg:flex-row min-h-full">

                {/* Coluna Esquerda: Imagem e CTA */}
                <div className="w-full lg:w-2/5 bg-slate-950/40 p-8 lg:p-12 flex flex-col justify-between border-r border-slate-900 transition-colors">
                  <div>
                    {/* Galeria Interativa */}
                    <div className="relative aspect-square bg-slate-950 rounded-2xl flex items-center justify-center p-8 mb-8 border border-slate-900 shadow-inner overflow-hidden group">

                      {images.length > 1 && (
                        <>
                          <button onClick={handlePrevImage} className="absolute left-4 p-2 bg-slate-900/80 backdrop-blur-sm rounded-full text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-slate-850 border border-slate-850 cursor-pointer">
                            <ChevronLeft size={20} />
                          </button>
                          <button onClick={handleNextImage} className="absolute right-4 p-2 bg-slate-900/80 backdrop-blur-sm rounded-full text-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-slate-850 border border-slate-850 cursor-pointer">
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentImageIndex}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
                          drag={images.length > 1 ? "x" : false}
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.7}
                          onDragEnd={(_e, { offset }) => {
                            if (offset.x < -40) {
                              handleNextImage();
                            } else if (offset.x > 40) {
                              handlePrevImage();
                            }
                          }}
                        >
                          <img
                            src={images[currentImageIndex]}
                            alt={product.name}
                            className="w-full h-full object-contain pointer-events-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                          />
                        </motion.div>
                      </AnimatePresence>

                      {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${idx === currentImageIndex ? 'bg-blue-500' : 'bg-slate-700'}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{product.tagline}</h3>
                    <p className="text-slate-400 font-light leading-relaxed text-sm">
                      {product.description}
                    </p>
                  </div>

                  <a 
                    href={`https://wa.me/556999650890?text=${encodeURIComponent(`Olá! Gostaria de falar sobre o equipamento ${product.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 w-full bg-blue-600 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-blue-500 transition-colors text-center inline-block rounded-md shadow-[0_0_15px_rgba(37,99,235,0.25)] cursor-pointer"
                  >
                    Falar com Especialista
                  </a>
                </div>

                {/* Coluna Direita: Informações Técnicas Detalhadas */}
                <div className="w-full lg:w-3/5 p-8 lg:p-12 bg-[#050b14] transition-colors">

                  {/* Navegação de Abas (Tabs) */}
                  <div className="flex gap-8 border-b border-slate-900 mb-8 overflow-x-auto pb-4">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-colors relative cursor-pointer pb-2 ${activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                          }`}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Conteúdo das Abas */}
                  <div className="min-h-[400px]">
                    {activeTab === 'overview' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div>
                          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Monitor size={20} className="text-blue-500" /> Qualidade de Imagem Primorosa
                          </h4>
                          <div className="flex flex-col gap-6">
                            {product.fullFeatures?.imageQuality.map((feat, idx) => (
                              <div key={idx} className="bg-slate-950/40 rounded-2xl border border-slate-900 overflow-hidden shadow-sm flex flex-col xl:flex-row">
                                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                                  <h5 className="text-xl md:text-2xl font-bold text-white mb-3">{feat.title}</h5>
                                  <p className="text-slate-300 font-light leading-relaxed mb-6 text-sm">{feat.description}</p>

                                  {feat.disclaimer && (
                                    <p className="text-slate-500 text-xs italic mt-auto pt-4">{feat.disclaimer}</p>
                                  )}
                                </div>

                                {feat.imageUrl && (
                                  <div className="w-full xl:w-5/12 bg-slate-950 border-t xl:border-t-0 xl:border-l border-slate-900 relative h-48 sm:h-64 xl:h-auto xl:min-h-[260px] shrink-0">
                                    <img src={feat.imageUrl} alt={feat.title} className="object-cover object-center w-full h-full opacity-90 absolute inset-0" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'tech' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div>
                          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Microchip size={20} className="text-blue-500" /> Precisão Diagnóstica com IA
                          </h4>
                          <ul className="space-y-4">
                            {product.fullFeatures?.aiEfficiency.map((feat, idx) => (
                              <li key={idx} className="bg-slate-950/40 p-6 rounded-xl border border-slate-900">
                                <strong className="block text-white text-sm mb-1">{feat.title}</strong>
                                <span className="text-slate-300 text-sm font-light leading-relaxed">{feat.description}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'design' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div>
                          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Leaf size={20} className="text-blue-500" /> Sustentabilidade e Design
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {product.fullFeatures?.ergonomics.map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-3 p-4 bg-slate-950/40 border border-slate-900 rounded-lg">
                                <Check size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="block text-white text-xs uppercase tracking-wider mb-1">{feat.title}</strong>
                                  <span className="text-slate-300 text-sm font-light">{feat.description}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'images' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        <div>
                          <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            Galeria de Imagens
                          </h4>
                          <div className="flex flex-col gap-6">
                            {product.diagnosticImages && product.diagnosticImages.length > 0 ? (
                              product.diagnosticImages.map((img, idx) => (
                                <div key={idx} className="bg-[#050b14] rounded-xl overflow-hidden border border-slate-900 group shadow-sm hover:shadow-md transition-shadow">
                                  <div className="relative overflow-hidden bg-slate-950 flex items-center justify-center min-h-[300px]">
                                    <img src={img.url} alt={img.caption || `Galeria de Imagens ${idx + 1}`} className="object-contain w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-102 transition-all duration-700" />
                                  </div>
                                  {img.caption && (
                                    <div className="p-4 bg-slate-950 border-t border-slate-900">
                                      <span className="block text-xs font-bold text-white uppercase tracking-wide text-center">{img.caption}</span>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="col-span-full p-12 text-center bg-slate-950/40 rounded-2xl border border-slate-900">
                                <p className="text-slate-400 font-light">Banco de imagens em atualização para este equipamento.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});