<template>
  <!-- Loading Global (aparece durante navegação entre rotas) -->
  <div v-if="isLoading" class="global-loader">
    <div class="loader-overlay">
      <div class="loader-container">
        <div class="loader-logo">
          <span class="logo-text">2<span class="logo-highlight">go</span></span>
          <span class="logo-badge">events</span>
        </div>
        <div class="loader-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loader-text">Carregando...</p>
      </div>
    </div>
  </div>

  <!-- Skeleton Loading para a página principal (antes do conteúdo carregar) -->
  <div v-if="isPageLoading && !isLoading" class="page-skeleton">
    <div class="skeleton-header">
      <div class="skeleton-logo shimmer"></div>
      <div class="skeleton-search shimmer"></div>
      <div class="skeleton-avatar shimmer"></div>
    </div>
    <div class="skeleton-container">
      <div class="skeleton-filters">
        <div v-for="i in 6" :key="i" class="skeleton-filter shimmer"></div>
      </div>
      <div class="skeleton-section">
        <div class="skeleton-section-header shimmer"></div>
        <div class="skeleton-cards">
          <div v-for="i in 4" :key="i" class="skeleton-card">
            <div class="skeleton-card-image shimmer"></div>
            <div class="skeleton-card-content">
              <div class="skeleton-line shimmer"></div>
              <div class="skeleton-line short shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Conteúdo principal -->
  <router-view v-show="!isLoading && !isPageLoading" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'App'
})

const router = useRouter()
const isLoading = ref(false)
const isPageLoading = ref(true)

// Controla o loading entre navegações de rota
router.beforeEach((to, from, next) => {
  isLoading.value = true
  next()
})

router.afterEach(() => {
  // Pequeno delay para garantir que a página carregou
  setTimeout(() => {
    isLoading.value = false
    isPageLoading.value = false
  }, 500)
})

// Simular loading inicial da página
onMounted(() => {
  setTimeout(() => {
    isPageLoading.value = false
  }, 800)
})
</script>

<style scoped>
/* ========== GLOBAL LOADER ========== */
.global-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-overlay {
  text-align: center;
}

.loader-container {
  animation: fadeInUp 0.5s ease;
}

.loader-logo {
  margin-bottom: 2rem;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 800;
  background: white;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.logo-highlight {
  background: linear-gradient(135deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  background-clip: text;
}

.logo-badge {
  font-size: 0.8rem;
  font-weight: 500;
  background: rgba(255,255,255,0.2);
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  margin-left: 0.25rem;
}

.loader-spinner {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
}

.spinner-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid transparent;
  animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

.spinner-ring:nth-child(1) {
  border-top-color: rgba(255,255,255,0.9);
  animation-delay: 0s;
}

.spinner-ring:nth-child(2) {
  border-right-color: rgba(255,255,255,0.6);
  animation-delay: 0.2s;
}

.spinner-ring:nth-child(3) {
  border-bottom-color: rgba(255,255,255,0.3);
  animation-delay: 0.4s;
  width: 70%;
  height: 70%;
  top: 15%;
  left: 15%;
}

.loader-text {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 1px;
  animation: pulse 1.5s ease infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== PAGE SKELETON (loading da página inicial) ========== */
.page-skeleton {
  min-height: 100vh;
  background: #f8fafc;
}

.skeleton-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.skeleton-logo {
  width: 80px;
  height: 32px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.5rem;
}

.skeleton-search {
  flex: 1;
  max-width: 300px;
  height: 40px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 2rem;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 50%;
}

.skeleton-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.skeleton-filters {
  display: flex;
  gap: 0.75rem;
  margin: 1rem 0 1.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.skeleton-filter {
  width: 80px;
  height: 36px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 2rem;
  flex-shrink: 0;
}

.skeleton-section {
  margin: 2rem 0;
}

.skeleton-section-header {
  width: 200px;
  height: 28px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.skeleton-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.skeleton-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.skeleton-card-image {
  height: 160px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
}

.skeleton-card-content {
  padding: 1rem;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-line.short {
  width: 60%;
}

/* Animação Shimmer */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.shimmer {
  animation: shimmer 1.5s infinite;
}

/* ========== RESPONSIVIDADE ========== */
@media (max-width: 768px) {
  .skeleton-header {
    padding: 0.75rem 1rem;
  }

  .skeleton-search {
    max-width: none;
  }

  .skeleton-container {
    padding: 0 1rem;
  }

  .skeleton-cards {
    grid-template-columns: 1fr;
  }

  .skeleton-filter {
    width: 70px;
    height: 32px;
  }
}
</style>
