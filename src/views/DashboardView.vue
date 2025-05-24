<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Bem-vindo ao painel administrativo!</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <i class="fas fa-users"></i>
        <h3>150</h3>
        <p>Usuários</p>
      </div>
      
      <div class="stat-card">
        <i class="fas fa-shopping-cart"></i>
        <h3>45</h3>
        <p>Pedidos</p>
      </div>
      
      <div class="stat-card">
        <i class="fas fa-dollar-sign"></i>
        <h3>R$ 12.500</h3>
        <p>Receita</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Dashboard view
</script>

<style scoped lang="scss">
.dashboard {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  h1 {
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
  
  i {
    font-size: 2.5rem;
    color: #1976d2;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 2rem;
    margin: 0.5rem 0;
  }
  
  p {
    margin: 0;
    color: #666;
  }
}
</style>
