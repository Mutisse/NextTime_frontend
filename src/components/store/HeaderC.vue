<template>
  <header class="header-custom">
    <div class="container">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-text">2<span class="logo-highlight">go</span></span>
          <span class="logo-badge">events</span>
        </div>
        
        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Buscar eventos, serviços..." 
            v-model="searchQuery"
            @keyup.enter="performSearch"
          />
          <button class="search-btn" @click="performSearch">
            🔍
          </button>
        </div>
        
        <div class="header-actions">
          <button class="icon-btn" @click="$router.push('/cart')">
            🛒
            <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
          </button>
          <button class="icon-btn" @click="$router.push('/profile')">
            👤
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const cartCount = ref(0)

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}
</script>

<style scoped>
.header-custom {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0.75rem 0;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.logo {
  cursor: pointer;
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.logo-highlight {
  background: linear-gradient(135deg, #818cf8, #6366f1);
  -webkit-background-clip: text;
  background-clip: text;
}

.logo-badge {
  font-size: 0.65rem;
  font-weight: 500;
  background: #818cf8;
  color: white;
  padding: 0.15rem 0.4rem;
  border-radius: 0.5rem;
}

.search-bar {
  flex: 1;
  max-width: 400px;
  display: flex;
  background: #f1f5f9;
  border-radius: 2rem;
  overflow: hidden;
}

.search-bar input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
}

.search-btn {
  padding: 0.6rem 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  position: relative;
  background: #f1f5f9;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.icon-btn:hover {
  background: #e2e8f0;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.35rem;
  border-radius: 50%;
}

@media (max-width: 768px) {
  .logo-text {
    font-size: 1.1rem;
  }
  
  .logo-badge {
    display: none;
  }
  
  .search-bar {
    max-width: 200px;
  }
  
  .search-bar input {
    font-size: 0.75rem;
  }
}
</style>
