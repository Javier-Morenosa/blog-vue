<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  containerSelector: { type: String, default: '.post-body' }
})

const headings = ref([])
const activeId = ref('')

function extractHeadings() {
  const container = document.querySelector(props.containerSelector)
  if (!container) return
  const h2s = container.querySelectorAll('h2')
  headings.value = Array.from(h2s).map((h, i) => {
    if (!h.id) h.id = `toc-${i}`
    return { id: h.id, text: h.textContent }
  })
}

function onScroll() {
  const scrollY = window.scrollY + 120
  let current = ''
  for (const h of headings.value) {
    const el = document.getElementById(h.id)
    if (el && el.offsetTop <= scrollY) {
      current = h.id
    }
  }
  activeId.value = current
}

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    extractHeadings()
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav class="toc" v-if="headings.length > 1">
    <p class="toc-title mono">$ contents</p>
    <ul class="toc-list">
      <li v-for="h in headings" :key="h.id">
        <a
          :href="`#${h.id}`"
          class="toc-link"
          :class="{ active: activeId === h.id }"
          @click.prevent="scrollToHeading(h.id)"
        >{{ h.text }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  methods: {
    scrollToHeading(id) {
      const el = document.getElementById(id)
      if (el) {
        const offset = 80
        const top = el.offsetTop - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }
  }
}
</script>