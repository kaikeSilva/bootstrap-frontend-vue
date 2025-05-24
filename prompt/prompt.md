# Guia de Desenvolvimento: Sistema de Autenticação Vue.js 3 + TypeScript

## FASE 1: PREPARAÇÃO

### Tarefa 1.1: Verificar Ambiente Docker

#### Objetivo
Verificar se o container Vue está funcionando corretamente

#### Arquivo
`Nenhum arquivo específico`

#### Código
```bash
docker compose ps
docker compose exec vue-app npm --version
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Container vue-app está em execução
- [ ] npm está funcionando dentro do container
- [ ] type-check executa sem erros

---

### Tarefa 1.2: Instalar Dependências Base

#### Objetivo
Instalar Pinia para gerenciamento de estado global

#### Arquivo
`package.json`

#### Código
```bash
docker compose exec vue-app npm install pinia
```

#### Validação
```bash
docker compose exec vue-app npm list pinia
```

#### Critério de Sucesso
- [ ] Pinia instalado com sucesso
- [ ] Dependência aparece no package.json
- [ ] Comando npm list retorna versão do Pinia

---

### Tarefa 1.3: Configurar Pinia no Main.ts

#### Objetivo
Adicionar Pinia na aplicação Vue principal

#### Arquivo
`src/main.ts`

#### Código
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Arquivo main.ts modificado sem erros
- [ ] type-check passa sem erros de TypeScript
- [ ] Aplicação ainda funciona

---

## FASE 2: ESTRUTURA BASE

### Tarefa 2.1: Criar Diretório de Stores

#### Objetivo
Criar estrutura de pastas para stores do Pinia

#### Arquivo
`Criar diretório`

#### Código
```bash
docker compose exec vue-app mkdir -p src/stores
```

#### Validação
```bash
docker compose exec vue-app ls -la src/stores
```

#### Critério de Sucesso
- [ ] Diretório src/stores criado
- [ ] Diretório está vazio e acessível

---

### Tarefa 2.2: Criar Diretório de Services

#### Objetivo
Criar estrutura de pastas para serviços de API

#### Arquivo
`Criar diretório`

#### Código
```bash
docker compose exec vue-app mkdir -p src/services
```

#### Validação
```bash
docker compose exec vue-app ls -la src/services
```

#### Critério de Sucesso
- [ ] Diretório src/services criado
- [ ] Diretório está vazio e acessível

---

### Tarefa 2.3: Criar Diretório de Views

#### Objetivo
Criar estrutura de pastas para páginas/views

#### Arquivo
`Criar diretório`

#### Código
```bash
docker compose exec vue-app mkdir -p src/views
```

#### Validação
```bash
docker compose exec vue-app ls -la src/views
```

#### Critério de Sucesso
- [ ] Diretório src/views criado
- [ ] Diretório está vazio e acessível

---

## FASE 3: TIPOS E INTERFACES

### Tarefa 3.1: Criar Tipos de Usuário

#### Objetivo
Definir interfaces TypeScript para dados do usuário

#### Arquivo
`src/types/auth.ts`

#### Código
```typescript
export interface User {
  id: number
  name: string
  email: string
  role?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Arquivo src/types/auth.ts criado
- [ ] Interfaces definidas corretamente
- [ ] type-check passa sem erros

---

## FASE 4: SERVIÇOS DE API

### Tarefa 4.1: Criar Serviço Base de API

#### Objetivo
Criar configuração básica do Axios para chamadas de API

#### Arquivo
`src/services/api.ts`

#### Código
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export default api
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Arquivo src/services/api.ts criado
- [ ] Instância do Axios configurada
- [ ] type-check passa sem erros

---

### Tarefa 4.2: Instalar Axios

#### Objetivo
Instalar biblioteca Axios para requisições HTTP

#### Arquivo
`package.json`

#### Código
```bash
docker compose exec vue-app npm install axios
```

#### Validação
```bash
docker compose exec vue-app npm list axios
```

#### Critério de Sucesso
- [ ] Axios instalado com sucesso
- [ ] Dependência aparece no package.json
- [ ] Comando npm list retorna versão do Axios

---

### Tarefa 4.3: Criar Serviço de Autenticação

#### Objetivo
Criar funções específicas para login e logout

#### Arquivo
`src/services/authService.ts`

#### Código
```typescript
import api from './api'
import type { LoginCredentials, AuthResponse } from '../types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/login', credentials)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/logout')
  }
}
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Arquivo src/services/authService.ts criado
- [ ] Funções login e logout definidas
- [ ] type-check passa sem erros

---

## FASE 5: STORE DE AUTENTICAÇÃO

### Tarefa 5.1: Criar Store Auth Básico

#### Objetivo
Criar store Pinia para gerenciar estado de autenticação

#### Arquivo
`src/stores/auth.ts`

#### Código
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => {
    return token.value !== null && user.value !== null
  })

  return {
    user,
    token,
    isAuthenticated
  }
})
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Arquivo src/stores/auth.ts criado
- [ ] Store definido com estado básico
- [ ] type-check passa sem erros

---

### Tarefa 5.2: Adicionar Ação de Login ao Store

#### Objetivo
Implementar função de login no store de autenticação

#### Arquivo
`src/stores/auth.ts`

#### Código
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '../types/auth'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => {
    return token.value !== null && user.value !== null
  })

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      user.value = response.user
      token.value = response.token
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login
  }
})
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Função login adicionada ao store
- [ ] Tratamento de erro implementado
- [ ] type-check passa sem erros

---

### Tarefa 5.3: Adicionar Ação de Logout ao Store

#### Objetivo
Implementar função de logout no store de autenticação

#### Arquivo
`src/stores/auth.ts`

#### Código
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginCredentials } from '../types/auth'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => {
    return token.value !== null && user.value !== null
  })

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials)
      user.value = response.user
      token.value = response.token
      return { success: true }
    } catch (error) {
      return { success: false, error }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.warn('Erro no logout:', error)
    } finally {
      user.value = null
      token.value = null
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout
  }
})
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Função logout adicionada ao store
- [ ] Limpeza de estado implementada
- [ ] type-check passa sem erros

---

## FASE 6: INTERCEPTADOR DE REQUISIÇÕES

### Tarefa 6.1: Criar Interceptador de Token

#### Objetivo
Configurar interceptador para adicionar token automaticamente nas requisições

#### Arquivo
`src/services/interceptors.ts`

#### Código
```typescript
import api from './api'
import { useAuthStore } from '../stores/auth'

export const setupInterceptors = () => {
  api.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    return config
  })
}
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Arquivo src/services/interceptors.ts criado
- [ ] Interceptador configurado corretamente
- [ ] type-check passa sem erros

---

### Tarefa 6.2: Ativar Interceptadores no Main.ts

#### Objetivo
Inicializar interceptadores na aplicação principal

#### Arquivo
`src/main.ts`

#### Código
```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { setupInterceptors } from './services/interceptors'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

setupInterceptors()

app.mount('#app')
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Interceptadores ativados no main.ts
- [ ] Aplicação ainda funciona
- [ ] type-check passa sem erros

---

## FASE 7: COMPONENTE DE LOGIN

### Tarefa 7.1: Criar View de Login Básica

#### Objetivo
Criar componente de página de login com estrutura mínima

#### Arquivo
`src/views/LoginView.vue`

#### Código
```vue
<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      <form>
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email" 
            type="email" 
            placeholder="Digite seu email"
          />
        </div>
        <div class="form-group">
          <label for="password">Senha:</label>
          <input 
            id="password" 
            type="password" 
            placeholder="Digite sua senha"
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// Lógica será adicionada nas próximas tarefas
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Arquivo src/views/LoginView.vue criado
- [ ] Formulário renderiza visualmente
- [ ] type-check passa sem erros

---

### Tarefa 7.2: Adicionar Reatividade ao Formulário

#### Objetivo
Conectar campos do formulário com variáveis reativas

#### Arquivo
`src/views/LoginView.vue`

#### Código
```vue
<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email" 
            v-model="email"
            type="email" 
            placeholder="Digite seu email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Senha:</label>
          <input 
            id="password" 
            v-model="password"
            type="password" 
            placeholder="Digite sua senha"
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleSubmit = () => {
  console.log('Form submitted:', { email: email.value, password: password.value })
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Campos do formulário são reativos
- [ ] v-model funciona corretamente
- [ ] type-check passa sem erros

---

### Tarefa 7.3: Conectar Login com Store

#### Objetivo
Integrar formulário de login com o store de autenticação

#### Arquivo
`src/views/LoginView.vue`

#### Código
```vue
<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Login</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email" 
            v-model="email"
            type="email" 
            placeholder="Digite seu email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Senha:</label>
          <input 
            id="password" 
            v-model="password"
            type="password" 
            placeholder="Digite sua senha"
            required
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const result = await authStore.login({
      email: email.value,
      password: password.value
    })
    
    if (result.success) {
      console.log('Login realizado com sucesso!')
      // Redirecionamento será implementado depois
    } else {
      errorMessage.value = 'Email ou senha incorretos'
    }
  } catch (error) {
    errorMessage.value = 'Erro interno. Tente novamente.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Redirecionamento funciona após login
- [ ] Navegação entre páginas funciona
- [ ] type-check passa sem erros

---

## FASE 9: FINALIZAÇÃO E TESTES

### Tarefa 9.1: Testar Fluxo Completo de Autenticação

#### Objetivo
Verificar se todo o sistema de autenticação funciona end-to-end

#### Arquivo
`Teste manual`

#### Código
```bash
# Iniciar aplicação
docker compose exec vue-app npm run dev

# Acessar no navegador:
# 1. http://localhost:5173/login
# 2. Testar formulário de login
# 3. Verificar redirecionamento para home
# 4. Testar botão de logout
# 5. Verificar redirecionamento para login
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
docker compose exec vue-app npm run build
```

#### Critério de Sucesso
- [ ] Página de login carrega corretamente
- [ ] Formulário é responsivo
- [ ] Estados de loading e erro funcionam
- [ ] Redirecionamentos funcionam
- [ ] Build é gerado sem erros

---

### Tarefa 9.2: Validar Estrutura Final do Projeto

#### Objetivo
Verificar se todos os arquivos foram criados na estrutura correta

#### Arquivo
`Verificação de estrutura`

#### Código
```bash
docker compose exec vue-app find src -type f -name "*.ts" -o -name "*.vue" | sort
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Todos os arquivos estão na estrutura esperada
- [ ] Não há arquivos duplicados ou incorretos
- [ ] type-check final passa sem erros

---

## RESUMO DO SISTEMA IMPLEMENTADO

### ✅ Funcionalidades Implementadas:
1. **Store de Autenticação (Pinia)**
   - Estado global para user e token
   - Ações de login e logout
   - Computed para isAuthenticated

2. **Serviços de API**
   - Configuração do Axios
   - AuthService com login/logout
   - Interceptador automático de token

3. **Sistema de Rotas**
   - Vue Router configurado
   - Rotas para login e home
   - Redirecionamentos funcionais

4. **Interface de Login**
   - Formulário responsivo
   - Validação de campos
   - Estados de loading e erro
   - Integração com store

5. **Página Home**
   - Exibição de dados do usuário
   - Botão de logout funcional
   - Proteção básica de acesso

### 🔧 Tecnologias Utilizadas:
- **Vue 3.5** com Composition API
- **TypeScript 5.8** com tipagem completa
- **Pinia** para gerenciamento de estado
- **Vue Router 4** para navegação
- **Axios** para requisições HTTP
- **Docker** para ambiente de desenvolvimento

### 🚀 Próximos Passos Sugeridos:
1. Implementar guards de rota para proteção automática
2. Adicionar persistência do token no localStorage
3. Implementar refresh token automático
4. Adicionar sistema de roles/permissões
5. Melhorar tratamento de erros da API
6. Adicionar testes unitários

### 📁 Estrutura Final:
```
src/
├── types/
│   └── auth.ts
├── services/
│   ├── api.ts
│   ├── authService.ts
│   └── interceptors.ts
├── stores/
│   └── auth.ts
├── views/
│   ├── LoginView.vue
│   └── HomeView.vue
├── router/
│   └── index.ts
├── App.vue
└── main.ts
```d: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>
```

#### Validação
```bash
docker compose exec vue-app npm run type-check
```

#### Critério de Sucesso
- [ ] Login integrado com store
- [ ] Estados de loading e erro funcionam
- [ ] type-check passa sem erros
