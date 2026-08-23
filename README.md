# Insulinet Frontend

Interface web do **Insulinet**, uma aplicação para controle de estoque de insulina, registro de doses e acompanhamento da estimativa de autonomia.

## Tecnologias

- React
- TypeScript
- Vite
- React Router
- Lucide React
- CSS

## Funcionalidades

- Cadastro e login de usuários
- Recuperação e redefinição de senha
- Dashboard de insulinas
- Cadastro e edição de insulinas
- Registro de doses
- Registro de doses em múltiplos dias
- Histórico de movimentações
- Entrada e ajuste de estoque
- Exibição do estoque atual
- Estimativa de dias restantes
- Interface responsiva para desktop, tablet e celular

## Estrutura

```text
src/
├── components/
│   ├── dose/
│   ├── insulin/
│   └── stock/
├── pages/
├── services/
├── styles/
├── types/
├── utils/
├── App.tsx
└── main.tsx
```

### Responsabilidades

- `components/`: componentes e modais organizados por domínio
- `pages/`: páginas da aplicação
- `services/`: comunicação com a API
- `styles/`: estilos separados por responsabilidade
- `types/`: tipos TypeScript compartilhados
- `utils/`: funções auxiliares

## Estilos

Os estilos estão separados em:

```text
styles/
├── globals.css
├── forms.css
├── auth.css
├── dashboard.css
├── modals.css
└── responsive.css
```

## Configuração local

Clone o repositório:

```bash
git clone https://github.com/fernanndp/insulinet-frontend.git
cd insulinet-frontend
```

Instale as dependências:

```bash
npm install
```

No Windows, caso a política do PowerShell bloqueie `npm.ps1`, utilize:

```powershell
npm.cmd install
```

Crie um arquivo `.env` a partir do `.env.example`:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Nunca versione o arquivo `.env`.

## Executando

```bash
npm run dev
```

No Windows:

```powershell
npm.cmd run dev
```

A aplicação ficará disponível normalmente em:

```text
http://localhost:5173
```

## Build de produção

```bash
npm run build
```

No Windows:

```powershell
npm.cmd run build
```

Os arquivos de produção serão gerados em:

```text
dist/
```

## Integração com a API

A URL do backend é configurada pela variável:

```env
VITE_API_URL=
```

As chamadas HTTP ficam centralizadas em `src/services`.

O backend do projeto está em:

https://github.com/fernanndp/insulinet-backend

## Arquitetura do frontend

O frontend evita concentrar URLs e regras de comunicação diretamente nos componentes. A camada de serviços contém as operações de autenticação, insulinas, doses, estoque e usuário.

```text
services/
├── api.ts
├── authService.ts
├── doseService.ts
├── insulinService.ts
├── stockService.ts
└── userService.ts
```

## Roadmap

Entre as funcionalidades planejadas para evolução do Insulinet estão:

- Alertas visuais de estoque baixo com base na autonomia estimada
- Indicação da data recomendada para reposição de insulina
- Fluxo de reposição diretamente pela interface
- Busca de opções de compra em farmácias
- Exibição de alternativas de farmácias compatíveis com a insulina cadastrada
- Redirecionamento do usuário para farmácias ou páginas de compra
- Possibilidade futura de comparação de disponibilidade e preços
- Melhorias contínuas de responsividade e experiência de uso

A proposta é evoluir o frontend para apoiar não apenas o acompanhamento do estoque, mas também a tomada de decisão sobre quando e onde realizar a reposição da insulina.

## Status

Projeto em desenvolvimento.
