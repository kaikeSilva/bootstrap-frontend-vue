<template>
  <div class="error-container">
    <div class="error-content">
      <h3 class="error-title">Oops! Algo deu errado</h3>
      <p class="error-message">{{ message }}</p>
      <button class="retry-button" @click="$emit('retry')">
        Tentar Novamente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}

defineProps<Props>()
defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 200px;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-title {
  color: #ef4444;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.retry-button {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2563eb;
}
</style>
