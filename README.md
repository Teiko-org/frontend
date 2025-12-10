# Frontend - Carambolo Doces

Aplicação frontend desenvolvida em **React** para o projeto do 3º semestre da SPTech. Sistema completo para gestão de uma doceria, incluindo autenticação, dashboards, gestão de pedidos, carrinho de compras e funcionalidades administrativas.

## 🚀 Início Rápido

Se você quer rodar o projeto rapidamente, siga estes passos:

```bash
# 1. Clone o repositório
git clone https://github.com/Teiko-org/frontend.git
cd frontend/carambolo-doces

# 2. Instale as dependências
npm install

# 3. Configure o arquivo .env (veja seção "Configuração do Ambiente" abaixo)
# Crie um arquivo .env na raiz do projeto com:
# VITE_API_URL=http://localhost:8080

# 4. Certifique-se de que a API backend está rodando
# Consulte o README do backend: https://github.com/Teiko-org/backend

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

**A aplicação estará disponível em:** http://localhost:5173

---

## 🛠️ Tecnologias Utilizadas

### Core
- **React 18.3.1** - Biblioteca JavaScript para interfaces de usuário
- **Vite 6.2.0** - Ferramenta de build rápida e servidor de desenvolvimento
- **Node.js 20+** - Runtime JavaScript

### Estilização
- **TailwindCSS 3.4.17** - Framework CSS utilitário
- **Material-UI (MUI) 7.1.0** - Biblioteca de componentes React
- **@material-tailwind/react 2.1.10** - Integração Material Tailwind
- **@emotion/react 11.14.0** - CSS-in-JS para MUI
- **@emotion/styled 11.14.0** - Estilização com Emotion
- **tailwind-scrollbar 1.3.2** - Scrollbar customizada

### Roteamento e Navegação
- **React Router DOM 7.4.1** - Roteamento para SPAs

### Comunicação com API
- **Axios 1.9.0** - Cliente HTTP para APIs REST
- **jwt-decode 4.0.0** - Decodificação de tokens JWT

### Formulários e Validação
- **React Hook Form 7.55.0** - Gerenciamento de formulários
- **react-input-mask 2.0.4** - Máscaras de input
- **react-text-mask 5.5.0** - Máscaras de texto
- **react-phone-input-2 2.15.1** - Input de telefone
- **react-phone-number-input 3.4.12** - Validação de telefone

### Gráficos e Visualizações
- **ApexCharts 4.7.0** - Biblioteca de gráficos
- **react-apexcharts 1.7.0** - Wrapper React para ApexCharts

### UI/UX
- **React Icons 5.5.0** - Biblioteca de ícones
- **Lucide React 0.487.0** - Ícones modernos
- **@mui/icons-material 7.0.1** - Ícones Material-UI
- **@mui/lab 7.0.0-beta.12** - Componentes experimentais MUI
- **@mui/x-date-pickers 8.4.0** - Seletores de data
- **react-datepicker 8.3.0** - Seletor de data
- **react-day-picker 9.7.0** - Seletor de dias
- **@react-spring/web 9.7.5** - Animações

### Notificações e Feedback
- **react-toastify 11.0.5** - Notificações toast
- **react-confirm-toast 2.0.2** - Confirmações toast

### Internacionalização
- **react-intl 5.25.1** - Internacionalização (i18n)

### Utilitários
- **dayjs 1.11.13** - Manipulação de datas
- **json-server 1.0.0-beta.3** - Mock API (desenvolvimento)

### Testes
- **Jest 29.7.0** - Framework de testes
- **@testing-library/react 16.3.0** - Utilitários de teste React
- **@testing-library/jest-dom 6.6.3** - Matchers para DOM
- **babel-jest 29.7.0** - Transpilador Babel para Jest

### Ferramentas de Desenvolvimento
- **ESLint 9.21.0** - Linter JavaScript
- **PostCSS 8.5.3** - Processador CSS
- **Autoprefixer 10.4.21** - Prefixos CSS automáticos
- **@vitejs/plugin-react 4.3.4** - Plugin React para Vite

### Containerização
- **Docker** - Containerização da aplicação

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado os seguintes softwares:

### Obrigatórios

- **Node.js 20+** (recomendado: LTS)
  - Download: [Node.js](https://nodejs.org/)
  - Verificar instalação: `node --version`
  - **Nota:** O projeto usa Node.js 20 no Dockerfile, mas funciona com versões 16+

- **NPM** (vem com Node.js) ou **Yarn**
  - Verificar NPM: `npm --version`
  - Verificar Yarn: `yarn --version`
  - **Nota:** NPM é suficiente, Yarn é opcional

- **Git**
  - Download: [Git](https://git-scm.com/)
  - Verificar instalação: `git --version`

### Opcionais (mas recomendados)

- **Docker** - Para executar a aplicação em container
  - Download: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - Verificar instalação: `docker --version`

- **Backend API** - API Spring Boot rodando
  - Repositório: [Backend](https://github.com/Teiko-org/backend)
  - Deve estar rodando em `http://localhost:8080` (ou configurar no `.env`)

### Verificando as Instalações

Execute os seguintes comandos para verificar se tudo está instalado corretamente:

```bash
# Verificar Node.js
node --version
# Deve mostrar: v20.x.x ou superior (ou v16+)

# Verificar NPM
npm --version
# Deve mostrar: 8.x.x ou superior

# Verificar Git
git --version
# Deve mostrar: git version 2.x.x ou superior

# Verificar Docker (se instalado)
docker --version
# Deve mostrar: Docker version 20.x.x ou superior
```

## 🚀 Instalação e Configuração

Siga estes passos na ordem para configurar o projeto:

### 1. Clone o Repositório

```bash
# Clone o repositório
git clone https://github.com/Teiko-org/frontend.git

# Entre no diretório do projeto
cd frontend/carambolo-doces
```

### 2. Instale as Dependências

```bash
# Usando NPM (recomendado)
npm install

# Ou usando Yarn
yarn install
```

**Nota:** Na primeira execução, o npm/yarn baixará todas as dependências. Isso pode levar alguns minutos dependendo da sua conexão.

**Se encontrar erros de dependências:**
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### 3. Configure o Ambiente

O projeto se conecta com uma API backend desenvolvida em **Java Spring Boot**. É necessário configurar a URL da API nas variáveis de ambiente.

**Crie um arquivo `.env` na raiz do projeto `carambolo-doces`** (mesmo nível do `package.json`):

```env
# URL da API Backend
VITE_API_URL=http://localhost:8080

# URL base da API (opcional - usado em produção)
# VITE_API_BASE_URL=/api

# Nome da aplicação (opcional)
# VITE_APP_NAME=Carambolo Doces
```

**Importante:**
- As variáveis de ambiente no Vite devem começar com `VITE_` para serem expostas ao código
- O arquivo `.env` não deve ser commitado (já está no `.gitignore`)
- Em desenvolvimento, o Vite usa um proxy configurado em `vite.config.js` que redireciona `/api` para `http://localhost:8080`

### 4. Certifique-se de que o Backend está Rodando

Antes de iniciar o frontend, certifique-se de que a API backend está rodando:

```bash
# Verificar se a API está respondendo
curl http://localhost:8080/actuator/health

# Ou acesse no navegador:
# http://localhost:8080/swagger-ui.html
```

Se a API não estiver rodando, consulte o [README do Backend](https://github.com/Teiko-org/backend) para instruções de instalação e execução.

## 🔗 Integração com Backend

Este frontend se comunica com uma API REST desenvolvida em **Java Spring Boot** através do **Axios**. A configuração da API está localizada em:

- `src/service/` - Configurações de serviços
- `src/services/` - Utilitários e interceptadores do Axios

### Repositório do Backend

📌 **Link do repositório backend:** `https://github.com/Teiko-org/backend`

> ⚠️ **Importante:** Certifique-se de que a API backend esteja rodando antes de iniciar o frontend. Consulte o README do repositório backend para instruções de instalação e configuração do Spring Boot.

## 🎯 Como Rodar o Projeto

### Modo Desenvolvimento (Recomendado)

```bash
# Certifique-se de estar no diretório carambolo-doces
cd frontend/carambolo-doces

# Certifique-se de que a API backend está rodando
# (consulte o README do backend se necessário)

# Inicie o servidor de desenvolvimento
npm run dev

# Ou usando Yarn
yarn dev
```

**O que acontece:**
- O Vite inicia o servidor de desenvolvimento
- A aplicação compila automaticamente
- Hot Module Replacement (HMR) está ativo (mudanças refletem instantaneamente)
- O proxy do Vite redireciona requisições `/api` para `http://localhost:8080`
- A aplicação fica disponível em `http://localhost:5173`

**Acesse a aplicação:**
- **Frontend:** http://localhost:5173
- **API Backend:** http://localhost:8080 (ou conforme configurado no `.env`)

**Primeira execução pode demorar mais** devido à compilação inicial e otimizações do Vite.

### Build para Produção

Para gerar uma build otimizada para produção:

```bash
# Gerar build de produção
npm run build

# A build será gerada na pasta dist/
```

**Características da build:**
- Código minificado e otimizado
- Assets otimizados (imagens, CSS, JS)
- Tree-shaking (remove código não utilizado)
- Code splitting automático

### Preview da Build de Produção

Para testar a build de produção localmente:

```bash
# Gerar build
npm run build

# Preview da build
npm run preview
```

A aplicação estará disponível em `http://localhost:4173` (porta padrão do Vite preview).

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor de desenvolvimento (Vite)
npm run dev -- --port 3000  # Inicia em porta customizada

# Build
npm run build            # Gera build de produção otimizada
npm run preview          # Pré-visualiza o build de produção localmente

# Qualidade de Código
npm run lint             # Executa o ESLint para verificar código
npm run lint -- --fix    # Executa ESLint e corrige problemas automaticamente

# Testes
npm run test             # Executa todos os testes
npm run test:coverage    # Executa testes com relatório de cobertura
npm run test -- --watch  # Executa testes em modo watch (observa mudanças)
```

### Executando com Docker

O projeto inclui um Dockerfile para containerização:

```bash
# Build da imagem (na raiz do repositório frontend)
docker build -f docker/Dockerfile -t carambolo-frontend:latest .

# Executar container
docker run -d \
  -p 8080:8080 \
  -e VITE_API_URL=http://seu-backend:8080 \
  --name carambolo-frontend \
  carambolo-frontend:latest
```

**Nota:** O Dockerfile usa multi-stage build para otimizar o tamanho da imagem final.

## 📁 Estrutura do Projeto

```
carambolo-doces/
├── public/                    # Arquivos públicos estáticos
│   └── vite.svg              # Favicon e assets públicos
│
├── src/                       # Código fonte da aplicação
│   ├── assets/               # Imagens, ícones e recursos estáticos
│   │   ├── logo.png
│   │   ├── banner_card.png
│   │   └── ...
│   │
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Button/           # Componente de botão
│   │   ├── Card/             # Componente de card
│   │   ├── Header/           # Cabeçalho da aplicação
│   │   ├── Footer/            # Rodapé
│   │   ├── Modal*/           # Vários modais (Login, Cadastro, etc.)
│   │   ├── Dashboard*/       # Componentes do dashboard
│   │   └── ...
│   │
│   ├── contexts/             # Contextos React (estado global)
│   │   ├── CartContext.jsx   # Contexto do carrinho de compras
│   │   ├── FormContext.jsx    # Contexto de formulários
│   │   └── ServerIdContext.jsx # Contexto de servidor
│   │
│   ├── pages/                 # Páginas da aplicação
│   │   ├── Home/              # Página inicial
│   │   ├── Dashboard/         # Dashboard administrativo
│   │   ├── Products/          # Página de produtos
│   │   ├── Cart/              # Carrinho de compras
│   │   ├── CakeOrder/         # Pedido de bolo
│   │   ├── Fornada/           # Página de fornadas
│   │   └── ...
│   │
│   ├── routes/                # Configuração de rotas
│   │   ├── routes.jsx         # Definição de rotas
│   │   └── ProtectedRoute.jsx # Rota protegida (requer autenticação)
│   │
│   ├── service/                # Serviços de API (comunicação com backend)
│   │   ├── authService.js     # Serviço de autenticação
│   │   ├── userService.js     # Serviço de usuários
│   │   ├── productService.js  # Serviço de produtos
│   │   ├── cartService.js     # Serviço de carrinho
│   │   └── ...
│   │
│   ├── services/               # Utilitários de serviços
│   │   ├── orderCake.js        # Lógica de pedido de bolo
│   │   ├── orderFornada.js     # Lógica de pedido de fornada
│   │   └── ...
│   │
│   ├── provider/               # Provedores e configurações
│   │   └── AxiosApi.js         # Configuração do Axios (interceptors, etc.)
│   │
│   ├── hooks/                  # Custom hooks React
│   │   ├── useAuth.js          # Hook de autenticação
│   │   └── useModal.js         # Hook para modais
│   │
│   ├── utils/                  # Funções utilitárias
│   │   ├── authUtils.js        # Utilitários de autenticação
│   │   ├── phoneValidation.js  # Validação de telefone
│   │   └── toast.js            # Configuração de notificações
│   │
│   ├── styles/                 # Estilos adicionais
│   │   └── *.css              # Arquivos CSS específicos
│   │
│   ├── config/                  # Arquivos de configuração
│   │
│   ├── App.jsx                  # Componente principal da aplicação
│   ├── App.css                  # Estilos globais do App
│   ├── main.jsx                 # Ponto de entrada (renderiza App)
│   ├── index.css                # Estilos base (Tailwind CSS)
│   └── polyfills.js             # Polyfills para compatibilidade
│
├── docker/                      # Arquivos Docker
│   ├── Dockerfile              # Dockerfile para build da aplicação
│   └── server.js               # Servidor Express para produção
│
├── .env                         # Variáveis de ambiente (criar)
├── .gitignore                   # Arquivos ignorados pelo Git
├── package.json                 # Dependências e scripts NPM
├── package-lock.json            # Lock file das dependências
├── vite.config.js               # Configuração do Vite
├── tailwind.config.js           # Configuração do Tailwind CSS
├── postcss.config.js            # Configuração do PostCSS
├── eslint.config.js             # Configuração do ESLint
├── jest.config.js               # Configuração do Jest
├── jest.setup.js                # Setup dos testes
├── index.html                   # HTML principal
└── README.md                    # Este arquivo
```

### Organização por Funcionalidade

- **Components**: Componentes reutilizáveis organizados por funcionalidade
- **Pages**: Páginas principais da aplicação (rotas)
- **Service**: Camada de comunicação com a API backend
- **Contexts**: Gerenciamento de estado global com React Context
- **Hooks**: Custom hooks para lógica reutilizável
- **Utils**: Funções utilitárias e helpers

## 🧪 Executando Testes

O projeto usa **Jest** e **React Testing Library** para testes:

```bash
# Executar todos os testes
npm run test

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes em modo watch (observa mudanças)
npm run test -- --watch

# Executar testes de um arquivo específico
npm run test -- NomeDoArquivo.test.jsx

# Executar testes em modo verbose
npm run test -- --verbose
```

**Estrutura de Testes:**
- Testes unitários para componentes
- Testes de integração para serviços
- Testes de hooks customizados
- Configuração em `jest.config.js` e `jest.setup.js`

## 🌐 Projeto Auxiliar (JavaScript Utils)

O projeto também inclui uma pasta `javascript-Utils-Login-Cadastro` com utilitários de login e cadastro em JavaScript vanilla. Para executar:

```bash
cd javascript-Utils-Login-Cadastro

# Abra o index.html em um navegador
# ou utilize um servidor local como Live Server (extensão VS Code)
```

## 🔧 Configurações Adicionais

### Configuração do Editor (VS Code)

Recomenda-se usar as seguintes extensões no VS Code para melhor experiência de desenvolvimento:

- **ES7+ React/Redux/React-Native snippets** - Snippets úteis para React
- **Tailwind CSS IntelliSense** - Autocomplete para classes Tailwind
- **Prettier - Code formatter** - Formatação automática de código
- **ESLint** - Linting e detecção de erros
- **Auto Rename Tag** - Renomeia tags HTML/JSX automaticamente
- **Bracket Pair Colorizer** - Coloração de brackets (opcional)

### Variáveis de Ambiente

As principais variáveis de ambiente que podem ser configuradas no arquivo `.env`:

```env
# URL da API Backend (obrigatório)
VITE_API_URL=http://localhost:8080

# URL base da API (opcional - usado em produção com proxy)
# VITE_API_BASE_URL=/api

# Nome da aplicação (opcional)
# VITE_APP_NAME=Carambolo Doces
```

**Nota:** 
- Todas as variáveis devem começar com `VITE_` para serem expostas ao código
- Em desenvolvimento, o Vite usa proxy configurado em `vite.config.js`
- Em produção, configure o proxy no servidor web (Nginx, etc.)

### Configuração do Vite

O arquivo `vite.config.js` contém:
- Proxy para redirecionar `/api` para o backend
- Configuração do plugin React
- Configurações de build

### Configuração do Tailwind

O arquivo `tailwind.config.js` contém:
- Cores customizadas do tema
- Fontes personalizadas
- Gradientes customizados
- Integração com Material Tailwind

## 🐛 Solução de Problemas

### Erro de Dependências

```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Se ainda tiver problemas, tente com Yarn
yarn install
```

### Porta Já em Uso

```bash
# Use uma porta diferente
npm run dev -- --port 3000

# Ou configure no vite.config.js
# server: { port: 3000 }
```

### Problemas de Conexão com a API

1. **Verifique se a API backend está rodando:**
```bash
curl http://localhost:8080/actuator/health
```

2. **Confirme a URL da API no arquivo `.env`:**
```env
VITE_API_URL=http://localhost:8080
```

3. **Verifique problemas de CORS:**
   - O backend deve ter CORS configurado para aceitar requisições de `http://localhost:5173`
   - Consulte o README do backend para configuração de CORS

4. **Verifique o console do navegador:**
   - Abra DevTools (F12) e veja erros na aba Console
   - Verifique a aba Network para ver requisições falhando

### Erros de Build

```bash
# Limpe a pasta dist e reconstrua
rm -rf dist
npm run build
```

### Problemas com Hot Module Replacement (HMR)

Se as mudanças não refletirem automaticamente:
```bash
# Reinicie o servidor de desenvolvimento
# Pressione Ctrl+C e execute novamente:
npm run dev
```

### Erros de TypeScript/Type Checking

Se estiver usando TypeScript ou encontrar erros de tipos:
```bash
# Verifique se @types/react está instalado
npm install --save-dev @types/react @types/react-dom
```

### Problemas com Tailwind CSS

Se os estilos do Tailwind não estiverem funcionando:
```bash
# Verifique se o Tailwind está configurado corretamente
# Confirme que index.css importa o Tailwind:
# @tailwind base;
# @tailwind components;
# @tailwind utilities;
```

### Problemas com Autenticação/JWT

- Verifique se o token JWT está sendo salvo corretamente
- Confirme que o backend está retornando tokens válidos
- Verifique a expiração do token no console do navegador

## 📚 Documentação das Principais Bibliotecas

### Core
- [React](https://react.dev/) - Biblioteca JavaScript para interfaces
- [Vite](https://vitejs.dev/) - Build tool e dev server
- [Node.js](https://nodejs.org/) - Runtime JavaScript

### UI e Estilização
- [TailwindCSS](https://tailwindcss.com/) - Framework CSS utilitário
- [Material-UI (MUI)](https://mui.com/) - Componentes React
- [Material Tailwind](https://www.material-tailwind.com/) - Integração MUI + Tailwind

### Roteamento e Navegação
- [React Router](https://reactrouter.com/) - Roteamento para SPAs

### Formulários
- [React Hook Form](https://react-hook-form.com/) - Gerenciamento de formulários

### Gráficos
- [ApexCharts](https://apexcharts.com/) - Biblioteca de gráficos

### HTTP e API
- [Axios](https://axios-http.com/) - Cliente HTTP

### Testes
- [Jest](https://jestjs.io/) - Framework de testes
- [React Testing Library](https://testing-library.com/react) - Utilitários de teste

### Outras
- [Day.js](https://day.js.org/) - Manipulação de datas
- [React Icons](https://react-icons.github.io/react-icons/) - Ícones
- [Lucide React](https://lucide.dev/) - Ícones modernos

## 📝 Licença

Este projeto foi desenvolvido como parte do curso da SPTech - 3º semestre.

---

## 🆘 Suporte

Se encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências estão instaladas corretamente
2. Certifique-se de que as versões do Node.js e NPM são compatíveis
3. Consulte a documentação das tecnologias utilizadas
4. Abra uma issue no repositório do projeto

Para mais informações sobre o backend que consome esta API, consulte: [Backend README](https://github.com/Teiko-org/backend)
// bump ci
