<template>
  <div class="app">
    <!-- Header -->
    <header class="hero1" :class="{ scrolled: isScrolled }">
      <div class="container header-container">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-text">2<span class="logo-highlight">go</span></span>
          <span class="logo-badge">events</span>
        </div>

        <div class="search-wrapper">
          <div class="search-bar" :class="{ focused: searchFocused, active: searchQuery }" @click="focusSearch">
            <span class="search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
            </span>
            <span class="search-placeholder" v-if="!searchFocused && !searchQuery">Buscar...</span>
          </div>

          <transition name="modal-fade">
            <div v-if="searchFocused" class="search-modal" @click.self="closeSearch">
              <div class="search-modal-container">
                <div class="search-modal-header">
                  <button class="close-search" @click="closeSearch">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <div class="search-input-wrapper">
                    <span class="search-icon-modal">🔍</span>
                    <input
                      type="text"
                      placeholder="Pesquisar eventos, artistas..."
                      v-model="searchQuery"
                      @keyup.enter="performSearch"
                      autofocus
                      ref="searchInput"
                    />
                    <button v-if="searchQuery" class="clear-search" @click.stop="clearSearch">✕</button>
                  </div>
                </div>

                <div class="search-modal-content">
                  <div v-if="searchSuggestions.length" class="suggestions-list">
                    <div class="suggestion-group">
                      <div class="suggestion-group-title">Resultados rápidos</div>
                      <div class="suggestion-item" v-for="sugg in searchSuggestions" :key="sugg" @click="searchSuggestion(sugg)">
                        <span class="suggestion-icon">🔥</span>
                        <span>{{ sugg }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="suggestion-group">
                    <div class="suggestion-group-title">Categorias populares</div>
                    <div class="suggestion-chips">
                      <span v-for="cat in popularCategories" :key="cat" class="suggestion-chip" @click="searchSuggestion(cat)">
                        {{ cat }}
                      </span>
                    </div>
                  </div>

                  <div class="suggestion-group" v-if="recentSearches.length">
                    <div class="suggestion-group-title">Recentes</div>
                    <div class="suggestion-item" v-for="term in recentSearches" :key="term" @click="searchSuggestion(term)">
                      <span class="suggestion-icon">🕒</span>
                      <span>{{ term }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div class="header-actions">
          <!-- Notificações -->
          <div class="notification-wrapper" @click.stop="toggleNotifications">
            <button class="action-btn icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span v-if="unreadCount > 0" class="notification-badge">{{
                unreadCount > 9 ? "9+" : unreadCount
              }}</span>
            </button>
            <transition name="dropdown-fade">
              <div v-if="showNotifications" class="notifications-dropdown">
                <div class="dropdown-header">
                  <span class="dropdown-title">Notificações</span>
                  <button class="mark-read" @click.stop="markAllRead">
                    Marcar todas
                  </button>
                </div>
                <div class="notifications-list">
                  <div
                    v-for="notif in notifications"
                    :key="notif.id"
                    class="notification-item"
                    :class="{ unread: !notif.read }"
                  >
                    <div class="notif-icon">{{ notif.icon }}</div>
                    <div class="notif-content">
                      <p>{{ notif.message }}</p>
                      <span class="notif-time">{{
                        formatTimeAgo(notif.createdAt)
                      }}</span>
                    </div>
                  </div>
                  <div
                    v-if="notifications.length === 0"
                    class="empty-notifications"
                  >
                    ✨ Nenhuma notificação
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Menu do Usuário -->
          <div class="user-menu-wrapper" @click.stop="toggleUserMenu">
            <button class="action-btn user-btn">
              <img
                v-if="currentUser?.avatar"
                :src="currentUser.avatar"
                alt="Avatar"
                class="user-avatar"
              />
              <span v-else class="user-avatar-placeholder">
                {{ currentUser?.nome?.charAt(0) || 'U' }}
              </span>
              <span class="user-name">{{
                currentUser?.nome?.split(" ")[0] || "Conta"
              }}</span>
              <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            <transition name="dropdown-fade">
              <div v-if="showUserMenu" class="user-dropdown" @click.stop>
                <div class="dropdown-user-info">
                  <div class="user-avatar-large">
                    <img v-if="currentUser?.avatar" :src="currentUser.avatar" alt="Avatar" />
                    <span v-else>{{ currentUser?.nome?.charAt(0) || 'U' }}</span>
                  </div>
                  <div class="user-info-text">
                    <strong>{{ currentUser?.nome }}</strong>
                    <span>{{ currentUser?.email }}</span>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item" @click="goToProfile">
                  <span class="item-icon">👤</span> Meu Perfil
                </div>
                <div class="dropdown-item" @click="goToMyEvents">
                  <span class="item-icon">📅</span> Meus Eventos
                </div>
                <div class="dropdown-item" @click="goToMyTickets">
                  <span class="item-icon">🎫</span> Meus Ingressos
                </div>
                <div class="dropdown-item" @click="goToMatches">
                  <span class="item-icon">💕</span> Meus Matches
                  <span v-if="pendingMatches > 0" class="badge">{{
                    pendingMatches
                  }}</span>
                </div>
                <div class="dropdown-divider"></div>
                <div
                  class="dropdown-item"
                  v-if="!currentUser?.isPromoter"
                  @click="upgradeToPromoter"
                >
                  <span class="item-icon">⭐</span> Tornar-me Promotor
                </div>
                <div
                  class="dropdown-item"
                  v-if="currentUser?.isPromoter"
                  @click="goToAnalytics"
                >
                  <span class="item-icon">📊</span> Estatísticas
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item" @click="goToSettings">
                  <span class="item-icon">⚙️</span> Configurações
                </div>
                <div class="dropdown-item logout" @click="logout">
                  <span class="item-icon">🚪</span> Sair
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <!-- FILTROS -->
        <div class="filters-section">
          <div class="filters-scroll">
            <button
              class="filter-chip"
              :class="{ active: activeFilter === 'all' }"
              @click="setActiveFilter('all')"
            >
              <span class="filter-icon">✨</span>
              <span class="filter-text">Todos</span>
            </button>
            <button
              class="filter-chip"
              :class="{ active: activeFilter === 'today' }"
              @click="setActiveFilter('today')"
            >
              <span class="filter-icon">📅</span>
              <span class="filter-text">Hoje</span>
            </button>
            <button
              class="filter-chip"
              :class="{ active: activeFilter === 'weekend' }"
              @click="setActiveFilter('weekend')"
            >
              <span class="filter-icon">🎉</span>
              <span class="filter-text">Fim de Semana</span>
            </button>
            <button
              class="filter-chip"
              :class="{ active: activeFilter === 'free' }"
              @click="setActiveFilter('free')"
            >
              <span class="filter-icon">🎁</span>
              <span class="filter-text">Grátis</span>
            </button>
            <button
              class="filter-chip"
              :class="{ active: activeFilter === 'nearby' }"
              @click="setActiveFilter('nearby')"
            >
              <span class="filter-icon">📍</span>
              <span class="filter-text">Perto de mim</span>
            </button>
            <button
              class="filter-chip"
              :class="{ active: activeFilter === 'music' }"
              @click="setActiveFilter('music')"
            >
              <span class="filter-icon">🎵</span>
              <span class="filter-text">Música</span>
            </button>
            <button
              class="filter-chip"
              :class="{ active: activeFilter === 'sports' }"
              @click="setActiveFilter('sports')"
            >
              <span class="filter-icon">⚽</span>
              <span class="filter-text">Esportes</span>
            </button>
            <button
              class="filter-chip"
              :class="{ active: activeFilter === 'art' }"
              @click="setActiveFilter('art')"
            >
              <span class="filter-icon">🎨</span>
              <span class="filter-text">Arte</span>
            </button>
          </div>
        </div>

        <!-- SEÇÃO 1: HOJE - BANNER SLIDER -->
        <section class="section banner-section">
          <div class="section-header">
            <div class="header-left">
              <div class="section-tag">
                <span class="tag-icon">📅</span>
                <span>HOJE</span>
              </div>
              <h2 class="section-title">{{ formatCurrentDate() }}</h2>
            </div>
            <div class="header-right">
              <div class="pill-count">
                <span class="count-number">{{ todayEvents.length }}</span>
                <span class="count-label">eventos</span>
              </div>
            </div>
          </div>

          <div class="banner-slider-container">
            <div class="banner-slider" @mouseenter="pauseAutoSlide" @mouseleave="startAutoSlide">
              <div
                class="banner-track"
                :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
              >
                <div
                  v-for="event in todayEvents"
                  :key="event.id"
                  class="banner-slide"
                  @click="goToEvent(event.id)"
                >
                  <div class="banner-image" :style="{ backgroundImage: `url(${event.imagem})` }">
                    <div class="banner-overlay"></div>
                    <div class="banner-content">
                      <div class="banner-badge">
                        <span class="banner-time">🕒 {{ event.horario }}</span>
                        <span class="banner-status" :class="event.status">{{ event.status }}</span>
                      </div>
                      <div class="banner-info">
                        <h3 class="banner-title">{{ event.titulo }}</h3>
                        <p class="banner-location">📍 {{ event.localizacao }}</p>
                        <div class="banner-footer">
                          <div class="banner-price" :class="{ free: event.tipo === 'gratuito' }">
                            {{ event.preco }}
                          </div>
                          <div class="banner-interest">
                            <span>❤️</span> {{ event.interessados }} interessados
                          </div>
                        </div>
                        <button class="banner-cta">Ver detalhes →</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button class="banner-nav prev" @click="prevSlide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button class="banner-nav next" @click="nextSlide">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>

            <div class="banner-dots">
              <button
                v-for="(event, idx) in todayEvents"
                :key="event.id"
                class="banner-dot"
                :class="{ active: currentSlide === idx }"
                @click="goToSlide(idx)"
              >
                <span class="dot-progress" :class="{ animating: currentSlide === idx && !isPaused }"></span>
              </button>
            </div>

            <div class="banner-timer">
              <span class="timer-text">Próximo em {{ timerSeconds }}s</span>
              <div class="timer-bar">
                <div class="timer-progress" :style="{ width: `${timerProgress}%` }"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- SEÇÃO 2: EXPLORAR POR CATEGORIA -->
        <!-- Desktop: sempre visível | Mobile: só aparece via FAB -->
        <section id="explorar-categorias" class="section categories-section" v-show="showCategories || !isMobile">
          <div class="categories-header">
            <h3 class="categories-title">Explorar por categoria</h3>
            <button class="categories-view-all" @click="goToAllCategories">Ver todas →</button>
          </div>

          <div class="categories-scroll-container">
            <div class="categories-scroll-horizontal">
              <div
                v-for="cat in professionalCategories"
                :key="cat.id"
                class="category-card"
                :class="{ active: selectedCategoryId === cat.id }"
                @click="toggleCategory(cat.id)"
              >
                <div class="category-card-icon">{{ cat.icon }}</div>
                <div class="category-card-info">
                  <span class="category-card-name">{{ cat.nome }}</span>
                  <span class="category-card-count">{{ cat.count }} eventos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SEÇÃO 3: FIM DE SEMANA -->
        <!-- Desktop: sempre visível | Mobile: só aparece via FAB -->
        <section id="fim-semana" class="section" v-show="showWeekend || !isMobile">
          <div class="section-header">
            <div class="header-left">
              <div class="section-tag">
                <span class="tag-icon">🎉</span>
                <span>FIM DE SEMANA</span>
              </div>
              <h2 class="section-title">Eventos para curtir</h2>
            </div>
            <div class="header-right">
              <div class="pill-count">
                <span class="count-number">{{ weekendEvents.length }}</span>
                <span class="count-label">eventos</span>
              </div>
            </div>
          </div>

          <div class="event-grid">
            <div v-for="event in weekendEvents" :key="event.id" class="event-card" @click="goToEvent(event.id)">
              <div class="event-card-media" :style="{ backgroundImage: `url(${event.imagem})` }">
                <div class="event-date-badge">
                  <span class="event-day">{{ event.dia }}</span>
                  <span class="event-month">{{ event.mes }}</span>
                </div>
                <div class="event-card-overlay"></div>
              </div>
              <div class="event-card-details">
                <h4>{{ event.titulo }}</h4>
                <div class="event-meta">
                  <span class="event-loc">📍 {{ event.localizacao }}</span>
                  <span class="event-time">🕒 {{ event.horario }}</span>
                </div>
                <div class="event-footer">
                  <div class="event-price" :class="{ free: event.tipo === 'gratuito' }">
                    {{ event.preco }}
                  </div>
                  <div class="event-interest">
                    <span>❤️</span> {{ event.interessados }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SEÇÃO 4: LUGARES PARA VISITAR -->
        <section class="section" v-if="placesToVisit.length">
          <div class="section-header">
            <div class="header-left">
              <div class="section-tag">
                <span class="tag-icon">📍</span>
                <span>LUGARES</span>
              </div>
              <h2 class="section-title">Para visitar</h2>
            </div>
            <button class="view-all-btn" @click="goToPlaces">Ver todos →</button>
          </div>
          <div class="horizontal-scroll">
            <div class="place-track">
              <div v-for="place in placesToVisit" :key="place.id" class="place-card" @click="goToPlace(place.id)">
                <div class="place-image" :style="{ backgroundImage: `url(${place.imagem})` }">
                  <div class="place-overlay">
                    <div class="place-date-badge">{{ place.horario }}</div>
                  </div>
                </div>
                <div class="place-info">
                  <h4>{{ place.nome }}</h4>
                  <p>{{ place.tipo }} • {{ place.localizacao }}</p>
                  <div class="place-rating">
                    <div class="stars">
                      <span v-for="i in 5" :key="i" :class="{ filled: i <= Math.floor(place.rating) }">★</span>
                    </div>
                    <span class="rating-value">{{ place.rating }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SEÇÃO 5: ESTABELECIMENTOS PARA ALUGAR -->
        <section class="section" v-if="rentalPlaces.length">
          <div class="section-header">
            <div class="header-left">
              <div class="section-tag">
                <span class="tag-icon">🏢</span>
                <span>ALUGUER</span>
              </div>
              <h2 class="section-title">Quintas e espaços</h2>
            </div>
            <button class="view-all-btn" @click="goToRentals">Ver todos →</button>
          </div>
          <div class="horizontal-scroll">
            <div class="rental-track">
              <div v-for="place in rentalPlaces" :key="place.id" class="rental-card" @click="goToRental(place.id)">
                <div class="rental-image" :style="{ backgroundImage: `url(${place.imagem})` }">
                  <div class="rental-price-tag">
                    <span class="price-label">💰</span>
                    <span class="price-value">{{ place.preco }}</span>
                  </div>
                  <div class="rental-overlay"></div>
                </div>
                <div class="rental-info">
                  <h4>{{ place.nome }}</h4>
                  <p>{{ place.tipo }} • {{ place.capacidade }}</p>
                  <button class="btn-rental">Ver disponibilidade</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- FLOATING ACTION BUTTON - SÓ APARECE NO MOBILE -->
    <div class="fab-container" v-if="isMobile">
      <div class="fab-menu" :class="{ open: fabOpen }">
        <button class="fab-option" @click="showSectionAndScroll('explorar-categorias')">
          <span class="fab-option-icon">🎯</span>
          <span class="fab-option-label">Explorar categorias</span>
        </button>
        <button class="fab-option" @click="showSectionAndScroll('fim-semana')">
          <span class="fab-option-icon">🎉</span>
          <span class="fab-option-label">Fim de semana</span>
        </button>
      </div>
      <button class="fab-button" @click="toggleFabMenu">
        <svg class="fab-icon" :class="{ open: fabOpen }" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        <svg class="fab-icon-close" :class="{ open: fabOpen }" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Mobile Bottom Navigation - SÓ APARECE NO MOBILE -->
    <nav class="mobile-bottom-nav" v-if="isMobile">
      <div class="bottom-nav-item" :class="{ active: $route.path === '/' }" @click="$router.push('/')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Início</span>
      </div>
      <div class="bottom-nav-item" @click="$router.push('/search')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <span>Buscar</span>
      </div>
      <div class="bottom-nav-item" @click="$router.push('/calendar')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>Calendário</span>
      </div>
      <div class="bottom-nav-item" @click="goToProfile">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Perfil</span>
      </div>
    </nav>

    <!-- Toast -->
    <transition name="toast-fade">
      <div v-if="toastMessage" class="toast-notification">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// CONTROLE DE VISIBILIDADE - MOBILE: inicialmente ocultas | DESKTOP: sempre visíveis
const showCategories = ref(false)
const showWeekend = ref(false)

// Dados dos Eventos de HOJE
const todayEvents = ref([
  {
    id: 1,
    titulo: '🎵 Festival de Música Ao Vivo',
    localizacao: 'Maputo, Marginal',
    horario: '19:00',
    imagem: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=350&fit=crop',
    preco: '500 MZN',
    tipo: 'pago',
    interessados: 234,
    status: 'disponivel'
  },
  {
    id: 2,
    titulo: '🍽️ Feira Gastronômica Internacional',
    localizacao: 'Matola, Jardim',
    horario: '12:00',
    imagem: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=350&fit=crop',
    preco: 'Grátis',
    tipo: 'gratuito',
    interessados: 567,
    status: 'disponivel'
  },
  {
    id: 3,
    titulo: '📸 Workshop de Fotografia',
    localizacao: 'Beira, Centro',
    horario: '14:00',
    imagem: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&h=350&fit=crop',
    preco: '300 MZN',
    tipo: 'pago',
    interessados: 89,
    status: 'disponivel'
  },
  {
    id: 4,
    titulo: '🎷 Noite do Jazz',
    localizacao: 'Maputo, Baixa',
    horario: '20:00',
    imagem: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=350&fit=crop',
    preco: '750 MZN',
    tipo: 'pago',
    interessados: 178,
    status: 'disponivel'
  },
  {
    id: 5,
    titulo: '🧘 Yoga ao Ar Livre',
    localizacao: 'Nampula, Parque',
    horario: '06:00',
    imagem: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=350&fit=crop',
    preco: 'Grátis',
    tipo: 'gratuito',
    interessados: 312,
    status: 'disponivel'
  }
])

// Dados dos Eventos de FIM DE SEMANA
const weekendEvents = ref([
  {
    id: 6,
    titulo: '🏖️ Festival de Praia',
    localizacao: 'Maputo, Costa do Sol',
    horario: '09:00 - 18:00',
    dia: '28',
    mes: 'ABR',
    imagem: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    preco: '1.000 MZN',
    tipo: 'pago',
    interessados: 1256
  },
  {
    id: 7,
    titulo: '🎨 Exposição de Arte Moderna',
    localizacao: 'Maputo, Museu',
    horario: '10:00 - 17:00',
    dia: '29',
    mes: 'ABR',
    imagem: 'https://images.unsplash.com/photo-1531243269054-2ebf6e8ab071?w=400&h=300&fit=crop',
    preco: '200 MZN',
    tipo: 'pago',
    interessados: 345
  },
  {
    id: 8,
    titulo: '🏃 Corrida Beneficente',
    localizacao: 'Matola, Estádio',
    horario: '07:00 - 11:00',
    dia: '30',
    mes: 'ABR',
    imagem: 'https://images.unsplash.com/photo-1537380008651-e0b42f049c7f?w=400&h=300&fit=crop',
    preco: 'Grátis',
    tipo: 'gratuito',
    interessados: 789
  },
  {
    id: 9,
    titulo: '🎭 Show de Comédia Stand-up',
    localizacao: 'Beira, Teatro',
    horario: '20:00 - 22:00',
    dia: '28',
    mes: 'ABR',
    imagem: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=300&fit=crop',
    preco: '400 MZN',
    tipo: 'pago',
    interessados: 456
  },
  {
    id: 10,
    titulo: '🎧 Festa Eletrônica',
    localizacao: 'Nampula, Clube',
    horario: '22:00 - 04:00',
    dia: '29',
    mes: 'ABR',
    imagem: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop',
    preco: '600 MZN',
    tipo: 'pago',
    interessados: 2345
  },
  {
    id: 11,
    titulo: '🪭 Feira de Artesanato',
    localizacao: 'Maputo, Centro',
    horario: '09:00 - 18:00',
    dia: '30',
    mes: 'ABR',
    imagem: 'https://images.unsplash.com/photo-1553681430-cc8d5601b7d0?w=400&h=300&fit=crop',
    preco: 'Grátis',
    tipo: 'gratuito',
    interessados: 678
  }
])

// Categorias
const professionalCategories = ref([
  { id: 1, nome: 'Música', icon: '🎵', count: 24 },
  { id: 2, nome: 'Vida Noturna', icon: '🌙', count: 18 },
  { id: 3, nome: 'Artes e Cultura', icon: '🎨', count: 15 },
  { id: 4, nome: 'Feriados e Festivais', icon: '🎪', count: 12 },
  { id: 5, nome: 'Encontros Sociais', icon: '👥', count: 20 },
  { id: 6, nome: 'Esporte e Bem-estar', icon: '🏃', count: 14 },
  { id: 7, nome: 'Negócios e Educação', icon: '💼', count: 10 },
  { id: 8, nome: 'Comida e Experiências', icon: '🍽️', count: 16 }
])

// Lugares para visitar
const placesToVisit = ref([
  { id: 1, nome: 'Coconuts Lounge', tipo: 'Rooftop', localizacao: 'Maputo', imagem: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop', horario: '12h - 02h', rating: 4.8 },
  { id: 2, nome: 'Espaço Cultural Franco', tipo: 'Galeria', localizacao: 'Maputo', imagem: 'https://images.unsplash.com/photo-1566121933407-7b3b4d8b7f4f?w=400&h=300&fit=crop', horario: '10h - 18h', rating: 4.5 },
  { id: 3, nome: 'Sunset Bar', tipo: 'Bar', localizacao: 'Beira', imagem: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop', horario: '16h - 23h', rating: 4.7 },
  { id: 4, nome: 'Mercado Municipal', tipo: 'Mercado', localizacao: 'Matola', imagem: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop', horario: '08h - 17h', rating: 4.3 }
])

// Lugares para alugar
const rentalPlaces = ref([
  { id: 1, nome: 'Quinta das Palmeiras', tipo: 'Quinta', localizacao: 'Maputo', imagem: 'https://images.unsplash.com/photo-1464366400600-7168b4af2df8?w=400&h=300&fit=crop', capacidade: '500 pessoas', preco: '15.000 MZN' },
  { id: 2, nome: 'Villa Luana', tipo: 'Salão', localizacao: 'Matola', imagem: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=300&fit=crop', capacidade: '200 pessoas', preco: '8.000 MZN' },
  { id: 3, nome: 'Beira Event Center', tipo: 'Centro', localizacao: 'Beira', imagem: 'https://images.unsplash.com/photo-1540575467063-3c2b5b5a3f3f?w=400&h=300&fit=crop', capacidade: '1000 pessoas', preco: '25.000 MZN' }
])

// Estado
const selectedCategoryId = ref(null)
const currentUser = ref({})
const isScrolled = ref(false)
const isMobile = ref(window.innerWidth < 768)
const toastMessage = ref('')
const searchFocused = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const recentSearches = ref([])
const showNotifications = ref(false)
const showUserMenu = ref(false)
const activeFilter = ref('all')
const fabOpen = ref(false)
const unreadCount = ref(3)
const pendingMatches = ref(2)

// Slider
const currentSlide = ref(0)
const autoSlideInterval = ref(null)
const isPaused = ref(false)
const timerSeconds = ref(60)
const timerProgress = ref(100)
let countdownInterval = null

const notifications = ref([
  { id: 1, icon: '🎫', message: 'Seu bilhete para "Festival de Música" foi confirmado!', read: false, createdAt: new Date(Date.now() - 3600000) },
  { id: 2, icon: '💕', message: 'Maria aceitou seu match!', read: false, createdAt: new Date(Date.now() - 7200000) },
  { id: 3, icon: '🎤', message: 'Novo evento: "Workshop de Fotografia"', read: true, createdAt: new Date(Date.now() - 86400000) }
])

const searchSuggestions = computed(() => {
  if (!searchQuery.value) return []
  return ['Eventos perto de mim', 'Festas hoje', 'Shows ao vivo', 'Eventos grátis'].filter(s =>
    s.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const popularCategories = ['Música', 'Esportes', 'Arte', 'Gastronomia', 'Festas']

// FUNÇÃO: Mostrar seção e scrollar até ela (apenas para MOBILE)
const showSectionAndScroll = (sectionId) => {
  fabOpen.value = false

  if (sectionId === 'explorar-categorias') {
    showCategories.value = true
    setTimeout(() => {
      const element = document.getElementById('explorar-categorias')
      if (element) {
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
    showToast('🎯 Explorar por categoria')
  } else if (sectionId === 'fim-semana') {
    showWeekend.value = true
    setTimeout(() => {
      const element = document.getElementById('fim-semana')
      if (element) {
        const headerOffset = 80
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 100)
    showToast('🎉 Fim de semana')
  }
}

// Slider functions
const nextSlide = () => {
  if (currentSlide.value < todayEvents.value.length - 1) {
    currentSlide.value++
  } else {
    currentSlide.value = 0
  }
  resetTimer()
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
  } else {
    currentSlide.value = todayEvents.value.length - 1
  }
  resetTimer()
}

const goToSlide = (index) => {
  currentSlide.value = index
  resetTimer()
}

const startAutoSlide = () => {
  if (autoSlideInterval.value) clearInterval(autoSlideInterval.value)
  isPaused.value = false
  startCountdown()
  autoSlideInterval.value = setInterval(() => {
    if (!isPaused.value) {
      nextSlide()
    }
  }, 61000)
}

const pauseAutoSlide = () => {
  isPaused.value = true
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
    autoSlideInterval.value = null
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval)
  timerSeconds.value = 60
  timerProgress.value = 100

  countdownInterval = setInterval(() => {
    if (!isPaused.value && timerSeconds.value > 0) {
      timerSeconds.value--
      timerProgress.value = (timerSeconds.value / 60) * 100
    }
    if (timerSeconds.value <= 0 && !isPaused.value) {
      clearInterval(countdownInterval)
    }
  }, 1000)
}

const resetTimer = () => {
  if (!isPaused.value) {
    timerSeconds.value = 60
    timerProgress.value = 100
    if (countdownInterval) {
      clearInterval(countdownInterval)
      startCountdown()
    }
  }
}

// Funções gerais
const formatCurrentDate = () => {
  const today = new Date();
  return today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
};

const showToast = (message) => {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const setActiveFilter = (filter) => {
  activeFilter.value = filter
  selectedCategoryId.value = null
  showToast(`Filtrando: ${filter}`)
}

const focusSearch = () => {
  searchFocused.value = true
  setTimeout(() => {
    searchInput.value?.focus()
  }, 100)
}

const closeSearch = () => {
  searchFocused.value = false
  searchQuery.value = ''
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    if (!recentSearches.value.includes(searchQuery.value)) {
      recentSearches.value.unshift(searchQuery.value)
      if (recentSearches.value.length > 5) recentSearches.value.pop()
    }
    router.push({ path: '/search', query: { q: searchQuery.value } })
    searchFocused.value = false
    searchQuery.value = ''
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  searchInput.value?.focus()
}

const searchSuggestion = (term) => {
  searchQuery.value = term
  performSearch()
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showUserMenu.value) showUserMenu.value = false;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  if (showNotifications.value) showNotifications.value = false;
};

const markAllRead = () => {
  notifications.value.forEach((n) => (n.read = true));
  unreadCount.value = 0;
  showToast('Todas notificações marcadas como lidas')
};

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "agora";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return `${days} d`;
};

const toggleCategory = (catId) => {
  if (selectedCategoryId.value === catId) {
    selectedCategoryId.value = null;
    showToast('Todas as categorias')
  } else {
    selectedCategoryId.value = catId;
    const category = professionalCategories.value.find(c => c.id === catId)
    showToast(`${category.nome} selecionada`)
    activeFilter.value = 'all'
  }
};

const toggleFabMenu = () => {
  fabOpen.value = !fabOpen.value
}

const goToEvent = (id) => {
  router.push(`/event/${id}`)
  showToast(`Abrindo evento ${id}`)
};

const goToPlace = (id) => router.push(`/place/${id}`);
const goToRental = (id) => router.push(`/rental/${id}`);
const goToPlaces = () => router.push('/places');
const goToRentals = () => router.push('/rentals');
const goToAllCategories = () => router.push('/categories');

const goToProfile = () => {
  showUserMenu.value = false
  router.push('/profile')
};

const goToMyEvents = () => {
  showUserMenu.value = false
  router.push('/profile?tab=myEvents')
};

const goToMyTickets = () => {
  showUserMenu.value = false
  router.push('/profile?tab=myRegistrations')
};

const goToMatches = () => {
  showUserMenu.value = false
  router.push('/profile?tab=matches')
};

const goToAnalytics = () => {
  showUserMenu.value = false
  router.push('/analytics')
};

const goToSettings = () => {
  showUserMenu.value = false
  router.push('/profile?tab=settings')
};

const upgradeToPromoter = () => {
  showUserMenu.value = false
  router.push('/profile?upgrade=true')
};

const logout = () => {
  showUserMenu.value = false
  router.push('/');
  showToast('Sessão encerrada')
};

// Event handlers
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
  // Quando muda para desktop, as seções ficam visíveis automaticamente
  if (!isMobile.value) {
    showCategories.value = true
    showWeekend.value = true
  }
};

const handleClickOutside = (event) => {
  const searchWrapper = document.querySelector('.search-wrapper');
  const notifWrapper = document.querySelector('.notification-wrapper');
  const userMenu = document.querySelector('.user-menu-wrapper');
  const fabContainer = document.querySelector('.fab-container');

  if (searchWrapper && !searchWrapper.contains(event.target) && !event.target.closest('.search-modal')) {
    searchFocused.value = false;
  }
  if (notifWrapper && !notifWrapper.contains(event.target)) {
    showNotifications.value = false;
  }
  if (userMenu && !userMenu.contains(event.target)) {
    showUserMenu.value = false;
  }
  if (fabContainer && !fabContainer.contains(event.target)) {
    fabOpen.value = false;
  }
};

// Lifecycle
onMounted(async () => {
  try {
    currentUser.value = {
      id: 1,
      nome: 'João Silva',
      email: 'joao@email.com',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      isPromoter: true
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    currentUser.value = { nome: 'Usuário', email: 'usuario@email.com' };
  }

  // Se for desktop, mostrar todas as seções
  if (!isMobile.value) {
    showCategories.value = true
    showWeekend.value = true
  }

  startAutoSlide()

  window.addEventListener("scroll", handleScroll);
  window.addEventListener("resize", handleResize);
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  if (autoSlideInterval.value) clearInterval(autoSlideInterval.value)
  if (countdownInterval) clearInterval(countdownInterval)
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Header */
.hero1 {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0.75rem 0;
  transition: all 0.3s ease;
}

.hero1.scrolled {
  padding: 0.5rem 0;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.header-container {
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

.logo-badge {
  font-size: 0.65rem;
  font-weight: 500;
  background: #818cf8;
  color: white;
  padding: 0.15rem 0.4rem;
  border-radius: 0.5rem;
}

/* Search */
.search-wrapper {
  flex: 1;
  max-width: 300px;
  position: relative;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f1f5f9;
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.search-bar.focused {
  background: #6366f1;
}

.search-bar.focused .search-icon {
  color: white;
}

.search-icon {
  display: flex;
  align-items: center;
  color: #64748b;
}

.search-placeholder {
  font-size: 0.875rem;
  color: #94a3b8;
}

.search-bar.focused .search-placeholder {
  color: white;
}

/* Modal Search */
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.search-modal-container {
  width: 100%;
  max-width: 600px;
  background: white;
  border-radius: 0 0 1.5rem 1.5rem;
  animation: slideDown 0.3s ease;
}

.search-modal-header {
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
}

.search-input-wrapper input {
  flex: 1;
  border: none;
  background: none;
  font-size: 1rem;
  outline: none;
}

.close-search {
  background: none;
  border: none;
  cursor: pointer;
  color: #6366f1;
}

.clear-search {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
}

.search-modal-content {
  padding: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.suggestion-group {
  margin-bottom: 1.5rem;
}

.suggestion-group-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 0.75rem;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.suggestion-item:hover {
  background: #f8fafc;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.suggestion-chip {
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border-radius: 2rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.suggestion-chip:hover {
  background: #6366f1;
  color: white;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: #f1f5f9;
}

.icon-btn {
  position: relative;
}

.user-btn {
  background: #f1f5f9;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
}

.chevron {
  transition: all 0.3s ease;
  color: #475569;
}

/* Dropdowns */
.notification-wrapper, .user-menu-wrapper {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ef4444;
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.1rem 0.35rem;
  border-radius: 1rem;
}

.notifications-dropdown, .user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 360px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 100;
}

.user-dropdown {
  width: 280px;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.dropdown-title {
  font-weight: 600;
  color: #0f172a;
}

.mark-read {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.75rem;
  cursor: pointer;
}

.dropdown-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.user-avatar-large img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.user-info-text strong {
  display: block;
  font-size: 0.875rem;
  color: #0f172a;
}

.user-info-text span {
  font-size: 0.75rem;
  color: #475569;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  color: #475569;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.25rem 0;
}

.dropdown-item .badge {
  margin-left: auto;
  background: #ef4444;
  color: white;
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 1rem;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: #eff6ff;
}

.notif-icon {
  font-size: 1.25rem;
}

.notif-content p {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: #0f172a;
}

.notif-time {
  font-size: 0.7rem;
  color: #94a3b8;
}

.empty-notifications {
  padding: 2rem;
  text-align: center;
  color: #94a3b8;
}

/* Filters */
.filters-section {
  margin: 1rem 0 1.5rem 0;
  position: sticky;
  top: 70px;
  z-index: 90;
}

.filters-scroll {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding: 0.5rem 0;
  scrollbar-width: none;
}

.filters-scroll::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-chip:hover {
  background: #f8fafc;
  transform: translateY(-1px);
  border-color: #6366f1;
}

.filter-chip.active {
  background: #6366f1;
  border-color: #6366f1;
  color: white;
}

/* Banner Slider */
.banner-section {
  margin: 1rem 0 2rem 0;
}

.banner-slider-container {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.banner-slider {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.banner-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-slide {
  flex-shrink: 0;
  width: 100%;
}

.banner-image {
  position: relative;
  height: 220px;
  background-size: cover;
  background-position: center;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  color: white;
}

.banner-badge {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.banner-time, .banner-status {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  border-radius: 2rem;
  font-size: 0.7rem;
  font-weight: 500;
}

.banner-status.disponivel {
  background: #10b981;
}

.banner-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.banner-location {
  font-size: 0.7rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.banner-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.banner-price {
  font-size: 1rem;
  font-weight: 700;
  color: #f59e0b;
}

.banner-price.free {
  color: #10b981;
}

.banner-interest {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: #ef4444;
}

.banner-cta {
  padding: 0.25rem 1rem;
  background: white;
  color: #6366f1;
  border: none;
  border-radius: 2rem;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.banner-cta:hover {
  transform: translateX(4px);
  background: #6366f1;
  color: white;
}

.banner-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.banner-nav:hover {
  background: white;
  transform: translateY(-50%) scale(1.05);
}

.banner-nav.prev {
  left: 10px;
}

.banner-nav.next {
  right: 10px;
}

.banner-dots {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
}

.banner-dot {
  width: 30px;
  height: 3px;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  border-radius: 2px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.banner-dot.active {
  background: rgba(255, 255, 255, 0.9);
  width: 40px;
}

.dot-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: #6366f1;
  border-radius: 2px;
}

.dot-progress.animating {
  animation: progressAnimation 60s linear forwards;
}

@keyframes progressAnimation {
  from { width: 0%; }
  to { width: 100%; }
}

.banner-timer {
  position: absolute;
  bottom: 8px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  padding: 0.25rem 0.75rem;
  border-radius: 1.5rem;
  z-index: 10;
  min-width: 100px;
}

.timer-text {
  font-size: 0.6rem;
  color: white;
  display: block;
  margin-bottom: 2px;
}

.timer-bar {
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
}

.timer-progress {
  height: 100%;
  background: #6366f1;
  border-radius: 2px;
  transition: width 1s linear;
}

/* Sections */
.section {
  margin: 2rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.view-all-btn {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  color: #4f46e5;
  transform: translateX(4px);
}

.pill-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #f1f5f9;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
}

.count-number {
  font-weight: 700;
  color: #6366f1;
}

.count-label {
  font-size: 0.75rem;
  color: #475569;
}

/* Categories */
.categories-section {
  margin: 2rem 0;
}

.categories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.categories-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.categories-view-all {
  background: none;
  border: none;
  color: #6366f1;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.categories-scroll-container {
  width: 100%;
}

.categories-scroll-horizontal {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0 1rem 0;
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #e2e8f0;
  scroll-snap-type: x mandatory;
}

.categories-scroll-horizontal::-webkit-scrollbar {
  height: 4px;
}

.categories-scroll-horizontal::-webkit-scrollbar-track {
  background: #e2e8f0;
  border-radius: 4px;
}

.categories-scroll-horizontal::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 4px;
}

.categories-scroll-horizontal .category-card {
  flex-shrink: 0;
  width: calc(50% - 0.5rem);
  min-width: 160px;
  scroll-snap-align: start;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-color: #6366f1;
}

.category-card.active {
  background: #6366f1;
  border-color: #6366f1;
}

.category-card.active .category-card-icon {
  background: rgba(255, 255, 255, 0.2);
}

.category-card.active .category-card-name {
  color: white;
}

.category-card.active .category-card-count {
  color: rgba(255, 255, 255, 0.8);
}

.category-card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 1rem;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.category-card-name {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.category-card-count {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
}

/* Horizontal Scroll */
.horizontal-scroll {
  overflow-x: auto;
  padding-bottom: 1rem;
  scrollbar-width: thin;
}

.horizontal-scroll::-webkit-scrollbar {
  height: 4px;
}

.horizontal-scroll::-webkit-scrollbar-track {
  background: #e2e8f0;
  border-radius: 4px;
}

.horizontal-scroll::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 4px;
}

.scroll-track, .place-track, .rental-track {
  display: flex;
  gap: 1rem;
  width: fit-content;
}

/* Event Grid */
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.event-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.event-card-media {
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.event-card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3));
}

.event-date-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: white;
  border-radius: 0.75rem;
  padding: 0.25rem 0.5rem;
  text-align: center;
  min-width: 50px;
}

.event-day {
  display: block;
  font-size: 1rem;
  font-weight: 800;
  color: #6366f1;
  line-height: 1;
}

.event-month {
  display: block;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #475569;
}

.event-card-details {
  padding: 1rem;
}

.event-card-details h4 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #0f172a;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.event-loc, .event-time {
  font-size: 0.75rem;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-price {
  font-weight: 700;
  font-size: 0.875rem;
  color: #6366f1;
}

.event-price.free {
  color: #16a34a;
}

.event-interest {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #ef4444;
}

/* Place Card */
.place-card {
  background: white;
  border-radius: 1rem;
  width: 220px;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.place-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.place-image {
  height: 140px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.place-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.4));
}

.place-date-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
}

.place-info {
  padding: 0.75rem;
}

.place-info h4 {
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #0f172a;
}

.place-info p {
  font-size: 0.7rem;
  color: #475569;
}

.place-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.stars {
  display: flex;
  gap: 2px;
  color: #cbd5e1;
  font-size: 0.7rem;
}

.stars .filled {
  color: #f59e0b;
}

.rating-value {
  font-size: 0.7rem;
  font-weight: 600;
  color: #0f172a;
}

/* Rental Card */
.rental-card {
  background: white;
  border-radius: 1rem;
  width: 260px;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.rental-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.rental-image {
  height: 150px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.rental-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.5));
}

.rental-price-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.price-value {
  color: #f59e0b;
  font-size: 0.75rem;
  font-weight: 700;
}

.rental-info {
  padding: 0.75rem;
}

.rental-info h4 {
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #0f172a;
}

.rental-info p {
  font-size: 0.7rem;
  color: #475569;
  margin-bottom: 0.75rem;
}

.btn-rental {
  width: 100%;
  padding: 0.5rem;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-rental:hover {
  background: #4f46e5;
  transform: scale(0.98);
}

/* FAB - APENAS MOBILE */
.fab-container {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 150;
}

.fab-menu {
  position: absolute;
  bottom: 70px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.fab-menu.open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.fab-option {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: none;
  padding: 10px 18px;
  border-radius: 40px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
}

.fab-option:hover {
  transform: translateX(-4px);
  background: #6366f1;
  color: white;
}

.fab-button {
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.fab-button:hover {
  transform: scale(1.05);
}

.fab-icon, .fab-icon-close {
  position: absolute;
  color: white;
  transition: all 0.3s ease;
}

.fab-icon {
  opacity: 1;
  transform: rotate(0deg);
}

.fab-icon.open {
  opacity: 0;
  transform: rotate(90deg);
}

.fab-icon-close {
  opacity: 0;
  transform: rotate(-90deg);
}

.fab-icon-close.open {
  opacity: 1;
  transform: rotate(0deg);
}

/* Mobile Bottom Nav - APENAS MOBILE */
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e2e8f0;
  z-index: 90;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.bottom-nav-item.active {
  color: #6366f1;
}

.bottom-nav-item span {
  font-size: 0.7rem;
}

/* Toast */
.toast-notification {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  z-index: 200;
  white-space: nowrap;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active, .modal-fade-leave-active,
.dropdown-fade-enter-active, .dropdown-fade-leave-active,
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to,
.dropdown-fade-enter-from, .dropdown-fade-leave-to,
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
}

/* Desktop */
@media (min-width: 769px) {
  .categories-scroll-horizontal {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    overflow-x: visible;
    padding: 0;
  }

  .categories-scroll-horizontal .category-card {
    width: calc(25% - 0.75rem);
    min-width: auto;
  }

  .event-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .banner-image {
    height: 220px;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .filters-section {
    top: 60px;
  }

  .filter-chip {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .logo-badge {
    display: none;
  }

  .user-name, .chevron {
    display: none;
  }

  .user-btn {
    padding: 0.25rem;
  }

  .notifications-dropdown, .user-dropdown {
    position: fixed;
    top: auto;
    bottom: 80px;
    left: 1rem;
    right: 1rem;
    width: auto;
    max-height: 70vh;
  }

  .event-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .main {
    margin-bottom: 70px;
  }

  .banner-image {
    height: 200px;
  }

  .banner-title {
    font-size: 0.9rem;
  }

  .banner-content {
    padding: 0.75rem;
  }

  .banner-timer {
    bottom: 60px;
    right: 8px;
    padding: 0.2rem 0.6rem;
    min-width: 85px;
  }

  .timer-text {
    font-size: 0.55rem;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .event-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
