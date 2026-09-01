import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import PostDetail from './views/PostDetail.vue'
import About from './views/About.vue'
import Projects from './views/Projects.vue'
import { useTheme } from './composables/useTheme.js'
import './styles/global.css'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/post/:slug', name: 'post', component: PostDetail },
  { path: '/about', name: 'about', component: About },
  { path: '/projects', name: 'projects', component: Projects },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// scroll-reveal directive
const scrollReveal = {
  mounted(el) {
    el.classList.add('scroll-reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
  }
}

// init theme before mount
useTheme().init()

createApp(App)
  .use(router)
  .directive('scroll-reveal', scrollReveal)
  .mount('#app')