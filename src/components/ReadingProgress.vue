<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

function onScroll() {
  const el = document.documentElement
  const scrollTop = el.scrollTop || document.body.scrollTop
  const scrollHeight = el.scrollHeight - el.clientHeight
  progress.value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="reading-progress" :style="{ width: progress + '%' }"></div>
</template>