<script setup>
import { useTheme } from '../composables/useTheme.js'

const { theme, cycle } = useTheme()

const icons = {
  auto: '◐',
  light: '☀',
  dark: '☾'
}

const labels = {
  auto: 'auto',
  light: 'light',
  dark: 'dark'
}
</script>

<template>
  <button class="theme-toggle" @click="cycle" :title="`theme: ${labels[theme]}`">
    <span>{{ icons[theme] }}</span>
  </button>
</template>