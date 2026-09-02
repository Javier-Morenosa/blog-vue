<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// ── Dynamic timing ──────────────────────────────────
const WORDS_PER_MINUTE = 220
const MIN_DURATION = 4000
const MAX_DURATION = 30000
const READING_BUFFER = 2000

const currentDuration = ref(10000)

const isActive = ref(true)
const remaining = ref(currentDuration.value)
const progress = ref(0)
const currentPanelIndex = ref(0)
const totalPanels = ref(0)
const isEndPanel = ref(false)  // true when on last panel of a post

let intervalId = null
let userScrollTimer = null
let container = null
let isAnimating = false

const R = 14
const CIRCUMFERENCE = 2 * Math.PI * R
const dashOffset = computed(() => CIRCUMFERENCE * (1 - progress.value))

function getContainer() {
  return document.querySelector('.snap-container')
}

function getPanels() {
  const c = getContainer()
  if (!c) return []
  return Array.from(c.querySelectorAll('.panel'))
}

// ── Check if current route is a post detail ──────────
function isPostDetail() {
  return route.path.startsWith('/post/')
}

function countWords(panel) {
  if (!panel) return 0
  const text = panel.textContent || ''
  return text.trim().split(/\s+/).filter(w => w.length > 0).length
}

function calcDuration(panel) {
  const words = countWords(panel)
  const readingMs = (words / WORDS_PER_MINUTE) * 60 * 1000
  const total = readingMs + READING_BUFFER
  return Math.max(MIN_DURATION, Math.min(MAX_DURATION, total))
}

function updatePanelVisibility() {
  const c = getContainer()
  if (!c) return
  const panels = getPanels()
  const panelHeight = c.clientHeight
  const idx = Math.round(c.scrollTop / panelHeight)
  currentPanelIndex.value = idx
  totalPanels.value = panels.length

  // detect if we're on the last panel of a post
  isEndPanel.value = isPostDetail() && idx === panels.length - 1

  panels.forEach((p, i) => {
    const children = p.children
    for (let j = 0; j < children.length; j++) {
      const child = children[j]
      if (i === idx) {
        child.style.opacity = '1'
        child.style.transform = 'translateY(0) scale(1)'
        child.style.transitionDelay = (j * 80) + 'ms'
      } else {
        child.style.opacity = '0'
        child.style.transform = 'translateY(30px) scale(0.98)'
        child.style.transitionDelay = '0ms'
      }
    }
    if (i === idx) p.classList.add('in-view')
    else p.classList.remove('in-view')
  })

  if (panels[idx]) {
    currentDuration.value = calcDuration(panels[idx])
  }
}

function scrollToPanel(index) {
  const c = getContainer()
  if (!c) return
  const panels = getPanels()
  if (index < 0 || index >= panels.length) return

  isAnimating = true
  panels[index].scrollIntoView({ behavior: 'smooth' })
  setTimeout(() => { isAnimating = false }, 600)
}

function scrollToNext() {
  const c = getContainer()
  if (!c) return
  const panels = getPanels()
  const currentTop = c.scrollTop
  const panelHeight = c.clientHeight
  const currentIndex = Math.round(currentTop / panelHeight)

  if (currentIndex < panels.length - 1) {
    scrollToPanel(currentIndex + 1)
  } else {
    // At the last panel
    if (isPostDetail()) {
      // End of a post: stop auto-scroll, let user manually scroll to go back
      isActive.value = false
      clearTimers()
    } else {
      // On home or other pages: loop back to top
      isAnimating = true
      c.scrollTo({ top: 0, behavior: 'smooth' })
      setTimeout(() => { isAnimating = false }, 1000)
    }
  }
}

function clearTimers() {
  clearInterval(intervalId)
  clearTimeout(userScrollTimer)
}

function startTimer() {
  if (!isActive.value) return
  clearTimers()

  const tickMs = 30
  intervalId = setInterval(() => {
    remaining.value -= tickMs
    progress.value = 1 - (remaining.value / currentDuration.value)
    if (remaining.value <= 0) {
      clearInterval(intervalId)
      remaining.value = currentDuration.value
      progress.value = 0
      scrollToNext()
      intervalId = setTimeout(() => {
        if (isActive.value) startTimer()
      }, 1000)
    }
  }, tickMs)
}

function resetTimer() {
  remaining.value = currentDuration.value
  progress.value = 0
  clearInterval(intervalId)
  startTimer()
}

function onUserScroll() {
  updatePanelVisibility()
  if (isAnimating) return

  // If user scrolls down past the end panel of a post, go to feed
  const c = getContainer()
  if (c && isPostDetail()) {
    const panels = getPanels()
    const idx = Math.round(c.scrollTop / c.clientHeight)
    if (idx >= panels.length) {
      router.push('/')
      return
    }
  }

  clearTimeout(userScrollTimer)
  clearInterval(intervalId)
  userScrollTimer = setTimeout(() => {
    if (isActive.value) {
      resetTimer()
    }
  }, 1500)
}

function toggleAutoScroll() {
  isActive.value = !isActive.value
  if (isActive.value) {
    resetTimer()
  } else {
    clearTimers()
  }
}

function onKeydown(e) {
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault()
    const c = getContainer()
    if (!c) return
    const panels = getPanels()
    const idx = Math.round(c.scrollTop / c.clientHeight)
    if (idx < panels.length - 1) scrollToPanel(idx + 1)
    else if (isPostDetail()) router.push('/')
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault()
    const c = getContainer()
    if (!c) return
    const idx = Math.round(c.scrollTop / c.clientHeight)
    if (idx > 0) scrollToPanel(idx - 1)
  }
}

function init() {
  container = getContainer()
  if (container) {
    container.scrollTop = 0
    container.removeEventListener('scroll', onUserScroll)
    container.addEventListener('scroll', onUserScroll, { passive: true })
  }
  const panels = getPanels()
  panels.forEach(p => {
    p.classList.remove('in-view')
    const children = p.children
    for (let j = 0; j < children.length; j++) {
      children[j].style.opacity = '0'
      children[j].style.transform = 'translateY(30px) scale(0.98)'
      children[j].style.transitionDelay = '0ms'
    }
  })
  if (container) container.scrollTop = 0
  if (panels.length) {
    currentDuration.value = calcDuration(panels[0])
    remaining.value = currentDuration.value

    const firstPanel = panels[0]
    const children = firstPanel.children
    void firstPanel.offsetHeight
    firstPanel.classList.add('in-view')
    for (let j = 0; j < children.length; j++) {
      children[j].style.opacity = '1'
      children[j].style.transform = 'translateY(0) scale(1)'
      children[j].style.transitionDelay = (j * 80) + 'ms'
    }
    currentPanelIndex.value = 0
    totalPanels.value = panels.length
    isEndPanel.value = isPostDetail() && panels.length === 1
  }
  resetTimer()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('route-change', init)
  setTimeout(() => init(), 200)
})

onUnmounted(() => {
  clearTimers()
  if (container) {
    container.removeEventListener('scroll', onUserScroll)
  }
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('route-change', init)
})

watch(() => route.path, () => {
  setTimeout(() => init(), 300)
})
</script>

<template>
  <div class="autoscroll-wrapper">
    <!-- Snap dots -->
    <div class="snap-dots" v-if="totalPanels > 1">
      <button
        v-for="i in totalPanels"
        :key="i"
        class="snap-dot"
        :class="{ active: currentPanelIndex === i - 1 }"
        @click="scrollToPanel(i - 1)"
        :aria-label="`panel ${i}`"
      />
    </div>

    <!-- Auto-scroll indicator -->
    <button
      class="autoscroll-indicator"
      :class="{ paused: !isActive, end: isEndPanel }"
      @click="toggleAutoScroll"
      :title="isActive ? 'auto-scroll active — click to pause' : 'auto-scroll paused — click to resume'"
    >
      <svg class="progress-ring" width="36" height="36" viewBox="0 0 36 36">
        <circle
          class="ring-bg"
          cx="18" cy="18" :r="R"
          fill="none"
          :stroke-width="2"
        />
        <circle
          class="ring-fill"
          cx="18" cy="18" :r="R"
          fill="none"
          :stroke-width="2"
          :stroke-dasharray="CIRCUMFERENCE"
          :stroke-dashoffset="dashOffset"
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span class="indicator-icon">{{ isActive ? (isEndPanel ? '⏎' : '↓') : '⏸' }}</span>
    </button>
  </div>
</template>

<style scoped>
.autoscroll-wrapper {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 200;
  pointer-events: none;
}

.snap-dots,
.autoscroll-indicator {
  pointer-events: auto;
}

.autoscroll-indicator {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0;
}

.autoscroll-indicator:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-md), 0 0 0 4px var(--accent-soft);
  transform: scale(1.05);
}

.autoscroll-indicator.end {
  border-color: var(--accent);
  box-shadow: var(--shadow-md), 0 0 12px var(--accent-glow);
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
}

.ring-bg {
  stroke: var(--glass-border);
}

.ring-fill {
  stroke: var(--accent);
  transition: stroke-dashoffset 0.03s linear;
}

.indicator-icon {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-secondary);
  transition: color 0.2s ease;
}

.autoscroll-indicator:hover .indicator-icon {
  color: var(--accent);
}

.autoscroll-indicator.end .indicator-icon {
  color: var(--accent);
}

.autoscroll-indicator.paused .ring-fill {
  stroke: var(--text-tertiary);
}

@media (max-width: 640px) {
  .autoscroll-indicator {
    bottom: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
  }

  .snap-dots {
    display: none;
  }
}
</style>