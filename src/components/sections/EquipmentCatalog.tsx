import { useState, useMemo, useCallback, lazy, Suspense, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MoveRight, MessageCircle } from 'lucide-react';
import { equipmentData } from '../../data/equipment';
import type { Category, Equipment } from '../../types';

// Lazy loading dos modais
const ProductModal = lazy(() => import('../ui/ProductModal').then(module => ({ default: module.ProductModal })));

// Helpers para estilização dinâmica dos badges
const getBadgeStyles = (category: string) => {
  switch (category.toLowerCase()) {
    case 'premium':
      return 'bg-[#FF402B]/25 border-[#FF402B]/50 text-[#FF402B]';
    case 'intermediario':
      return 'bg-[#EAFF2B]/25 border-[#EAFF2B]/50 text-[#EAFF2B]';
    case 'portatil':
    default:
      return 'bg-blue-950/95 border-blue-500/50 text-blue-400';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category.toLowerCase()) {
    case 'premium':
      return 'Premium';
    case 'intermediario':
      return 'Intermediário';
    case 'portatil':
      return 'Portátil';
    default:
      return category;
  }
};

// Componente do card extraído
const EquipmentCard = memo(function EquipmentCard({ 
  item, 
  onOpenModal 
}: { 
  item: Equipment; 
  onOpenModal: (product: Equipment) => void; 
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="w-[85vw] sm:w-[400px] md:w-auto shrink-0 snap-center group flex flex-col h-full rounded-2xl p-6 border transition-all duration-500 relative bg-[#0b1329]/30 border-slate-900 hover:border-blue-500/30 text-white"
    >
      <div 
        onClick={() => onOpenModal(item)}
        className="aspect-video w-full bg-slate-950/60 mb-6 flex items-center justify-center overflow-hidden relative rounded-xl border border-slate-900 p-4 cursor-pointer"
      >
        <div className={`absolute top-2 left-2 px-2 py-1 border text-[0.6rem] font-bold uppercase tracking-widest rounded-md z-10 ${getBadgeStyles(item.category)}`}>
          {getCategoryLabel(item.category)}
        </div>
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
        />
      </div>

      <div className="flex-grow flex flex-col cursor-pointer" onClick={() => onOpenModal(item)}>
        <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">{item.name}</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed font-light line-clamp-2">{item.description}</p>
      </div>

      <div className="flex flex-col gap-3 mt-auto">
        <a 
          href={`https://wa.me/556999650890?text=Olá!%20Gostaria%20de%20saber%20o%20preço%20e%20condições%20do%20ultrassom%20${encodeURIComponent(item.name)}.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <MessageCircle size={16} /> Consultar Preço
        </a>
        <button
          onClick={() => onOpenModal(item)}
          className="flex items-center justify-center w-full text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 font-bold text-xs uppercase tracking-widest py-3 px-4 rounded-lg transition-colors cursor-pointer"
        >
          <span>Ver Especificações</span>
        </button>
      </div>
    </motion.div>
  );
});

export function EquipmentCatalog() {
  const [activeFilter, setActiveFilter] = useState<Category | 'todos'>('todos');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Estados do Modal de Produto
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Equipment | null>(null);

  const filteredEquipment = useMemo(() => {
    return equipmentData.filter(
      (item) => activeFilter === 'todos' || item.category === activeFilter
    );
  }, [activeFilter]);

  const displayedEquipment = isExpanded ? filteredEquipment : filteredEquipment.slice(0, 3);

  const filters = useMemo(() => [
    { id: 'todos', label: 'Todos' },
    { id: 'premium', label: 'Premium' },
    { id: 'intermediario', label: 'Alta Eficiência' },
    { id: 'portatil', label: 'Portáteis' },
  ], []);

  const handleOpenModal = useCallback((product: Equipment) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-[#030712] relative transition-colors border-t border-slate-900" id="catalogo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="block text-xs font-bold tracking-[0.2em] text-blue-400 uppercase mb-4">
            Catálogo de Vendas
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Equipamentos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-sky-400">Alta Performance.</span>
          </h2>
          <p className="text-lg text-slate-400 font-light">
            Sistemas de ultrassom novos e seminovos com as melhores condições de pagamento do mercado.
          </p>
        </div>

        {/* Filtros Minimalistas */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => {
                setActiveFilter(filter.id as Category | 'todos');
                setIsExpanded(false); // Reset expansion on filter change
              }}
              className={`px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-full cursor-pointer ${
                activeFilter === filter.id
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.25)]'
                : 'bg-[#0b1329]/40 text-slate-400 hover:text-white border border-slate-900 hover:border-slate-800'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Indicador de Swipe (Apenas Mobile) - Below Filters */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-8 md:hidden text-slate-500 opacity-80"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Deslize para explorar</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <MoveRight size={16} />
          </motion.div>
        </motion.div>

        {/* Grid de Produtos Animado */}
        <motion.div
          layout
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
        >
          <AnimatePresence mode="popLayout">
            {displayedEquipment.map((item) => (
              <EquipmentCard 
                key={item.id} 
                item={item} 
                onOpenModal={handleOpenModal} 
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Botão Expandir / Ver Todos */}
        {!isExpanded && filteredEquipment.length > 3 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-transparent border-2 border-slate-800 hover:border-blue-500/50 hover:bg-blue-600/10 text-slate-300 hover:text-white px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all rounded-full flex items-center gap-2 cursor-pointer"
            >
              Ver Catálogo Completo <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <Suspense fallback={null}>
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      </Suspense>
    </section>
  );
}