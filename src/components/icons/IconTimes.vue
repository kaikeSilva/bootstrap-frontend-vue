<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    :width="size" 
    :height="size" 
    :viewBox="viewBox"
    fill="currentColor"
    :class="className"
  >
    <!-- SVG path for times/close icon -->
    <path d="M6.2 6.2a1 1 0 0 1 1.4 0L12 10.6l4.4-4.4a1 1 0 0 1 1.4 1.4L13.4 12l4.4 4.4a1 1 0 0 1-1.4 1.4L12 13.4l-4.4 4.4a1 1 0 0 1-1.4-1.4L10.6 12 6.2 7.6a1 1 0 0 1 0-1.4z"/>
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
