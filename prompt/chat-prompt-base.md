# Template de Prompt para Chat Criar Instruções para Agente

## [PROMPT BASE PARA GUIAR O CHAT]:

Você deve criar um guia de desenvolvimento passo-a-passo para um agente de AI que executará as tarefas em um projeto Vue.js 3 com TypeScript rodando em Docker. O agente tem capacidades limitadas e se perde com tarefas complexas, então siga estas diretrizes rigorosamente:

### REGRAS FUNDAMENTAIS:

1. **Decomposição Extrema**: Divida CADA funcionalidade em tarefas de no máximo 3-5 ações
2. **Uma Coisa Por Vez**: Cada tarefa deve fazer APENAS uma coisa específica
3. **Validação Constante**: Após cada tarefa, inclua um comando de verificação
4. **Sem Dependências Complexas**: Evite tarefas que dependam de múltiplos arquivos simultaneamente

### FORMATO OBRIGATÓRIO PARA CADA TAREFA:

```markdown
## Tarefa X.Y: [Nome Descritivo Curto]

### Objetivo
[Uma única frase clara do que será feito]

### Arquivo
`src/path/to/file.ext`

### Código
```[linguagem]
[Código COMPLETO do arquivo - não use "..." ou comentários como "resto do código"]
```

### Validação
```bash
docker compose exec vue-app npm run type-check
```

### Critério de Sucesso
- [ ] Arquivo criado/modificado com sucesso
- [ ] Sem erros no type-check
- [ ] [Outro critério específico e verificável]
```

### ESTRUTURA DO GUIA:

1. **Fase de Preparação** (1-2 tarefas)
   - Verificar ambiente
   - Instalar dependências (uma por vez)

2. **Fase de Estrutura** (2-3 tarefas)
   - Criar diretórios
   - Criar arquivos base vazios
   - Adicionar estrutura HTML mínima

3. **Fase de Funcionalidade** (3-5 tarefas)
   - Adicionar lógica básica
   - Adicionar interatividade
   - Conectar componentes

4. **Fase de Estilização** (2-3 tarefas)
   - CSS básico inline primeiro
   - Mover para arquivo separado
   - Adicionar responsividade

### EXEMPLO DE TAREFA BEM DECOMPOSTA:

```markdown
## Tarefa 2.1: Criar Componente Header Vazio

### Objetivo
Criar o arquivo do componente AppHeader com estrutura mínima

### Arquivo
`src/components/layout/AppHeader.vue`

### Código
```vue
<template>
  <header class="app-header">
    <h1>Admin Panel</h1>
  </header>
</template>

<script setup lang="ts">
// Componente vazio por enquanto
</script>

<style scoped>
.app-header {
  background: #f0f0f0;
  padding: 1rem;
}
</style>
```

### Validação
```bash
docker compose exec vue-app npm run type-check
```

### Critério de Sucesso
- [ ] Arquivo criado em src/components/layout/AppHeader.vue
- [ ] npm run type-check passa sem erros
```

### EVITE:

1. **Tarefas com múltiplas responsabilidades**
   - ❌ "Crie um componente sidebar com menu, ícones e animações"
   - ✅ "Crie componente sidebar vazio" → "Adicione lista de menu" → "Adicione ícones"

2. **Configurações complexas de uma vez**
   - ❌ "Configure Sass com variáveis, mixins e temas"
   - ✅ "Instale Sass" → "Crie arquivo de variáveis" → "Teste uma variável"

3. **Dependências entre arquivos na mesma tarefa**
   - ❌ "Crie o componente e já importe no App.vue"
   - ✅ "Crie o componente" → "Importe o componente no App.vue"

4. **Instruções vagas**
   - ❌ "Adicione estilos apropriados"
   - ✅ "Adicione padding: 1rem e background: #f0f0f0"

### TECNOLOGIAS DO PROJETO:
- Vue 3.5 com Composition API (`<script setup>`)
- TypeScript 5.8 (usar tipos e interfaces sempre)
- Vite 6.2 (não modificar vite.config.ts sem necessidade)
- Docker (todos comandos com `docker compose exec vue-app`)
- Pinia para estado global
- Vue Router 4 para rotas

### COMANDOS DISPONÍVEIS:
```bash
docker compose exec vue-app npm install [pacote]
docker compose exec vue-app npm run dev
docker compose exec vue-app npm run type-check
docker compose exec vue-app npm run lint
docker compose exec vue-app npm run build
```

Agora, com base nessas diretrizes, crie um guia passo-a-passo para:

## [MINHA DESCRIÇÃO DO QUE QUERO QUE SEJA CONSTRUÍDO]

[Aqui você descreve sua funcionalidade]

---

# Exemplo de Uso:

## [PROMPT BASE PARA GUIAR O CHAT]:
[Cole todo o conteúdo acima]

## [MINHA DESCRIÇÃO DO QUE QUERO QUE SEJA CONSTRUÍDO]:

Preciso criar um layout base para painel administrativo com:
- Sidebar lateral fixa com menu de navegação
- Header superior com título e informações do usuário
- Área de conteúdo principal que ocupa o espaço restante
- Design responsivo que em mobile a sidebar vira um menu hambúrguer
- Usar Sass para os estilos com variáveis para cores e espaçamentos
- O layout deve envolver as rotas do Vue Router

---

# Resultado Esperado:

O chat criará um artefato com 15-20 tarefas pequenas e específicas que o agente conseguirá executar sequencialmente sem se perder, cada uma validável e independente.