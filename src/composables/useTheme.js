import { ref } from 'vue'

const theme = ref('auto')
const isDark = ref(false)

export function useTheme() {
  function init() {
    const saved = localStorage.getItem('blog-theme')
    if (saved === 'light' || saved === 'dark') {
      theme.value = saved
    } else {
      theme.value = 'auto'
    }
    applyTheme()
  }

  function applyTheme() {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (theme.value === 'dark') {
      root.classList.add('dark')
      isDark.value = true
    } else if (theme.value === 'light') {
      root.classList.add('light')
      isDark.value = false
    } else {
      // auto: check OS
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        root.classList.add('dark')
        isDark.value = true
      } else {
        isDark.value = false
      }
    }
  }

  function toggle() {
    if (theme.value === 'auto') {
      theme.value = isDark.value ? 'light' : 'dark'
    } else if (theme.value === 'light') {
      theme.value = 'dark'
    } else {
      theme.value = 'light'
    }
    localStorage.setItem('blog-theme', theme.value)
    applyTheme()
  }

  function cycle() {
    const order = ['auto', 'light', 'dark']
    const idx = order.indexOf(theme.value)
    theme.value = order[(idx + 1) % order.length]
    localStorage.setItem('blog-theme', theme.value)
    applyTheme()
  }

  return { theme, isDark, init, toggle, cycle, applyTheme }
}