<template>
  <q-layout view="hHh LpR fFf">
    <!-- Header Moderno -->
    <q-header elevated class="bg-white" style="backdrop-filter: blur(10px); background: rgba(255,255,255,0.95);">
      <q-toolbar class="row items-center no-wrap" style="min-height: 70px;">
        <!-- Logo -->
        <q-toolbar-title @click="$router.push('/')" style="cursor: pointer">
          <span class="logo-text">2<span class="logo-highlight">go</span></span>
          <span class="logo-badge">events</span>
        </q-toolbar-title>

        <!-- Desktop Navigation -->
        <div class="row q-gutter-sm items-center desktop-nav">
          <q-btn flat label="Find Events" class="nav-btn text-weight-medium" />
          <q-btn flat label="Create Events" class="nav-btn text-weight-medium" />
          <q-btn flat label="Help Center" class="nav-btn text-weight-medium" />
          <q-btn flat label="My Tickets" class="nav-btn text-weight-medium" />
          <q-btn outline rounded color="primary" label="Sign In" class="q-ml-sm signin-btn" />
        </div>

        <!-- Mobile Menu Button -->
        <q-btn
          flat
          round
          dense
          icon="menu"
          class="mobile-menu-btn"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </q-toolbar>

      <!-- Mobile Drawer -->
      <q-drawer v-model="mobileMenuOpen" side="right" bordered :width="250" class="bg-white">
        <q-list padding>
          <q-item clickable v-close-popup>
            <q-item-section>Find Events</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Create Events</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>Help Center</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>My Tickets</q-item-section>
          </q-item>
          <q-separator class="q-mt-md q-mb-md" />
          <q-item clickable v-close-popup>
            <q-item-section><strong>Sign In</strong></q-item-section>
          </q-item>
        </q-list>
      </q-drawer>
    </q-header>

    <q-page-container>
      <q-page class="bg-page column items-center justify-start q-pa-md">
        <div class="full-width" style="max-width: 600px">
          <!-- Cabeçalho Events com contador -->
          <div class="row items-center justify-between q-mb-lg">
            <div>
              <div class="text-h4 text-weight-bold text-primary">Events</div>
              <div class="text-caption text-grey-6">Descubra os melhores eventos da cidade</div>
            </div>
            <q-badge color="primary" rounded class="q-pa-sm" style="font-size: 14px;">
              {{ eventsCount }} eventos
            </q-badge>
          </div>

          <!-- TODAY Section com estilo moderno -->
          <div class="section-header q-mt-md q-mb-md">
            <div class="row items-center">
              <div class="section-badge">
                <span class="badge-icon">📅</span>
                <span class="badge-text">HOJE</span>
              </div>
              <div class="text-subtitle1 text-weight-medium q-ml-sm text-grey-8">
                {{ formatCurrentDate() }}
              </div>
            </div>
            <div class="section-line"></div>
          </div>

          <!-- Card Beach Party - Moderno -->
          <q-card class="event-card q-mb-md" flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center justify-between">
                <div class="col">
                  <div class="event-status">🔥 Trending</div>
                  <div class="text-h6 text-weight-bold text-dark q-mt-xs">Beach Party</div>
                  <div class="row items-center q-mt-xs">
                    <q-icon name="schedule" size="14px" class="text-grey-6" />
                    <span class="text-caption text-grey-7 q-ml-xs">8:30 pm – 11:00 pm</span>
                  </div>
                  <div class="row items-center q-mt-xs">
                    <q-icon name="location_on" size="14px" class="text-grey-6" />
                    <span class="text-caption text-grey-7 q-ml-xs">Praia da Costa do Sol</span>
                  </div>
                </div>
                <div class="column items-end q-gutter-y-sm">
                  <div class="row items-center">
                    <q-icon name="favorite" size="16px" class="text-red" />
                    <span class="text-caption text-grey-7 q-ml-xs">+12 Attending</span>
                  </div>
                  <q-btn flat rounded color="primary" label="Join Now" class="join-btn" />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- UPCOMING Section -->
          <div class="section-header q-mt-xl q-mb-md">
            <div class="row items-center">
              <div class="section-badge">
                <span class="badge-icon">🎉</span>
                <span class="badge-text">PRÓXIMOS</span>
              </div>
              <div class="text-subtitle1 text-weight-medium q-ml-sm text-grey-8">Eventos Futuros</div>
            </div>
            <div class="section-line"></div>
          </div>

          <!-- Card Live Concert -->
          <q-card class="event-card q-mb-md" flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center justify-between">
                <div class="col">
                  <div class="event-date-chip">
                    <span class="date-day">28</span>
                    <span class="date-month">ABR</span>
                  </div>
                  <div class="text-h6 text-weight-bold text-dark q-mt-sm">Live Concert</div>
                  <div class="row items-center q-mt-xs">
                    <q-icon name="schedule" size="14px" class="text-grey-6" />
                    <span class="text-caption text-grey-7 q-ml-xs">8:30 pm – 11:00 pm</span>
                  </div>
                </div>
                <div class="column items-end">
                  <div class="row items-center q-mb-xs">
                    <q-icon name="people" size="16px" class="text-grey-6" />
                    <span class="text-caption text-grey-7 q-ml-xs">+12</span>
                  </div>
                  <div class="price-tag">350 MZN</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Card Food & Drink -->
          <q-card class="event-card q-mb-md" flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center justify-between">
                <div class="col">
                  <div class="event-date-chip">
                    <span class="date-day">29</span>
                    <span class="date-month">ABR</span>
                  </div>
                  <div class="text-h6 text-weight-bold text-dark q-mt-sm">Food & Drink Festival</div>
                  <div class="row items-center q-mt-xs">
                    <q-icon name="schedule" size="14px" class="text-grey-6" />
                    <span class="text-caption text-grey-7 q-ml-xs">12:00 pm – 8:00 pm</span>
                  </div>
                </div>
                <div class="column items-end">
                  <div class="row items-center q-mb-xs">
                    <q-icon name="people" size="16px" class="text-grey-6" />
                    <span class="text-caption text-grey-7 q-ml-xs">+48</span>
                  </div>
                  <div class="price-tag free">Grátis</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Card Workshop de Fotografia (adicional) -->
          <q-card class="event-card q-mb-md" flat bordered>
            <q-card-section class="q-pa-md">
              <div class="row items-center justify-between">
                <div class="col">
                  <div class="event-date-chip">
                    <span class="date-day">30</span>
                    <span class="date-month">ABR</span>
                  </div>
                  <div class="text-h6 text-weight-bold text-dark q-mt-sm">Workshop de Fotografia</div>
                  <div class="row items-center q-mt-xs">
                    <q-icon name="schedule" size="14px" class="text-grey-6" />
                    <span class="text-caption text-grey-7 q-ml-xs">9:00 am – 5:00 pm</span>
                  </div>
                </div>
                <div class="column items-end">
                  <div class="row items-center q-mb-xs">
                    <q-icon name="people" size="16px" class="text-grey-6" />
                    <span class="text-caption text-grey-7 q-ml-xs">+23</span>
                  </div>
                  <div class="price-tag">500 MZN</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Botão Ver Mais -->
          <div class="row justify-center q-mt-lg q-mb-xl">
            <q-btn outline rounded color="primary" label="Ver Mais Eventos" class="load-more-btn" />
          </div>
        </div>

        <!-- Footer -->
        <div class="footer text-center q-pt-xl q-pb-lg">
          <div class="row justify-center q-gutter-md q-mb-md">
            <span class="footer-link">Sobre</span>
            <span class="footer-link">Termos</span>
            <span class="footer-link">Privacidade</span>
            <span class="footer-link">Contato</span>
          </div>
          <div class="text-caption text-grey-6">
            © 2024 2goEvents. Todos os direitos reservados.
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue'

const mobileMenuOpen = ref(false)

// Contagem de eventos (exemplo)
const eventsCount = computed(() => 4)

// Data atual formatada
const formatCurrentDate = () => {
  const today = new Date()
  return today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
}
</script>

<style scoped>
/* Cores do HomePage */
.bg-page {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Logo */
.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.logo-highlight {
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
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
  margin-left: 0.25rem;
  vertical-align: middle;
}

/* Navegação Desktop */
.nav-btn {
  color: #1e293b;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 0 12px;
}

.nav-btn:hover {
  background: #f1f5f9;
  color: #6366f1;
}

.signin-btn {
  border-color: #6366f1;
  color: #6366f1;
  transition: all 0.3s ease;
  padding: 6px 20px;
}

.signin-btn:hover {
  background: #6366f1;
  color: white;
}

/* Mobile Menu */
.mobile-menu-btn {
  display: none;
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, #e2e8f0, transparent);
  margin-left: 1rem;
}

/* Event Cards */
.event-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  background: white;
}

.event-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

.event-status {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 600;
  color: #ef4444;
  background: #fee2e2;
  padding: 0.2rem 0.6rem;
  border-radius: 1rem;
  margin-bottom: 0.5rem;
}

.event-date-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #f1f5f9;
  border-radius: 0.75rem;
  padding: 0.2rem 0.6rem;
  margin-bottom: 0.5rem;
}

.date-day {
  font-size: 0.9rem;
  font-weight: 800;
  color: #6366f1;
}

.date-month {
  font-size: 0.6rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
}

.join-btn {
  border-radius: 2rem;
  padding: 4px 16px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.join-btn:hover {
  background: #4f46e5;
  transform: scale(1.02);
}

.price-tag {
  font-weight: 700;
  font-size: 0.8rem;
  color: #10b981;
  background: #d1fae5;
  padding: 0.2rem 0.6rem;
  border-radius: 2rem;
}

.price-tag.free {
  color: #16a34a;
}

/* Load More Button */
.load-more-btn {
  border-radius: 2rem;
  padding: 8px 32px;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: #6366f1;
  color: white;
  transform: translateY(-1px);
}

/* Footer */
.footer {
  border-top: 1px solid #e2e8f0;
  width: 100%;
  max-width: 600px;
}

.footer-link {
  color: #64748b;
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 0.8rem;
}

.footer-link:hover {
  color: #6366f1;
}

/* Responsive */
@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .text-h4 {
    font-size: 1.5rem;
  }

  .event-card .text-h6 {
    font-size: 1rem;
  }

  .join-btn {
    padding: 4px 12px;
    font-size: 0.75rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .full-width {
    max-width: 500px;
  }
}
</style>
