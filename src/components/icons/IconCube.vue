<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="size" 
    :height="size" 
    :viewBox="viewBox"
    fill="currentColor"
    :class="className"
  >
    <!-- SVG path for cube icon -->
    <path d="M12.186 8.672L18.743 5.5 12 2.001 5.257 5.5l6.557 3.172a.5.5 0 0 0 .372 0zM5 6.57v6.515a.5.5 0 0 0 .252.434l6.5 3.25a.5.5 0 0 0 .496 0l6.5-3.25a.5.5 0 0 0 .252-.434V6.57l-6.5 3.25a1.5 1.5 0 0 1-1.496 0L5 6.57z"/>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: string | number
  viewBox?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  size: 32,
  viewBox: '0 0 24 24',
  className: ''
})
</script>
