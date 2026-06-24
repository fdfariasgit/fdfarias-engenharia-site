import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Equipment } from '../../types';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Equipment[];
}

export function CompareModal({ isOpen, onClose, products }: CompareModalProps) {
  if (products.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, y: "100%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 md:inset-8 md:top-12 z-50 bg-white  md:rounded-3xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100  bg-white  sticky top-0 z-10">
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400  block mb-1">
                  Comparador Exclusivo
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900  tracking-tight">Comparação de Modelos</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-slate-50  hover:bg-slate-100  rounded-full text-slate-500  hover:text-slate-900  transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Corpo do Comparador */}
            <div className="flex-1 overflow-y-auto overflow-x-auto p-8 lg:p-12">
              <div className="min-w-[700px] grid grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="flex flex-col bg-slate-50  rounded-2xl p-6 border border-slate-100 ">
                    <div className="aspect-square bg-white  rounded-xl mb-6 flex items-center justify-center p-4">
                      {/* Imagem placeholder, usar a original dps */}
                      <div className="w-24 h-24 bg-slate-100  animate-pulse rounded-lg"></div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500  mb-1">{product.category}</span>
                    <h3 className="text-2xl font-bold text-slate-900  mb-2">{product.name}</h3>
                    <p className="text-sm text-slate-600  mb-6 flex-grow">{product.tagline}</p>
                    

                    <button className="mt-8 w-full bg-slate-900  text-white  py-4 text-xs font-bold uppercase tracking-widest hover:bg-slate-800  transition-colors rounded-lg">
                      Solicitar Orçamento
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
