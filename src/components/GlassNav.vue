<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

const scrolled = ref(false)
const menuOpen = ref(false)
const container = ref(null)

function onScroll() {
  const el = document.querySelector('.snap-container')
  if (el) {
    scrolled.value = el.scrollTop > 20
  }
}

onMounted(() => {
  const el = document.querySelector('.snap-container')
  if (el) el.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => {
  const el = document.querySelector('.snap-container')
  if (el) el.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <nav class="glass-nav glass" :class="{ scrolled }">
    <div class="nav-inner">
      <RouterLink to="/" class="nav-logo mono" @click="menuOpen = false">
        <span class="logo-bracket text-tertiary">{</span>jm<span class="logo-bracket text-tertiary">}</span>
      </RouterLink>

      <button class="menu-toggle" @click="menuOpen = !menuOpen" aria-label="Menu">
        <span></span><span></span>
      </button>

      <div class="nav-links" :class="{ open: menuOpen }">
        <RouterLink to="/" @click="menuOpen = false">posts</RouterLink>
        <RouterLink to="/projects" @click="menuOpen = false">projects</RouterLink>
        <RouterLink to="/about" @click="menuOpen = false">about</RouterLink>
        <a href="https://github.com/Javier-Morenosa" target="_blank" rel="noopener">github</a>
        <ThemeToggle />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.glass-nav {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 200;
  border-radius: 100px;
  height: var(--nav-height);
  width: auto;
  min-width: 360px;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.glass-nav.scrolled {
  border-color: var(--glass-border-hover);
  box-shadow: var(--shadow-glass), var(--shadow-md);
}

.nav-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  gap: 1.5rem;
}

.nav-logo {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.logo-bracket {
  font-weight: 400;
  margin: 0 1px;
}

.nav-links {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.nav-links a {
  font-family: var(--font-mono);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  transition: color 0.2s ease;
  position: relative;
  white-space: nowrap;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--text-primary);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  transform: scaleX(1);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.menu-toggle span {
  width: 18px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 1px;
}

@media (max-width: 640px) {
  .glass-nav {
    left: 16px;
    right: 16px;
    transform: none;
    min-width: 0;
  }

  .menu-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 76px;
    left: 16px;
    right: 16px;
    flex-direction: column;
    align-items: flex-start;
    background: var(--bg-secondary);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: 1.25rem;
    gap: 1rem;
    transform: translateY(-120%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .nav-links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
}
</style>