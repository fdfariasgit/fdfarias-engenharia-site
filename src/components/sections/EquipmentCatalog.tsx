import { useState, useMemo, memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MoveRight, ShoppingCart, Loader2 } from 'lucide-react';
import { equipmentService } from '../../services/equipmentService';
import type { Equipment } from '../../types';

// Componente do card
const EquipmentCard = memo(function EquipmentCard({ item, compact = false }: { item: Equipment, compact?: boolean }) {
  if (compact) {
    return (
      <Link 
        to={`/produto/${item.id}`}
        className="group flex flex-col h-full rounded-xl p-3 md:p-4 border transition-all duration-500 bg-white border-blue-100 text-slate-900 w-full shadow-[0_5px_20px_rgba(0,162,255,0.12)] hover:shadow-[0_8px_30px_rgba(0,162,255,0.2)] hover:-translate-y-1 relative overflow-hidden"
      >
        <div className="aspect-square w-full bg-blue-50/30 mb-4 flex items-center justify-center overflow-hidden relative rounded-lg border border-blue-200/50 p-2 shadow-[inset_0_2px_15px_rgba(0,162,255,0.08)] group-hover:bg-blue-50/60 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/40 to-transparent opacity-100 rounded-lg z-0 pointer-events-none"></div>
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 relative z-10" 
          />
        </div>

        <div className="flex-grow flex flex-col relative z-10">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2">{item.name}</h3>
            <span className="px-2 py-0.5 bg-slate-900 text-white shadow-sm text-[0.55rem] font-black uppercase tracking-widest rounded shrink-0">
              {item.brand}
            </span>
          </div>
          
          <div className="mt-auto pt-2">
            <div className="text-base md:text-lg font-bold text-slate-900 leading-tight">
              Valor sob consulta
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="w-[85vw] sm:w-[400px] md:w-auto shrink-0 snap-center group flex flex-col h-full rounded-2xl p-6 border transition-all duration-500 relative bg-white border-blue-100 text-slate-900 shadow-[0_8px_30px_rgba(0,162,255,0.15)] hover:shadow-[0_15px_40px_rgba(0,162,255,0.25)] hover:border-blue-300 hover:-translate-y-2 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-blue-50/80 opacity-100 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0 rounded-2xl"></div>
      <Link to={`/produto/${item.id}`} className="block aspect-video w-full bg-blue-50/40 mb-6 flex items-center justify-center overflow-hidden relative rounded-xl border border-blue-200/60 p-4 shadow-[inset_0_4px_25px_rgba(0,162,255,0.08)] group-hover:bg-blue-50/70 group-hover:border-blue-300 transition-colors duration-500 z-10">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 relative z-10" 
        />
      </Link>

      <div className="flex-grow flex flex-col relative z-10">
        <Link to={`/produto/${item.id}`} className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight hover:text-blue-600 transition-colors">{item.name}</h3>
          <span className="px-2.5 py-1 bg-slate-900 text-white shadow-md text-[0.65rem] font-black uppercase tracking-widest rounded-md shrink-0 mt-1">
            {item.brand}
          </span>
        </Link>
        <p className="text-slate-600 text-sm mb-4 leading-relaxed font-light line-clamp-2">{item.description}</p>
        
        <div className="mt-auto mb-6">
          <div className="text-3xl font-bold text-slate-900">
            Valor sob consulta
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <Link
          to={`/produto/${item.id}`}
          className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] gap-2"
        >
          <ShoppingCart size={16} /> Ver Detalhes e Comprar
        </Link>
      </div>
    </motion.div>
  );
});

export function EquipmentCatalog() {
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeBrandFilter, setActiveBrandFilter] = useState<string>('todas');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await equipmentService.getAll();
      setEquipmentData(data);
    } catch (error) {
      console.error('Erro ao carregar equipamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = useMemo(() => {
    return equipmentData.filter((item) => {
      const matchCategory = item.category !== 'acessorio';
      const matchBrand = activeBrandFilter === 'todas' ? true : item.brand === activeBrandFilter;
      return matchCategory && matchBrand;
    });
  }, [activeBrandFilter, equipmentData]);

  const carouselItems = filteredEquipment.slice(0, 3);
  const otherItems = filteredEquipment.slice(3);

  // Todas as marcas disponíveis (excluindo acessórios para a lista principal)
  const allBrands = useMemo(() => {
    const items = equipmentData.filter(item => item.category !== 'acessorio');
    const brands = new Set(items.map(item => item.brand));
    return ['todas', ...Array.from(brands)];
  }, [equipmentData]);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-slate-50 flex items-center justify-center min-h-[600px]" id="catalogo">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-slate-50 relative transition-colors border-t border-slate-200" id="catalogo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="block text-xs font-bold tracking-[0.2em] text-blue-600 uppercase mb-4">
            Catálogo de Vendas
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Equipamentos em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Destaque.</span>
          </h2>
        </div>

        {/* Filtros Principais (Agora são as Marcas) */}
        {allBrands.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {allBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => {
                  setActiveBrandFilter(brand);
                  setIsExpanded(false);
                }}
                className={`px-6 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-full cursor-pointer ${
                  activeBrandFilter === brand
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.25)]'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {brand === 'todas' ? 'Todas as Marcas' : brand}
              </button>
            ))}
          </div>
        )}

        {/* Indicador de Swipe (Apenas Mobile) */}
        {carouselItems.length > 0 && (
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
        )}

        {/* Carrossel Principal (Os primeiros equipamentos) */}
        {carouselItems.length > 0 ? (
          <motion.div
            layout
            className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
          >
            <AnimatePresence mode="popLayout">
              {carouselItems.map((item) => (
                <EquipmentCard 
                  key={item.id} 
                  item={item} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            Nenhum equipamento cadastrado no momento.
          </div>
        )}

        {/* Grade 2 Colunas para o restante (Os Outros) */}
        {otherItems.length > 0 && (
          <>
            {isExpanded ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 pt-4 border-t border-slate-200"
              >
                {otherItems.map((item) => (
                  <EquipmentCard 
                    key={item.id} 
                    item={item} 
                    compact 
                  />
                ))}
              </motion.div>
            ) : (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="bg-transparent border-2 border-slate-300 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-slate-900 px-8 py-4 font-bold text-sm uppercase tracking-widest transition-all rounded-full flex items-center gap-2 cursor-pointer"
                >
                  Ver Todos os Equipamentos <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* Acessórios e Transdutores (Estilo Amazon) */}
        {equipmentData.some(item => item.category === 'acessorio') && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-t border-slate-200 mt-16 pt-12"
          >
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
              Acessórios e Transdutores Recomendados
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x custom-scrollbar">
              {equipmentData.filter(i => i.category === 'acessorio').map(item => (
                <div key={item.id} className="min-w-[160px] md:min-w-[200px] snap-start">
                  <EquipmentCard item={item} compact />
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}