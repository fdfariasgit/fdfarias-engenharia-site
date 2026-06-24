import { useState, useEffect } from 'react';
import { AboutFran } from '../components/sections/AboutFran';
import { cmsService } from '../services/cmsService';
import type { CmsContent } from '../types';

export function AboutPage() {
  const [content, setContent] = useState<CmsContent | null>(null);

  useEffect(() => {
    cmsService.getById('about_page').then(data => {
      if (data) setContent(data);
    }).catch(err => console.error('Error fetching about cms:', err));
  }, []);

  const title = content?.title || 'Nossa História';
  const text = content?.text || 'Conheça mais sobre a trajetória da FD Farias - Engenharia Hospitalar e nosso compromisso com a excelência em diagnóstico por imagem.';

  return (
    <main className="pt-28 lg:pt-40 pb-16 bg-white">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight whitespace-pre-line">{title}</h1>
        <p className="text-slate-600 mt-4 max-w-2xl mx-auto whitespace-pre-line">{text}</p>
      </div>
      <AboutFran />
    </main>
  );
}
