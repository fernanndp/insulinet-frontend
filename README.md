# Insulinet Frontend

Frontend web do Insulinet, desenvolvido com React, TypeScript e Vite.

## Requisitos

- Node.js
- npm
- Backend do Insulinet em execução

## Configuração

Copie `.env.example` para `.env` e ajuste a URL do backend quando necessário:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Estrutura principal

- `src/components/dose`: componentes de aplicações e histórico.
- `src/components/insulin`: cadastro e edição de insulinas.
- `src/components/stock`: entrada, ajuste e edição de estoque.
- `src/pages`: páginas da aplicação.
- `src/services`: acesso à API por domínio.
- `src/types`: tipos compartilhados.
- `src/utils`: funções utilitárias e formatação.
