<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="size" 
    :height="size" 
    :viewBox="viewBox"
    fill="currentColor"
    :class="className"
  >
    <path v-if="type === 'asc'" d="M7 10l5 5 5-5z"/>
    <path v-else-if="type === 'desc'" d="M7 14l5-5 5 5z"/>
    <path v-else d="M7 10l5 5 5-5z M7 14l5-5 5 5z"/>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: string | number
  viewBox?: string
  className?: string
  type?: 'asc' | 'desc' | 'none'
}

withDefaults(defineProps<Props>(), {
  size: 16,
  viewBox: '0 0 24 24',
  className: '',
  type: 'none'
})
</script>
