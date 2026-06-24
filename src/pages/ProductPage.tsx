import { useState, useRef, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageCircle, ArrowLeft, Shield, Award, CheckCircle2, Download, Share2, Loader2 } from 'lucide-react';
import { equipmentService } from '../services/equipmentService';
import type { Equipment } from '../types';

function RelatedProductCard({ item }: { readonly item: Equipment }) {
  return (
    <Link 
      to={`/produto/${item.id}`} 
      onClick={() => window.scrollTo(0, 0)}
      className="min-w-[140px] max-w-[140px] md:min-w-[180px] md:max-w-[180px] shrink-0 snap-start group flex flex-col"
    >
      <div className="bg-white p-3 rounded-xl border border-slate-200 mb-3 aspect-square flex items-center justify-center relative overflow-hidden shadow-sm group-hover:border-blue-300 transition-colors">
        <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" />
      </div>
      <h4 className="text-sm text-blue-600 group-hover:text-blue-500 group-hover:underline font-medium line-clamp-2 leading-tight mb-1">
        {item.name} - {item.tagline}
      </h4>
      <div className="text-slate-900 font-bold text-base md:text-lg mt-auto pt-1">
        Valor sob consulta
      </div>
    </Link>
  );
}

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Equipment | null>(null);
  const [allEquipment, setAllEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (id) {
          const fetchedProduct = await equipmentService.getById(id);
          if (fetchedProduct?.status === 'deleted') {
            setProduct(null);
          } else {
            setProduct(fetchedProduct || null);
          }
        }
        const fetchedAll = await equipmentService.getAll();
        setAllEquipment(fetchedAll);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);


  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'FD Farias',
        text: product?.tagline || '',
        url: globalThis.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(globalThis.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const { scrollYProgress } = useScroll();
  const bottomBarY = useTransform(scrollYProgress, [0, 0.1], [100, 0]);
  const bottomBarOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const width = container.offsetWidth;
    if (width <= 0) return;
    const scrollLeft = container.scrollLeft;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeImageIndex) {
      setActiveImageIndex(newIndex);
    }
  };

  const scrollToImage = (index: number) => {
    setActiveImageIndex(index);
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/" replace />;
  }

  const images = product.gallery && product.gallery.length > 0 
    ? [product.imageUrl, ...product.gallery] 
    : [product.imageUrl];

  const productUrl = typeof globalThis === 'undefined' ? '' : globalThis.location.href;
  const whatsappMessage = `Olá! Gostaria de solicitar um orçamento para o ultrassom ${product.name}.\n\nAcesse: ${productUrl}`;
  const whatsappLink = `https://wa.me/556999650890?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-screen bg-slate-50 pt-28 lg:pt-40 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        <Link to="/#catalogo" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-6 transition-colors text-sm font-bold tracking-widest uppercase">
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Catálogo
        </Link>

        {/* Produto: Cabeçalho (Mobile First: Texto Acima da Imagem) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-12 text-center"
        >
          <div className="inline-block mx-auto px-3 py-1 bg-blue-100 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest rounded-full w-max mb-6">
            {product.category}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {product.name}
          </h1>
          
          <p className="text-lg md:text-xl text-blue-600 font-medium max-w-3xl mx-auto">
            {product.tagline}
          </p>
        </motion.div>

        {/* Produto: Corpo (Imagem e Compra) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 mb-20">
          
          {/* Coluna Esquerda: Galeria de Imagens */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4"
          >
            {/* Imagem Principal (Sem caixa ao redor, apenas o carrossel com rolagem suave nativa) */}
            <div className="overflow-hidden min-h-[300px] md:min-h-[400px] lg:min-h-[500px] flex items-center justify-center relative w-full">
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scroll-smooth custom-scrollbar"
              >
                {images.map((img, idx) => (
                  <div key={img} className="w-full h-full flex items-center justify-center shrink-0 snap-center p-2">
                    <img 
                      src={img} 
                      alt={`${product.name} - View ${idx + 1}`} 
                      className="max-w-full max-h-[300px] md:max-h-[400px] lg:max-h-[500px] object-contain pointer-events-none select-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Indicadores estilo Amazon (Dots no centro, Ações na direita) */}
            {images.length > 1 && (
              <div className="relative flex items-center justify-center py-4 px-2">
                {/* Centered Dots */}
                <div className="flex gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={img}
                      onClick={() => scrollToImage(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeImageIndex 
                          ? 'bg-blue-500 scale-110 shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
                          : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                {/* Right side actions (Share) */}
                <div className="absolute right-2 flex items-center gap-4 text-slate-500">

                  <div className="relative p-1">
                    <button 
                      onClick={handleShare}
                      className="hover:text-blue-400 transition-colors cursor-pointer"
                      title="Compartilhar"
                    >
                      <Share2 size={20} />
                    </button>
                    {copied && (
                      <span className="absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-white border border-slate-200 text-[10px] text-blue-600 rounded-md shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-1 duration-200">
                        Link copiado!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Coluna Direita: Informações e Compra */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center lg:justify-start"
          >
            
            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-8">
              <div className="bg-white p-3 lg:p-4 rounded-xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                <span className="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Marca</span>
                <span className="text-xs lg:text-sm font-bold text-slate-900">{product.brand}</span>
              </div>
              <div className="bg-white p-3 lg:p-4 rounded-xl border border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
                <span className="text-[9px] lg:text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Categoria</span>
                <span className="text-xs lg:text-sm font-bold text-slate-900 capitalize">{product.category}</span>
              </div>
            </div>

            {/* Preço em Destaque */}
            <div className="bg-white border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-[20px] p-6 lg:p-8 mb-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-sky-400"></div>
              
              <div className="mb-6">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight text-center">
                  Valor sob consulta
                </div>
              </div>

              <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-100 mb-8">
                <ul className="space-y-3.5">
                  <li className="flex items-center text-sm font-semibold text-slate-700">
                    <CheckCircle2 size={18} className="text-blue-500 mr-3 shrink-0" /> Condições de pagamento facilitadas
                  </li>
                  <li className="flex items-center text-sm font-semibold text-slate-700">
                    <CheckCircle2 size={18} className="text-blue-500 mr-3 shrink-0" /> Recebemos seu seminovo na troca
                  </li>
                  <li className="flex items-center text-sm font-semibold text-slate-700">
                    <CheckCircle2 size={18} className="text-blue-500 mr-3 shrink-0" /> Suporte técnico especializado
                  </li>
                  <li className="flex items-center text-sm font-semibold text-slate-700">
                    <CheckCircle2 size={18} className="text-blue-500 mr-3 shrink-0" /> Atendimento consultivo
                  </li>
                </ul>
              </div>

              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm md:text-base uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 h-14 md:h-16 mb-4"
              >
                <MessageCircle size={22} /> Solicitar Orçamento
              </a>
              
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-green-500 mr-1.5" /> Atendimento via WhatsApp
                </div>
                <div className="flex items-center text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <CheckCircle2 size={14} className="text-green-500 mr-1.5" /> Resposta rápida em horário comercial
                </div>
              </div>
            </div>

            {/* Descrição do Produto */}
            <div className="mb-10 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-4 tracking-tight text-center">Sobre o Equipamento</h3>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed font-light whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Baixar Catálogo e Garantias */}
            <div className="flex flex-col gap-6">
              {product.pdfUrl && (
                <a 
                  href={product.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm uppercase tracking-widest py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-3"
                >
                  <Download size={20} /> Baixar Catálogo Completo
                </a>
              )}
              
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="flex flex-col items-center justify-center gap-2 text-slate-700 bg-white p-4 rounded-xl border border-slate-200 text-center">
                  <Shield className="text-blue-500 shrink-0" size={24} />
                  <span className="text-[10px] md:text-xs font-bold uppercase">Garantia FD Farias</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 text-slate-700 bg-white p-4 rounded-xl border border-slate-200 text-center">
                  <Award className="text-blue-500 shrink-0" size={24} />
                  <span className="text-[10px] md:text-xs font-bold uppercase">Equipamento Certificado</span>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        {/* Produtos Relacionados (Estilo Amazon) */}
        {allEquipment.length > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-t border-slate-200 pt-12 pb-8"
          >
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
              Clientes que visualizaram este item também visualizaram
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-6 snap-x custom-scrollbar">
              {allEquipment.filter(i => i.id !== product.id).map(item => (
                <RelatedProductCard key={item.id} item={item} />
              ))}
            </div>
          </motion.div>
        )}

      </div>
      
      {/* Sticky Bottom Bar */}
      <motion.div
        style={{ y: bottomBarY, opacity: bottomBarOpacity }}
        className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] z-40 px-4 py-3 md:py-4 pointer-events-auto"
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:flex flex-col">
            <div className="text-xl font-black text-slate-900">Valor sob consulta</div>
          </div>
          <div className="flex md:hidden flex-col justify-center">
            <div className="text-lg font-black text-slate-900 leading-none">Valor sob consulta</div>
          </div>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none md:min-w-[280px] bg-green-600 hover:bg-green-500 text-white font-bold text-[11px] md:text-xs uppercase tracking-widest py-3.5 px-6 rounded-lg transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.45)] flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Solicitar Orçamento
          </a>
        </div>
      </motion.div>

    </main>
  );
}
