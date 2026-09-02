<script setup>
import GlassNav from './components/GlassNav.vue'
import AutoScroll from './components/AutoScroll.vue'
import { RouterView } from 'vue-router'
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const snapContainer = ref(null)

function scrollToTop() {
  if (snapContainer.value) {
    snapContainer.value.scrollTop = 0
    const panels = snapContainer.value.querySelectorAll('.panel')
    panels.forEach(p => {
      p.classList.remove('in-view')
      // reset inline styles
      const children = p.children
      for (let j = 0; j < children.length; j++) {
        children[j].style.opacity = ''
        children[j].style.transform = ''
        children[j].style.transitionDelay = ''
      }
    })
  }
}

onMounted(() => {
  scrollToTop()
})

// Use a longer delay to ensure new component is fully rendered
watch(() => route.path, () => {
  scrollToTop()
  // also notify AutoScroll to reinit after route change
  window.dispatchEvent(new CustomEvent('route-change'))
}, { flush: 'post' })
</script>

<template>
  <div class="app-shell">
    <GlassNav />
    <div ref="snapContainer" class="snap-container">
      <RouterView />
    </div>
    <AutoScroll />
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
</style>