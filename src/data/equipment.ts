import type { Equipment } from '../types';

export const equipmentData: Equipment[] = [
  {
    id: 'hera-z20',
    name: 'HERA Z20',
    category: 'premium',
    tagline: 'Empoderamento feminino através da melhor imagem',
    description: 'O HERA Z20 é inspirado pelo espírito de hospitalidade e proteção, representado na palavra grega "Zena"[cite: 1]. Oferece imagens 2D, 3D e de Doppler colorido personalizadas para atender a cada necessidade individual[cite: 1].',
    // Imagem principal (aparece no Catálogo e como capa do Equipamento)
    imageUrl: 'https://res.cloudinary.com/ddqrpidxw/image/upload/v1777907907/Captura_de_tela_2026-05-04_115832_ogvfdy.png',

    // Galeria de imagens do equipamento (aparece no canto esquerdo do Modal)
    gallery: [
      'https://res.cloudinary.com/ddqrpidxw/image/upload/v1777907907/Captura_de_tela_2026-05-04_115832_ogvfdy.png',
      'https://res.cloudinary.com/ddqrpidxw/image/upload/v1777908508/Captura_de_tela_2026-05-04_122810_lt4lqz.png',
      'https://res.cloudinary.com/ddqrpidxw/image/upload/v1777907907/Captura_de_tela_2026-05-04_120323_bcoz5p.png',
    ],

    // Imagens da aba "Galeria de Imagens"
    diagnosticImages: [
      {
        // Imagem única da galeria
        url: 'https://res.cloudinary.com/ddqrpidxw/image/upload/v1777911447/Captura_de_tela_2026-05-04_131708_dstvsi.png',
        caption: 'Galeria de Imagens HERA Z20'
      }
    ],
    highlights: ['Crystal Architecture™', 'Monitor OLED de 27"', 'Recursos de IA integrados'],
    fullFeatures: {
      imageQuality: [
        {
          title: 'Restaurar regiões borradas ou obscurecidas da face fetal',
          description: 'PortraitVue™ é um recurso preditivo de análise de imagens volumétricas usado para recriar da forma mais fiel a face fetal, restaurando virtualmente partes borradas ou obscurecidas.',
          // Imagem que ilustra essa feature (ex: O rosto do feto borrado e restaurado)
          imageUrl: 'https://res.cloudinary.com/ddqrpidxw/image/upload/v1777908824/Captura_de_tela_2026-05-04_123310_dcwocz.png',
          disclaimer: '*Este recurso não tem finalidade diagnóstica, mas sim de apelo emocional para a gestante.'
        },
        {
          title: 'Crystal Architecture™ de segunda geração',
          description: 'A arquitetura de imagem de última geração combina os pontos fortes das tecnologias CrystalBeam™ e CrystalLive™ com os transdutores S-Vue™ para imagens cristalinas.',
          // Imagem que ilustra essa feature
          imageUrl: 'https://res.cloudinary.com/ddqrpidxw/image/upload/v1777909156/Captura_de_tela_2026-05-04_123842_ktd9xz.png'
        },
        {
          title: 'RealisticVue™ e CrystalVue™',
          description: 'Exibe anatomia 3D de alta resolução com percepção de profundidade realista e melhora a visualização de estruturas internas.',
          // Imagem que ilustra essa feature
          imageUrl: 'https://res.cloudinary.com/ddqrpidxw/image/upload/v1777909156/Captura_de_tela_2026-05-04_123645_iptm2f.png'
        }
      ],
      aiEfficiency: [
        {
          title: 'Integração de Inteligência Artificial',
          description: 'Recursos integrados de IA automatizados aumentam a precisão e a eficiência do diagnóstico, permitindo foco no paciente[cite: 1].'
        },
        {
          title: 'EzVolume™ e Uterine Assist™',
          description: 'Segmentação automática de estruturas do feto em 3D e medição automática do tamanho e formato do útero[cite: 1].'
        },
        {
          title: 'BiometryAssist™ e HeartAssist™',
          description: 'Medição automática da biometria fetal e ferramenta de relatórios para diagnóstico cardíaco fetal[cite: 1].'
        }
      ],
      ergonomics: [
        {
          title: 'Display Premium',
          description: 'Monitor OLED de 27" com reprodução intensa de preto e Tela de toque de 15.6" inclinável[cite: 1].'
        },
        {
          title: 'Design Sustentável',
          description: '50% de resina reciclada aplicada à carenagem do sistema e embalagem de papel 100% ecológico[cite: 1].'
        },
        {
          title: 'Conforto e Eficiência',
          description: 'Amplo espaço para os joelhos, iluminação LED emocional e solução SonoSync™ para compartilhamento de imagens em tempo real[cite: 1].'
        }
      ]
    }
  },
  {
    id: 'v8',
    name: 'V8',
    category: 'premium',
    tagline: 'Step up confidence',
    description: 'Inteligência e atuação unificada para diagnósticos de alto nível.',
    imageUrl: 'https://res.cloudinary.com/ddqrpidxw/image/upload/v1777911763/Captura_de_tela_2026-05-04_131954_kbrezl.png',
    highlights: ['IA Integrada', 'Fluxo de trabalho otimizado', 'S-Vue Transducer™']
  },
  {
    id: 'v6',
    name: 'V6',
    category: 'intermediario',
    tagline: 'Inspirando eficiência diária',
    description: 'Inspirando eficiência diária com sofisticação acessível.',
    imageUrl: 'https://res.cloudinary.com/ddqrpidxw/image/upload/v1777911763/Captura_de_tela_2026-05-04_132058_mhet2v.png',
    highlights: ['Design Compacto', 'Excelente custo-benefício', 'Automação de medidas']
  },
  {
    id: 'hm70-evo',
    name: 'HM70 EVO',
    category: 'portatil',
    tagline: 'Excelência em mobilidade',
    description: 'Excelência em mobilidade para imagens de alta qualidade.',
    imageUrl: 'https://res.cloudinary.com/ddqrpidxw/image/upload/v1777911862/Captura_de_tela_2026-05-04_132403_rfysly.png',
    highlights: ['Bateria de longa duração', 'Inicialização rápida', 'Design robusto']
  }
];