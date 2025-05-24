## 📌 Funcionalidades Futuras

1. **Sistema de autenticação e controle de acesso (login/logout, roles)**
2. **Layouts diferentes por tipo de usuário**
3. **Internacionalização (i18n)**
4. **Persistência de preferências do usuário (tema, sidebar colapsada)**
5. **Sistema de notificações e toasts**
6. **Exibição do status de conexão WebSocket**
7. **Loading indicators ou skeleton screens**
8. **Componentes reutilizáveis como cards, tabelas e formulários genéricos**

## Implementações Futuras

### Autenticação & Autorização
- **Login/Logout**: Implementar telas de autenticação usando os endpoints `/login`, `/register`, `/logout`
- **Token Management**: Interceptor para incluir Bearer token nas requisições
- **Guards de Rota**: Proteção das rotas baseada em autenticação
- **Store de Auth**: Gerenciamento do estado do usuário logado

### WebSocket em Tempo Real
- **Atualização Live**: Integrar com Laravel Echo para receber atualizações de clientes em tempo real
- **Notificações**: Mostrar toast quando novos clientes são cadastrados por outros usuários
- **Status de Conexão**: Indicador visual do status da conexão WebSocket

### Funcionalidades da Tabela
- **Paginação**: Implementar paginação server-side com controles de navegação
- **Busca Global**: Campo de busca que filtra por nome, email ou telefone
- **Ordenação**: Colunas clicáveis para ordenar dados
- **Filtros Avançados**: Filtros por data de cadastro, status, etc.

### CRUD Completo
- **Criação**: Modal ou página para cadastrar novos clientes
- **Edição**: Edição inline ou modal para atualizar dados
- **Exclusão**: Confirmação e soft delete de clientes
- **Visualização Detalhada**: Modal ou página com todos os dados do cliente

### Melhorias de UX
- **Skeleton Loading**: Substituir spinner por skeleton screens
- **Infinite Scroll**: Carregamento progressivo dos dados
- **Export/Import**: Funcionalidades para exportar dados em CSV/Excel
- **Dark Mode**: Suporte completo para tema escuro
- **Breadcrumbs**: Navegação hierárquica
- **Favoritos**: Sistema para marcar clientes importantes

### Performance & Cache
- **Cache Local**: Implementar cache dos dados no Pinia com TTL
- **Debounce**: Otimizar chamadas de busca
- **Virtual Scrolling**: Para grandes volumes de dados
- **Service Worker**: Cache offline dos dados