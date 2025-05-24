<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Bem-vindo ao painel administrativo!</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <IconUsers class="stat-icon" />
        <h3>150</h3>
        <p>Usuários</p>
      </div>
      
      <div class="stat-card">
        <IconShoppingCart class="stat-icon" />
        <h3>45</h3>
        <p>Pedidos</p>
      </div>
      
      <div class="stat-card">
        <IconDollarSign class="stat-icon" />
        <h3>R$ 12.500</h3>
        <p>Receita</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconUsers from '@/components/icons/IconUsers.vue'
import IconShoppingCart from '@/components/icons/IconShoppingCart.vue'
import IconDollarSign from '@/components/icons/IconDollarSign.vue'
</script>

<style scoped lang="scss">
.dashboard {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  
  h1 {
    margin-bottom: 0.5rem;
    color: #111;
    font-weight: 700;
  }
  
  p {
    color: #333;
    margin-bottom: 2rem;
    font-weight: 500;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.stat-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  .stat-icon {
    width: 32px;
    height: 32px;
    color: #1565C0; /* Azul mais escuro que o primary-color padrão */
    margin-bottom: 10px;
  }
  
  h3 {
    font-size: 2rem;
    margin: 0.5rem 0;
    color: #222;
    font-weight: 600;
  }
  
  p {
    margin: 0;
    color: #333;
    font-weight: 500;
  }
}
</style>
