# Frontend - Carambolo Doces

Aplicação frontend desenvolvida para o projeto do 3º semestre da SPTech. Sistema completo para gestão de uma doceria, incluindo autenticação, dashboards e funcionalidades administrativas.

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces de usuário
- **Vite 6** - Ferramenta de build rápida
- **TailwindCSS** - Framework CSS utilitário
- **Material-UI (MUI)** - Biblioteca de componentes React
- **React Router DOM** - Roteamento para SPAs
- **Axios** - Cliente HTTP para APIs
- **React Hook Form** - Gerenciamento de formulários
- **ApexCharts** - Biblioteca de gráficos
- **Jest** - Framework de testes
- **Java Spring Boot** - API Backend (repositório separado)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) versão 16 ou superior
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

### Verificando as versões instaladas

```bash
node --version
npm --version
git --version
```

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd frontend
```

### 2. Navegue para o diretório principal do projeto

```bash
cd carambolo-doces
```

### 3. Instale as dependências

```bash
# Usando NPM
npm install

# Ou usando Yarn
yarn install
```

### 4. Configuração do ambiente

O projeto se conecta com uma API backend desenvolvida em **Java Spring Boot**. É necessário configurar a URL da API nas variáveis de ambiente.

Crie um arquivo `.env` na raiz do projeto `carambolo-doces`:

```env
VITE_API_URL=http://localhost:8080
```

## 🔗 Integração com Backend

Este frontend se comunica com uma API REST desenvolvida em **Java Spring Boot** através do **Axios**. A configuração da API está localizada em:

- `src/service/` - Configurações de serviços
- `src/services/` - Utilitários e interceptadores do Axios

### Repositório do Backend

📌 **Link do repositório backend:** `https://github.com/Teiko-org/backend`

> ⚠️ **Importante:** Certifique-se de que a API backend esteja rodando antes de iniciar o frontend. Consulte o README do repositório backend para instruções de instalação e configuração do Spring Boot.

## 🎯 Como Rodar o Projeto

### Modo Desenvolvimento

1. **Certifique-se de que a API backend está rodando** (consulte o README do backend)

2. **Iniciando o servidor de desenvolvimento:**

```bash
npm run dev
# ou
yarn dev
```

3. **Acesse a aplicação:**
   - Frontend: http://localhost:5173
   - API Backend: http://localhost:8080 (ou conforme configurado)

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia o servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Pré-visualiza o build de produção

# Qualidade de código
npm run lint         # Executa o ESLint

# Testes
npm run test         # Executa os testes
npm run test:coverage # Executa testes com cobertura
```

## 📁 Estrutura do Projeto

```
carambolo-doces/
├── public/              # Arquivos públicos
├── src/
│   ├── assets/         # Imagens, ícones, etc.
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # Contextos React
│   ├── pages/          # Páginas da aplicação
│   ├── provider/       # Provedores de contexto
│   ├── routes/         # Configuração de rotas
│   ├── service/        # Serviços da API
│   ├── services/       # Utilitários de serviços
│   ├── App.jsx         # Componente principal
│   ├── App.css         # Estilos globais
│   ├── index.css       # Estilos base (Tailwind)
│   └── main.jsx        # Ponto de entrada
├── .env                # Variáveis de ambiente (criar)
├── package.json        # Dependências e scripts
├── tailwind.config.js  # Configuração do Tailwind
├── vite.config.js      # Configuração do Vite
└── README.md           # Este arquivo
```

## 🧪 Executando Testes

```bash
# Executar todos os testes
npm run test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test -- --watch
```

## 🌐 Projeto Auxiliar (JavaScript Utils)

O projeto também inclui uma pasta `javascript-Utils-Login-Cadastro` com utilitários de login e cadastro em JavaScript vanilla. Para executar:

```bash
cd javascript-Utils-Login-Cadastro

# Abra o index.html em um navegador
# ou utilize um servidor local como Live Server (extensão VS Code)
```

## 🔧 Configurações Adicionais

### Configuração do Editor

Recomenda-se usar as seguintes extensões no VS Code:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint

### Variáveis de Ambiente

As principais variáveis de ambiente que podem ser configuradas:

```env
VITE_API_URL=http://localhost:8080      # URL da API Spring Boot
VITE_APP_NAME=Carambolo Doces          # Nome da aplicação
```

## 🐛 Solução de Problemas

### Erro de dependências
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Porta já em uso
```bash
# Use uma porta diferente
npm run dev -- --port 3000
```

### Problemas de conexão com a API
```bash
# Verifique se a API backend está rodando
# Confirme a URL da API no arquivo .env
# Certifique-se de que não há problemas de CORS
```

## 📚 Documentação das Principais Bibliotecas

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Material-UI](https://mui.com/)
- [React Router](https://reactrouter.com/)
- [React Hook Form](https://react-hook-form.com/)

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
