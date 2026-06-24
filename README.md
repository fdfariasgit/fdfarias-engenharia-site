# FD Farias Engenharia Clínica — Portal & Catálogo de Ultrassom

[![Vite](https://img.shields.io/badge/Vite-8.0-blueviolet?style=for-the-badge&logo=vite)](https://vite.dev/)
[![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

Portal web institucional da **FD Farias Engenharia Clínica**, contendo catálogo interativo de equipamentos médicos e ultrassons, suporte técnico integrado com abertura de chamados, e um painel de administração integrado (CMS) para gestão completa de conteúdo e banco de dados.

---

## 🛠️ Tecnologias Utilizadas

- **Front-end**: React 19, TypeScript, Vite, Tailwind CSS 4.
- **Transições e Efeitos**: Framer Motion (animações fluidas), Lenis Scroll (rolagem suave).
- **Ícones**: Lucide React.
- **Backend-as-a-Service (BaaS)**: Firebase
  - **Firestore**: Banco de dados não relacional (NoSQL) em tempo real.
  - **Firebase Authentication**: Autenticação segura da área de administração.
  - **Firebase Hosting**: Servidor de hospedagem do site.
- **Mídia**: Cloudinary (armazenamento e otimização de imagens de produtos).

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 18 ou superior recomendada)
- Gerenciador de pacotes **npm** (incluso com o Node.js)

### Instruções
1. Navegue até a pasta do projeto:
   ```bash
   cd fran-ultrassom
   ```
2. Instale todas as dependências requeridas:
   ```bash
   npm install
   ```
3. Copie ou configure as variáveis de ambiente locais do Firebase no arquivo `.env.local` na raiz da pasta `fran-ultrassom/`:
   ```env
   VITE_FIREBASE_API_KEY="Sua_API_Key"
   VITE_FIREBASE_AUTH_DOMAIN="Seu_Auth_Domain"
   VITE_FIREBASE_PROJECT_ID="Seu_Project_ID"
   VITE_FIREBASE_STORAGE_BUCKET="Seu_Storage_Bucket"
   VITE_FIREBASE_MESSAGING_SENDER_ID="Seu_Sender_ID"
   VITE_FIREBASE_APP_ID="Seu_App_ID"
   VITE_FIREBASE_MEASUREMENT_ID="Seu_Measurement_ID"

   VITE_CLOUDINARY_CLOUD_NAME="Seu_Cloud_Name"
   VITE_CLOUDINARY_UPLOAD_PRESET="Seu_Upload_Preset"
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse a URL indicada no console (geralmente [http://localhost:5173](http://localhost:5173)).

---

## 📦 Scripts Disponíveis no `package.json`

- `npm run dev`: Inicia o servidor local de desenvolvimento com hot reload (HMR).
- `npm run build`: Executa a checagem de tipos com TypeScript e compila o site para produção na pasta `dist/`.
- `npm run lint`: Executa o linter ESLint para validar boas práticas e qualidade do código.
- `npm run preview`: Serve localmente a versão compilada na pasta `dist/` para testes de build.

---

## 🚀 Deploy em Produção (Firebase Hosting)

Para publicar suas atualizações no ar:

1. Certifique-se de ter a CLI do Firebase instalada globalmente:
   ```bash
   npm install -g firebase-tools
   ```
2. Faça login na sua conta do Firebase pelo terminal:
   ```bash
   firebase login
   ```
3. Gere o build de produção atualizado:
   ```bash
   npm run build
   ```
4. Faça o deploy no Firebase Hosting:
   ```bash
   firebase deploy --only hosting
   ```

---

## 📄 Documentação de Entrega e Credenciais de Acesso

Para obter detalhes sobre o acesso ao **GitHub**, **Firebase Console** e **Cloudinary**, consulte o arquivo privado de documentação na raiz do diretório de desenvolvimento:

👉 **[documentacao_e_entrega.md](file:///c:/Users/Raimari%20Sombra/Desktop/projetos/Fran/documentacao_e_entrega.md)**

*Nota: Esse arquivo contém credenciais confidenciais de administração e chaves de segurança e não deve ser compartilhado publicamente.*
