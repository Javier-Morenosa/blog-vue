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
    // also clean in-view classes so AutoScroll can re-apply
    const panels = snapContainer.value.querySelectorAll('.panel')
    panels.forEach(p => p.classList.remove('in-view'))
  }
}

onMounted(() => {
  scrollToTop()
})

watch(() => route.path, () => {
  nextTick(() => scrollToTop())
})
</script>

<template>
  <div class="app-shell">
    <GlassNav />
    <div ref="snapContainer" class="snap-container">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
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