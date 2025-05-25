Este guia mostra exatamente como replicar o CRUD de clientes para criar um novo módulo 
voce deve criar um novo módulo chamado Usuarios.
segue a documentacao do swagger:
openapi: 3.0.3
info:
  title: API Usuários
  version: '1.0'
  description: Documentação das rotas de CRUD de usuários
servers:
  - url: http://localhost/api
paths:
  /users:
    get:
      summary: Lista usuários
      tags:
        - Usuários
      parameters:
        - in: query
          name: filter[busca]
          schema:
            type: string
          description: Busca geral por nome ou email
        - in: query
          name: filter[name]
          schema:
            type: string
          description: Filtra por nome
        - in: query
          name: filter[email]
          schema:
            type: string
          description: Filtra por email
        - in: query
          name: sort_by
          schema:
            type: string
            enum: [id, name, email, created_at, updated_at]
          description: Campo para ordenação
        - in: query
          name: direction
          schema:
            type: string
            enum: [asc, desc]
          description: Direção da ordenação
        - in: query
          name: per_page
          schema:
            type: integer
          description: Itens por página
      responses:
        '200':
          description: Lista paginada de usuários
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserPaginatedResponse'
    post:
      summary: Cria um novo usuário
      tags:
        - Usuários
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserCreateRequest'
      responses:
        '201':
          description: Usuário criado com sucesso
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '422':
          description: Dados inválidos
  /users/{id}:
    get:
      summary: Busca usuário por ID
      tags:
        - Usuários
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Usuário encontrado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '404':
          description: Usuário não encontrado
    put:
      summary: Atualiza usuário
      tags:
        - Usuários
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserUpdateRequest'
      responses:
        '200':
          description: Usuário atualizado
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserResponse'
        '422':
          description: Dados inválidos
        '404':
          description: Usuário não encontrado
    delete:
      summary: Remove usuário
      tags:
        - Usuários
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Usuário removido
        '404':
          description: Usuário não encontrado
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
    UserResponse:
      type: object
      properties:
        data:
          $ref: '#/components/schemas/User'
    UserPaginatedResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        meta:
          type: object
          properties:
            current_page:
              type: integer
            last_page:
              type: integer
            per_page:
              type: integer
            total:
              type: integer
    UserCreateRequest:
      type: object
      required:
        - name
        - email
        - password
      properties:
        name:
          type: string
        email:
          type: string
        password:
          type: string
          format: password
    UserUpdateRequest:
      type: object
      properties:
        name:
          type: string
        email:
          type: string
        password:
          type: string
          format: password


## CONTEXTO: DADOS DA ENTIDADE

### 📋 Checklist Etapa 1
- [ ] Definir nome da entidade (ex: "produtos", "usuarios", "pedidos")
- [ ] Listar campos necessários
- [ ] Identificar campos obrigatórios
- [ ] Definir quais campos aparecerão nos filtros
- [ ] Definir quais campos serão ordenáveis

### 📝 Ações
1. **Documentar a estrutura** da nova entidade
2. **Mapear correspondências** com o exemplo de clientes
3. **Definir nomenclatura** (singular/plural, rotas, etc.)

---

## ETAPA 2: CRIAÇÃO DOS TIPOS TYPESCRIPT

### 📋 Checklist Etapa 2
- [ ] Criar arquivo de tipos da nova entidade
- [ ] Adaptar interfaces do cliente para nova entidade

### 📝 Ações
1. **Copiar** `src/types/client.types.ts`
2. **Renomear** para `src/types/[entidade].types.ts` (ex: `produto.types.ts`)
3. **Substituir** todas ocorrências de:
   - `Client` → `Produto` (ou nome da entidade)
   - `client` → `produto`
   - Campos específicos conforme sua entidade
4. **Manter** estruturas de paginação (são reutilizadas)

**Arquivo base:** `src/types/client.types.ts`
**Arquivo destino:** `src/types/[entidade].types.ts`

---

## ETAPA 3: CRIAÇÃO DO SERVIÇO (API)

### 📋 Checklist Etapa 3
- [ ] Criar arquivo de serviço da nova entidade
- [ ] Adaptar endpoints para nova API

### 📝 Ações
1. **Copiar** `src/services/clientsService.ts`
2. **Renomear** para `src/services/[entidade]Service.ts` (ex: `produtosService.ts`)
3. **Substituir** todas ocorrências de:
   - `clients` → `produtos` (nos endpoints)
   - `Client` → `Produto` (nos tipos)
   - `clientsService` → `produtosService`
   - `client` → `produto`
4. **Ajustar** endpoints da API conforme sua estrutura backend

**Arquivo base:** `src/services/clientsService.ts`
**Arquivo destino:** `src/services/[entidade]Service.ts`

---

## ETAPA 4: CRIAÇÃO DO STORE (PINIA)

### 📋 Checklist Etapa 4
- [ ] Criar store da nova entidade
- [ ] Adaptar imports e nomenclatura

### 📝 Ações
1. **Copiar** `src/stores/clientsStore.ts`
2. **Renomear** para `src/stores/[entidade]Store.ts` (ex: `produtosStore.ts`)
3. **Substituir** todas ocorrências de:
   - `clients` → `produtos`
   - `Client` → `Produto`
   - `useClientsStore` → `useProdutosStore`
   - Import do service para o novo service criado
4. **Manter** toda a lógica de paginação, filtros e ordenação

**Arquivo base:** `src/stores/clientsStore.ts`
**Arquivo destino:** `src/stores/[entidade]Store.ts`

---

## ETAPA 5: CONFIGURAÇÃO DAS ROTAS

### 📋 Checklist Etapa 5
- [ ] Adicionar rotas da nova entidade
- [ ] Configurar lazy loading dos componentes

### 📝 Ações
1. **Editar** `src/router/index.ts`
2. **Copiar** o bloco de rotas de clientes:
   ```
   - /clientes → /produtos
   - /clientes/novo → /produtos/novo
   - /clientes/:id/editar → /produtos/:id/editar
   - /clientes/:id → /produtos/:id
   ```
3. **Adaptar** nomes das rotas e componentes
4. **Ajustar** meta informações (títulos)

**Arquivo para editar:** `src/router/index.ts`
**Seção:** children do AppLayout

---

## ETAPA 6: CRIAÇÃO DOS DIRETÓRIOS E ESTRUTURA

### 📋 Checklist Etapa 6
- [ ] Criar diretório de componentes
- [ ] Criar diretório de views
- [ ] Organizar estrutura de arquivos

### 📝 Ações
1. **Criar** diretório `src/components/[entidade]/`
2. **Criar** diretório `src/views/[entidade]/`
3. **Preparar** estrutura baseada no exemplo de clientes

**Estrutura a criar:**
```
src/
├── components/[entidade]/
│   ├── [Entidade]Filter.vue
│   ├── [Entidade]Table.vue
│   └── [Entidade]Cards.vue
└── views/[entidade]/
    ├── [Entidade]View.vue
    ├── [Entidade]FormView.vue
    └── [Entidade]DetailsView.vue
```

---

## ETAPA 7: CRIAÇÃO DO COMPONENTE DE FILTROS

### 📋 Checklist Etapa 7
- [ ] Criar componente de filtros
- [ ] Adaptar campos de busca para nova entidade

### 📝 Ações
1. **Copiar** `src/components/clients/ClientsFilter.vue`
2. **Renomear** para `src/components/[entidade]/[Entidade]Filter.vue`
3. **Substituir** todas ocorrências de:
   - `Client` → `Produto`
   - `client` → `produto`
   - Campos específicos nos filtros avançados
4. **Adaptar** campos de filtro conforme sua entidade
5. **Manter** estrutura de emits e lógica de filtros

**Arquivo base:** `src/components/clients/ClientsFilter.vue`
**Arquivo destino:** `src/components/[entidade]/[Entidade]Filter.vue`

---

## ETAPA 8: CRIAÇÃO DO COMPONENTE DE TABELA (DESKTOP)

### 📋 Checklist Etapa 8
- [ ] Criar componente de tabela
- [ ] Adaptar colunas para nova entidade

### 📝 Ações
1. **Copiar** `src/components/clients/ClientsTable.vue`
2. **Renomear** para `src/components/[entidade]/[Entidade]Table.vue`
3. **Substituir** todas ocorrências de:
   - `clients` → `produtos`
   - `Client` → `Produto`
   - `client` → `produto`
   - Import do service para o novo service
4. **Adaptar** colunas da tabela:
   - Headers (`<th>`)
   - Células de dados (`<td>`)
   - Campos ordenáveis
5. **Ajustar** rotas de navegação (visualizar, editar)
6. **Manter** toda lógica de ações, paginação e menu

**Arquivo base:** `src/components/clients/ClientsTable.vue`
**Arquivo destino:** `src/components/[entidade]/[Entidade]Table.vue`

---

## ETAPA 9: CRIAÇÃO DO COMPONENTE DE CARDS (MOBILE)

### 📋 Checklist Etapa 9
- [ ] Criar componente de cards mobile
- [ ] Adaptar layout dos cards

### 📝 Ações
1. **Copiar** `src/components/clients/ClientsCards.vue`
2. **Renomear** para `src/components/[entidade]/[Entidade]Cards.vue`
3. **Substituir** todas ocorrências de:
   - `clients` → `produtos`
   - `Client` → `Produto`
   - `client` → `produto`
   - Import do service
4. **Adaptar** layout do card:
   - Campos exibidos
   - Estrutura de metadados
5. **Manter** lógica de ações e paginação

**Arquivo base:** `src/components/clients/ClientsCards.vue`
**Arquivo destino:** `src/components/[entidade]/[Entidade]Cards.vue`

---

## ETAPA 10: CRIAÇÃO DA VIEW PRINCIPAL (LISTAGEM)

### 📋 Checklist Etapa 10
- [ ] Criar view principal de listagem
- [ ] Integrar todos os componentes criados

### 📝 Ações
1. **Copiar** `src/views/clients/ClientsView.vue`
2. **Renomear** para `src/views/[entidade]/[Entidade]View.vue`
3. **Substituir** todas ocorrências de:
   - `clients` → `produtos`
   - `Client` → `Produto`
   - `ClientsFilter` → `ProdutosFilter`
   - `ClientsTable` → `ProdutosTable`
   - `ClientsCards` → `ProdutosCards`
   - Import do store
4. **Atualizar** imports dos componentes criados
5. **Ajustar** rota de navegação para novo item
6. **Manter** toda lógica de integração

**Arquivo base:** `src/views/clients/ClientsView.vue`
**Arquivo destino:** `src/views/[entidade]/[Entidade]View.vue`

---

## ETAPA 11: CRIAÇÃO DO FORMULÁRIO (CREATE/EDIT)

### 📋 Checklist Etapa 11
- [ ] Criar formulário para criação e edição
- [ ] Adaptar campos conforme nova entidade

### 📝 Ações
1. **Copiar** `src/views/clients/ClientFormView.vue`
2. **Renomear** para `src/views/[entidade]/[Entidade]FormView.vue`
3. **Substituir** todas ocorrências de:
   - `client` → `produto`
   - `Client` → `Produto`
   - `ClientForm` → `ProdutoForm`
   - Import do service e tipos
4. **Adaptar** campos do formulário:
   - Labels e inputs
   - Validações específicas
   - Máscaras (se necessário)
5. **Ajustar** rotas de navegação
6. **Manter** lógica de modo duplo (create/edit)

**Arquivo base:** `src/views/clients/ClientFormView.vue`
**Arquivo destino:** `src/views/[entidade]/[Entidade]FormView.vue`

---

## ETAPA 12: CRIAÇÃO DA VIEW DE DETALHES

### 📋 Checklist Etapa 12
- [ ] Criar view de visualização/detalhes
- [ ] Adaptar campos exibidos

### 📝 Ações
1. **Copiar** `src/views/clients/ClientDetailsView.vue`
2. **Renomear** para `src/views/[entidade]/[Entidade]DetailsView.vue`
3. **Substituir** todas ocorrências de:
   - `client` → `produto`
   - `Client` → `Produto`
   - Import do service
4. **Adaptar** campos exibidos:
   - Dados mostrados
   - Formatação específica
   - Labels e valores
5. **Ajustar** rotas de navegação
6. **Manter** lógica de ações (editar, excluir)

**Arquivo base:** `src/views/clients/ClientDetailsView.vue`
**Arquivo destino:** `src/views/[entidade]/[Entidade]DetailsView.vue`

---

## ETAPA 13: ATUALIZAÇÃO DO MENU (OPCIONAL)

### 📋 Checklist Etapa 13
- [ ] Adicionar nova entidade ao menu lateral
- [ ] Configurar ícone apropriado

### 📝 Ações
1. **Editar** `src/components/layout/AppSidebar.vue`
2. **Adicionar** novo item ao array `menuItems`:
   ```javascript
   {
     title: "Produtos",
     icon: "cube", // ou outro ícone
     route: "/produtos"
   }
   ```
3. **Importar** ícone se necessário

**Arquivo para editar:** `src/components/layout/AppSidebar.vue`
**Seção:** array `menuItems`

---

## ETAPA 14: TESTES E VALIDAÇÃO

### 📋 Checklist Etapa 14
- [ ] Testar todas as rotas
- [ ] Verificar operações CRUD
- [ ] Validar responsividade
- [ ] Confirmar filtros e paginação

### 📝 Ações
1. **Acessar** rota principal `/[entidade]`
2. **Testar** criação de novo item
3. **Testar** edição de item existente
4. **Testar** visualização de detalhes
5. **Testar** exclusão com confirmação
6. **Validar** filtros funcionando
7. **Verificar** paginação
8. **Testar** ordenação por colunas
9. **Confirmar** responsividade (desktop/mobile)
10. **Verificar** notificações

---

## ETAPA 15: AJUSTES FINAIS

### 📋 Checklist Etapa 15
- [ ] Corrigir erros encontrados
- [ ] Ajustar formatação de dados
- [ ] Otimizar experiência do usuário
- [ ] Validar console sem erros

### 📝 Ações
1. **Verificar** console do navegador
2. **Corrigir** imports quebrados
3. **Ajustar** formatação de dados específicos
4. **Testar** fluxos completos
5. **Validar** mensagens de erro/sucesso

---

## RESUMO DE ARQUIVOS PARA COPIAR/ADAPTAR

### Arquivos Base → Novos Arquivos

1. **Tipos:** `client.types.ts` → `[entidade].types.ts`
2. **Serviço:** `clientsService.ts` → `[entidade]Service.ts`
3. **Store:** `clientsStore.ts` → `[entidade]Store.ts`
4. **Filtros:** `ClientsFilter.vue` → `[Entidade]Filter.vue`
5. **Tabela:** `ClientsTable.vue` → `[Entidade]Table.vue`
6. **Cards:** `ClientsCards.vue` → `[Entidade]Cards.vue`
7. **Listagem:** `ClientsView.vue` → `[Entidade]View.vue`
8. **Formulário:** `ClientFormView.vue` → `[Entidade]FormView.vue`
9. **Detalhes:** `ClientDetailsView.vue` → `[Entidade]DetailsView.vue`

### Arquivos para Editar

1. **Router:** `src/router/index.ts` (adicionar rotas)
2. **Menu:** `src/components/layout/AppSidebar.vue` (adicionar item)

### Padrão de Substituições

Em todos os arquivos copiados, fazer substituições globais:
- `Client` → `[NovaEntidade]` (PascalCase)
- `client` → `[novaentidade]` (camelCase)
- `clients` → `[novasentidades]` (plural)
- `/clients` → `/[novasentidades]` (rotas)
- Campos específicos conforme sua entidade

Este guia garante que você replique exatamente a estrutura e funcionalidades do CRUD de clientes para qualquer nova entidade.