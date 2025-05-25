<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Login</h1>
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
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

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
      router.push('/')
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
  height: 100vh; /* Use fixed height instead of min-height */
  width: 100vw; /* Ensure full width */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  position: fixed; /* Fix position to viewport */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10; /* Ensure it's above other content */
  overflow: auto; /* Allow scrolling if needed */
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  color: #333;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #222;
  font-size: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;
  color: #333;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
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
