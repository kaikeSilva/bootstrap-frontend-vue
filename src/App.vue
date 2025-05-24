<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute();
const isAdminRoute = computed(() => route.path.startsWith('/admin'));
</script>

<template>
  <RouterView />
</template>

<style scoped>
.app-header {
  line-height: 1.5;
  padding: 1rem;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem 0;
}

nav {
  width: 100%;
  font-size: 14px;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

nav a {
  display: inline-block;
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

nav a:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

nav a.router-link-active {
  color: #007bff;
  font-weight: 500;
}



@media (min-width: 768px) {
  .app-header {
    padding: 1rem 2rem;
  }
  
  .wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .app-title {
    margin: 0;
  }
  
  nav {
    font-size: 1rem;
    justify-content: flex-end;
  }
}
</style>
