# Frontend Assignment

Tela de gerenciamento de usuários (listagem, filtro, paginação, edição e exclusão) feita a partir do Figma do desafio. Os dados usam o modelo de personagem da [Rick and Morty API](https://rickandmortyapi.com/documentation/#character-schema).

O repositório tem dois projetos em TypeScript:

- `api/`: Express + Zod, com os dados em memória
- `web/`: React + Vite, com Axios e React Query

## Rodando

Precisa de Node 20+.

```bash
npm install
npm run dev:api
npm run dev:web
```

A API sobe na porta 3333 e o front em http://localhost:5173.

Se precisar mudar alguma coisa: a API lê `PORT` e `CORS_ORIGIN` (dá pra passar mais de uma origem separando por vírgula), e o front lê `VITE_API_URL` (tem um `web/.env.example` de exemplo).

## Testes

```bash
npm test
npm run test:coverage
```

Na API os testes de rota são feitos com Supertest, então passam pelos controllers de verdade. Middlewares, validações e o repositório têm testes separados. No front é Testing Library.

Também tem `npm run typecheck` e `npm run build`, que rodam nos dois projetos.

## API

- `GET /characters` aceita `name`, `status` (`Alive`, `Dead` ou `unknown`), `page` e `limit` (máximo 50). A resposta segue o formato da Rick and Morty: `{ info, results }`.
- `PATCH /characters/:id` com `{ "name": "..." }` altera o nome.
- `DELETE /characters/:id` remove.

Os erros voltam como `{ "error": "..." }`, e os de validação trazem os campos em `details`.

Os dados iniciais são os 100 primeiros personagens da API oficial, salvos em `api/src/data/characters.json`. Como ficam em memória, tudo volta ao original quando a API reinicia. Optei por isso porque a API oficial é só leitura e o desafio pede edição e exclusão.

## Algumas observações

- A paginação é feita na API. O padrão no front é 15 por página, igual ao Figma.
- O filtro de nome espera o usuário parar de digitar (400ms) antes de buscar. O de status e o botão Search aplicam na hora.
- Os modais usam o `<dialog>` do próprio navegador, que já resolve Esc e foco.
- O Figma só tem a versão desktop. No celular os filtros ficam um embaixo do outro e a tabela rola de lado.
- Dá pra usar a tabela pelo teclado: Enter na linha abre a edição e a lixeira aparece quando recebe foco.
- Tratei busca sem resultado, erro de carregamento (com botão para tentar de novo) e exclusão do último item de uma página.
