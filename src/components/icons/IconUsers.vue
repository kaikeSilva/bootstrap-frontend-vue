<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="size" 
    :height="size" 
    :viewBox="viewBox"
    fill="currentColor"
    :class="className"
  >
    <!-- SVG path for users icon -->
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
    <path d="M9 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 14a3.5 3.5 0 00-3.5 3.5V18h7v-.5a3.5 3.5 0 00-3.5-3.5z" opacity=".5"/>
    <path d="M18 7a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM17.5 14a3.5 3.5 0 013.5 3.5v.5h-7v-.5a3.5 3.5 0 013.5-3.5z" opacity=".5"/>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: string | number
  viewBox?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  size: 20,
  viewBox: '0 0 24 24',
  className: ''
})
</script>
