<template>
  <div class="user-profile">
    <!-- Botão Voltar (flutuante) -->
    <button class="back-button" @click="goBack">
      <span class="back-arrow">←</span>
      <span class="back-text">Voltar</span>
    </button>

    <!-- Skeleton Loading do Header -->
    <div v-if="loadingProfile" class="profile-hero-skeleton">
      <div class="skeleton-cover shimmer"></div>
      <div class="skeleton-avatar shimmer"></div>
      <div class="skeleton-info">
        <div class="skeleton-name shimmer"></div>
        <div class="skeleton-bio shimmer"></div>
        <div class="skeleton-details shimmer"></div>
      </div>
    </div>

    <!-- Header com efeito paralax (quando carregado) -->
    <div v-else class="profile-hero">
      <div class="hero-background">
        <img :src="user.coverImage || defaultCover" alt="Cover" />
        <div class="hero-overlay"></div>
      </div>

      <div class="hero-content container">
        <div class="hero-left">
          <div class="avatar-wrapper">
            <div class="avatar-container">
              <img :src="user.avatar || defaultAvatar" :alt="user.nome" />
              <button class="avatar-edit" @click="editAvatar">
                <span>📷</span>
              </button>
            </div>
            <div class="online-status" v-if="user.isOnline"></div>
          </div>

          <div class="hero-info">
            <div class="name-row">
              <h1>{{ user.nome }}</h1>
              <span v-if="user.isVerified" class="verified-icon">✓</span>
              <span v-if="user.isPromoter" class="promoter-icon">⭐</span>
            </div>

            <div class="user-bio">
              <p>{{ user.bio || "Apaixonado por eventos e experiências incríveis!" }}</p>
            </div>

            <div class="user-details">
              <span class="detail">
                <span class="detail-icon">📍</span>
                {{ user.cidade || "Maputo, Moçambique" }}
              </span>
              <span class="detail">
                <span class="detail-icon">📅</span>
                Membro desde {{ formatDate(user.createdAt) }}
              </span>
              <span class="detail" v-if="user.eventosParticipados">
                <span class="detail-icon">🎉</span>
                {{ user.eventosParticipados }} eventos participados
              </span>
            </div>
          </div>
        </div>

        <div class="hero-actions">
          <button class="action-btn primary" @click="editProfile">
            <span>✏️</span>
            <span class="btn-text">Editar Perfil</span>
          </button>
          <button v-if="!user.isPromoter" class="action-btn premium" @click="showPromoterModal = true">
            <span>⭐</span>
            <span class="btn-text">Ser Promotor</span>
          </button>
          <button class="action-btn icon" @click="shareProfile">
            <span>📤</span>
          </button>
        </div>
      </div>

      <!-- Stats com Skeleton -->
      <div v-if="loadingStats" class="hero-stats-skeleton">
        <div v-for="i in 4" :key="i" class="skeleton-stat shimmer"></div>
      </div>
      <div v-else class="hero-stats">
        <div class="stat-card">
          <div class="stat-value">{{ user.eventCount || 0 }}</div>
          <div class="stat-label">Eventos Criados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ user.followers || 0 }}</div>
          <div class="stat-label">Seguidores</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ user.following || 0 }}</div>
          <div class="stat-label">Seguindo</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ user.impacto || 0 }}</div>
          <div class="stat-label">Impacto Social</div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Skeleton Loading das Tabs -->
      <div v-if="loadingTabs" class="tabs-skeleton">
        <div v-for="i in 4" :key="i" class="skeleton-tab shimmer"></div>
      </div>

      <!-- Navegação Tabs (quando carregado) -->
      <div v-else class="tabs-navigation">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="tab-emoji">{{ tab.emoji }}</span>
          <span class="tab-name">{{ tab.name }}</span>
          <span v-if="tab.count" class="tab-badge">{{ tab.count }}</span>
        </button>
      </div>

      <!-- Conteúdo das Tabs -->
      <div class="tab-container">
        <!-- MEUS EVENTOS -->
        <div v-show="activeTab === 'events'" class="tab-pane">
          <div class="pane-header">
            <div>
              <h2>Meus Eventos</h2>
              <p>Eventos que você organiza e gerencia</p>
            </div>
            <button class="create-btn" @click="$router.push('/create-event')">
              <span>+</span>
              <span class="btn-text">Novo Evento</span>
            </button>
          </div>

          <!-- Skeleton Loading dos Eventos (estilo Instagram) -->
          <div v-if="loadingEvents" class="loading-grid">
            <div v-for="i in 3" :key="i" class="skeleton-card">
              <div class="skeleton-image shimmer"></div>
              <div class="skeleton-content">
                <div class="skeleton-title shimmer"></div>
                <div class="skeleton-text shimmer"></div>
                <div class="skeleton-text short shimmer"></div>
                <div class="skeleton-button shimmer"></div>
              </div>
            </div>
          </div>

          <div v-else-if="myEvents.length === 0" class="empty-state">
            <div class="empty-emoji">📭</div>
            <h3>Nenhum evento criado</h3>
            <p>Comece a publicar eventos e compartilhe momentos incríveis</p>
            <button class="create-btn" @click="$router.push('/create-event')">
              Criar meu primeiro evento
            </button>
          </div>

          <div v-else class="events-grid">
            <div v-for="event in myEvents" :key="event.id" class="event-item">
              <div class="event-cover" :style="{ backgroundImage: `url(${event.imagem})` }">
                <div class="event-status" :class="event.status">
                  {{ event.status === 'active' ? 'Ativo' : 'Encerrado' }}
                </div>
                <button class="event-menu" @click.stop="toggleMenu(event.id)">
                  ⋯
                </button>
                <div v-if="activeMenu === event.id" class="menu-dropdown">
                  <button @click="editEvent(event)">✏️ Editar</button>
                  <button @click="duplicateEvent(event)">📋 Duplicar</button>
                  <button class="danger" @click="cancelEvent(event)">🗑️ Cancelar</button>
                </div>
              </div>
              <div class="event-body">
                <h3>{{ event.titulo }}</h3>
                <div class="event-meta">
                  <span>📅 {{ formatDate(event.dataHora) }}</span>
                  <span>📍 {{ event.localizacao }}</span>
                </div>
                <div class="event-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: event.progress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ event.participantes }}/{{ event.limite }} participantes</span>
                </div>
                <button class="view-btn" @click="viewEvent(event.id)">
                  Ver detalhes →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- MEUS INGRESSOS -->
        <div v-show="activeTab === 'tickets'" class="tab-pane">
          <div class="pane-header">
            <div>
              <h2>Meus Ingressos</h2>
              <p>Eventos confirmados e pendentes</p>
            </div>
          </div>

          <!-- Skeleton Loading dos Ingressos -->
          <div v-if="loadingTickets" class="loading-tickets">
            <div v-for="i in 2" :key="i" class="skeleton-ticket-card">
              <div class="skeleton-ticket-sidebar shimmer"></div>
              <div class="skeleton-ticket-content">
                <div class="skeleton-title shimmer"></div>
                <div class="skeleton-text shimmer"></div>
                <div class="skeleton-text short shimmer"></div>
              </div>
            </div>
          </div>

          <div v-else-if="myTickets.length === 0" class="empty-state">
            <div class="empty-emoji">🎫</div>
            <h3>Nenhum ingresso ainda</h3>
            <p>Inscreva-se em eventos para ver seus ingressos aqui</p>
            <button class="create-btn" @click="$router.push('/')">Explorar eventos</button>
          </div>

          <div v-else class="tickets-grid">
            <div v-for="ticket in myTickets" :key="ticket.id" class="ticket-item" :class="ticket.status">
              <div class="ticket-corner"></div>
              <div class="ticket-content">
                <div class="ticket-header">
                  <div class="ticket-icon">🎟️</div>
                  <div class="ticket-status-badge">{{ ticket.status === 'paid' ? 'PAGO' : 'PENDENTE' }}</div>
                </div>
                <h3>{{ ticket.event.titulo }}</h3>
                <div class="ticket-info">
                  <div>📅 {{ formatDate(ticket.event.dataHora) }}</div>
                  <div>📍 {{ ticket.event.localizacao }}</div>
                  <div>💰 {{ ticket.amount === 0 ? 'Grátis' : ticket.amount + ' MZN' }}</div>
                </div>
                <div class="ticket-footer">
                  <button v-if="ticket.status === 'pending'" class="btn-pay" @click="payTicket(ticket)">
                    Pagar Agora
                  </button>
                  <button class="btn-view-ticket" @click="viewTicket(ticket)">
                    Ver Bilhete
                  </button>
                  <button v-if="ticket.status === 'paid'" class="btn-match" @click="requestMatch(ticket.event)">
                    💕 Pedir Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- MATCHES -->
        <div v-show="activeTab === 'matches'" class="tab-pane">
          <div class="pane-header">
            <div>
              <h2>Meus Matches</h2>
              <p>Pessoas que você conheceu em eventos</p>
            </div>
          </div>

          <!-- Skeleton Loading dos Matches -->
          <div v-if="loadingMatches" class="loading-matches">
            <div v-for="i in 3" :key="i" class="skeleton-match-card">
              <div class="skeleton-match-avatar shimmer"></div>
              <div class="skeleton-match-content">
                <div class="skeleton-title shimmer"></div>
                <div class="skeleton-text shimmer"></div>
              </div>
            </div>
          </div>

          <div v-else-if="matches.length === 0" class="empty-state">
            <div class="empty-emoji">💔</div>
            <h3>Nenhum match ainda</h3>
            <p>Participe de eventos e peça match para conhecer novas pessoas</p>
          </div>

          <div v-else class="matches-grid">
            <div v-for="match in matches" :key="match.id" class="match-item">
              <div class="match-avatar">
                <img :src="match.user.avatar || defaultAvatar" :alt="match.user.nome" />
                <div class="match-status" :class="match.status"></div>
              </div>
              <div class="match-info">
                <h4>{{ match.user.nome }}</h4>
                <p class="match-event">🎯 {{ match.event.titulo }}</p>
                <p class="match-date">{{ match.event.data }}</p>
              </div>
              <div class="match-actions">
                <template v-if="match.status === 'pending' && match.isRequester === false">
                  <button class="match-accept" @click="acceptMatch(match.id)">✓ Aceitar</button>
                  <button class="match-decline" @click="declineMatch(match.id)">✗ Recusar</button>
                </template>
                <template v-else-if="match.status === 'accepted'">
                  <button class="match-chat" @click="chatWithMatch(match)">💬 Conversar</button>
                </template>
                <span v-else class="match-waiting">⏳ Aguardando...</span>
              </div>
            </div>
          </div>
        </div>

        <!-- CONFIGURAÇÕES -->
        <div v-show="activeTab === 'settings'" class="tab-pane">
          <!-- Skeleton Loading das Configurações -->
          <div v-if="loadingSettings" class="settings-skeleton">
            <div class="skeleton-sidebar shimmer"></div>
            <div class="skeleton-form">
              <div class="skeleton-field shimmer"></div>
              <div class="skeleton-field shimmer"></div>
              <div class="skeleton-field shimmer"></div>
            </div>
          </div>

          <div v-else class="settings-layout">
            <div class="settings-sidebar">
              <button
                v-for="section in settingsSections"
                :key="section.id"
                class="settings-nav"
                :class="{ active: activeSetting === section.id }"
                @click="activeSetting = section.id"
              >
                <span class="nav-emoji">{{ section.emoji }}</span>
                <span class="nav-text">{{ section.name }}</span>
              </button>
            </div>

            <div class="settings-main">
              <!-- Perfil -->
              <div v-show="activeSetting === 'profile'">
                <h3>Informações Pessoais</h3>
                <div class="settings-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Nome completo</label>
                      <input type="text" v-model="editForm.nome" placeholder="Seu nome" />
                    </div>
                    <div class="form-group">
                      <label>Email</label>
                      <input type="email" v-model="editForm.email" placeholder="seu@email.com" />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Telefone</label>
                      <input type="tel" v-model="editForm.telefone" placeholder="84XXXXXXX" />
                    </div>
                    <div class="form-group">
                      <label>Cidade</label>
                      <select v-model="editForm.cidade">
                        <option value="Maputo">Maputo</option>
                        <option value="Matola">Matola</option>
                        <option value="Beira">Beira</option>
                        <option value="Nampula">Nampula</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Biografia</label>
                    <textarea v-model="editForm.bio" rows="3" placeholder="Conte um pouco sobre você..."></textarea>
                  </div>
                </div>
              </div>

              <!-- Interesses -->
              <div v-show="activeSetting === 'interests'">
                <h3>Meus Interesses</h3>
                <p class="settings-hint">Selecione seus interesses para recomendação personalizada</p>
                <div class="interests-cloud">
                  <label v-for="interest in interests" :key="interest.id" class="interest-tag">
                    <input type="checkbox" :value="interest.id" v-model="editForm.interesses" />
                    <span>{{ interest.emoji }} {{ interest.name }}</span>
                  </label>
                </div>
              </div>

              <!-- Notificações -->
              <div v-show="activeSetting === 'notifications'">
                <h3>Preferências</h3>
                <div class="notif-list">
                  <div class="notif-item">
                    <div class="notif-info">
                      <span>📧 Notificações por Email</span>
                      <p>Receba novidades e promoções</p>
                    </div>
                    <label class="toggle">
                      <input type="checkbox" v-model="notifSettings.email" />
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="notif-item">
                    <div class="notif-info">
                      <span>📱 Push Notifications</span>
                      <p>Alertas em tempo real</p>
                    </div>
                    <label class="toggle">
                      <input type="checkbox" v-model="notifSettings.push" />
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="notif-item">
                    <div class="notif-info">
                      <span>💕 Novos Matches</span>
                      <p>Quando alguém pede match com você</p>
                    </div>
                    <label class="toggle">
                      <input type="checkbox" v-model="notifSettings.matches" />
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Segurança -->
              <div v-show="activeSetting === 'security'">
                <h3>Segurança da Conta</h3>
                <div class="settings-form">
                  <div class="form-group">
                    <label>Senha atual</label>
                    <input type="password" v-model="securityForm.currentPassword" />
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Nova senha</label>
                      <input type="password" v-model="securityForm.newPassword" />
                    </div>
                    <div class="form-group">
                      <label>Confirmar senha</label>
                      <input type="password" v-model="securityForm.confirmPassword" />
                    </div>
                  </div>
                  <button class="btn-save" @click="changePassword">Alterar Senha</button>

                  <div class="danger-box">
                    <h4>⚠️ Zona de Perigo</h4>
                    <p>Excluir sua conta é uma ação irreversível</p>
                    <button class="btn-danger" @click="deleteAccount">Excluir Conta</button>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button class="btn-save" @click="saveProfile">Salvar Alterações</button>
                <button class="btn-cancel" @click="cancelChanges">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Promotor -->
    <div v-if="showPromoterModal" class="modal" @click.self="showPromoterModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <span class="modal-emoji">⭐</span>
          <h2>Tornar-se Promotor</h2>
        </div>
        <div class="modal-body">
          <p>Benefícios exclusivos:</p>
          <ul>
            <li>✓ Eventos ilimitados</li>
            <li>✓ Destaque na plataforma</li>
            <li>✓ Estatísticas avançadas</li>
            <li>✓ Suporte prioritário</li>
          </ul>
          <div class="promoter-price">
            <span class="price-label">Taxa única</span>
            <span class="price-value">500 MZN</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showPromoterModal = false">Cancelar</button>
          <button class="btn-save" @click="upgradeToPromoter">Confirmar Pagamento</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Estados de Loading
const loadingProfile = ref(true)
const loadingStats = ref(true)
const loadingTabs = ref(true)
const loadingEvents = ref(true)
const loadingTickets = ref(true)
const loadingMatches = ref(true)
const loadingSettings = ref(true)

// Dados do usuário
const user = ref({
  id: 1,
  nome: 'João Silva',
  email: 'joao.silva@email.com',
  telefone: '84 1234 5678',
  cidade: 'Maputo',
  bio: '🎵 Amante da música e cultura moçambicana. Organizador de eventos há 3 anos, sempre em busca de conectar pessoas através de experiências únicas!',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  coverImage: '',
  isPromoter: true,
  isVerified: true,
  isOnline: true,
  createdAt: '2023-01-15',
  eventCount: 12,
  followers: 234,
  following: 89,
  impacto: 1250,
  eventosParticipados: 28
})

const defaultAvatar = 'https://ui-avatars.com/api/?background=6366f1&color=fff&bold=true&length=2&name=JS'
const defaultCover = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=300&fit=crop'

// Estado
const myEvents = ref([])
const myTickets = ref([])
const matches = ref([])
const activeTab = ref('events')
const activeMenu = ref(null)
const activeSetting = ref('profile')
const showPromoterModal = ref(false)

// Formulários
const editForm = ref({
  nome: '',
  email: '',
  telefone: '',
  cidade: '',
  bio: '',
  interesses: []
})

const securityForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const notifSettings = ref({
  email: true,
  push: true,
  matches: true
})

// Interesses
const interests = [
  { id: 'music', name: 'Música', emoji: '🎵' },
  { id: 'art', name: 'Arte', emoji: '🎨' },
  { id: 'tech', name: 'Tecnologia', emoji: '💻' },
  { id: 'food', name: 'Gastronomia', emoji: '🍽️' },
  { id: 'sports', name: 'Esportes', emoji: '⚽' },
  { id: 'travel', name: 'Viagens', emoji: '✈️' },
  { id: 'photo', name: 'Fotografia', emoji: '📸' },
  { id: 'dance', name: 'Dança', emoji: '💃' }
]

// Tabs
const tabs = computed(() => [
  { id: 'events', name: 'Eventos', emoji: '📅', count: myEvents.value.length },
  { id: 'tickets', name: 'Ingressos', emoji: '🎫', count: myTickets.value.length },
  { id: 'matches', name: 'Matches', emoji: '💕', count: matches.value.length },
  { id: 'settings', name: 'Configurações', emoji: '⚙️' }
])

const settingsSections = [
  { id: 'profile', name: 'Perfil', emoji: '👤' },
  { id: 'interests', name: 'Interesses', emoji: '❤️' },
  { id: 'notifications', name: 'Notificações', emoji: '🔔' },
  { id: 'security', name: 'Segurança', emoji: '🔒' }
]

// Funções
const goBack = () => {
  router.back()
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const editProfile = () => {
  activeTab.value = 'settings'
  activeSetting.value = 'profile'
}

const editAvatar = () => {
  alert('Funcionalidade em desenvolvimento')
}

const shareProfile = () => {
  navigator.clipboard.writeText(`https://2goevents.com/perfil/${user.value.id}`)
  alert('Link do perfil copiado!')
}

const toggleMenu = (id) => {
  activeMenu.value = activeMenu.value === id ? null : id
}

const editEvent = (event) => {
  router.push(`/edit-event/${event.id}`)
}

const duplicateEvent = (event) => {
  alert(`Evento "${event.titulo}" duplicado!`)
}

const cancelEvent = (event) => {
  if (confirm(`Cancelar evento "${event.titulo}"?`)) {
    alert('Evento cancelado com sucesso')
  }
}

const viewEvent = (id) => {
  router.push(`/event/${id}`)
}

const payTicket = (ticket) => {
  alert(`Processando pagamento de ${ticket.amount} MZN...`)
}

const viewTicket = (ticket) => {
  alert(`Seu bilhete: ${ticket.qrCode || 'TKT-12345-67890'}\nApresente este código no evento.`)
}

const requestMatch = (event) => {
  alert(`Pedido de match enviado para participantes do evento "${event.titulo}"!`)
}

const acceptMatch = (id) => {
  alert('Match aceito! Vocês agora podem conversar.')
}

const declineMatch = (id) => {
  alert('Match recusado')
}

const chatWithMatch = (match) => {
  alert(`Iniciando conversa com ${match.user.nome}...`)
}

const saveProfile = () => {
  user.value = { ...user.value, ...editForm.value }
  alert('Perfil atualizado com sucesso!')
}

const cancelChanges = () => {
  editForm.value = { ...user.value, interesses: ['music', 'art'] }
  alert('Alterações canceladas')
}

const changePassword = () => {
  if (securityForm.value.newPassword !== securityForm.value.confirmPassword) {
    alert('As senhas não conferem!')
    return
  }
  alert('Senha alterada com sucesso!')
}

const deleteAccount = () => {
  if (confirm('⚠️ Esta ação é irreversível! Tem certeza que deseja excluir sua conta?')) {
    alert('Conta excluída com sucesso')
    router.push('/')
  }
}

const upgradeToPromoter = () => {
  alert('🎉 Parabéns! Agora você é um Promotor Oficial da 2goEvents!')
  showPromoterModal.value = false
  user.value.isPromoter = true
}

// Simular carregamento dos dados
onMounted(() => {
  editForm.value = { ...user.value, interesses: ['music', 'art'] }

  // Simular loading de 1.5 segundos (estilo Instagram/Facebook)
  setTimeout(() => {
    loadingProfile.value = false
    loadingStats.value = false
    loadingTabs.value = false
  }, 800)

  setTimeout(() => {
    myEvents.value = [
      { id: 1, titulo: 'Festival de Música da Cidade', dataHora: '2024-05-15', localizacao: 'Maputo', imagem: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=250&fit=crop', status: 'active', participantes: 127, limite: 200, progress: 63 },
      { id: 2, titulo: 'Exposição de Arte Contemporânea', dataHora: '2024-05-20', localizacao: 'Matola', imagem: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400&h=250&fit=crop', status: 'active', participantes: 45, limite: 100, progress: 45 },
      { id: 3, titulo: 'Workshop de Fotografia', dataHora: '2024-06-01', localizacao: 'Online', imagem: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop', status: 'draft', participantes: 0, limite: 50, progress: 0 }
    ]
    loadingEvents.value = false
  }, 1000)

  setTimeout(() => {
    myTickets.value = [
      { id: 1, eventId: 5, status: 'paid', amount: 250, qrCode: 'EVT-12345', event: { titulo: 'Show de Jazz - Noite Especial', dataHora: '2024-05-25', localizacao: 'Beira' } },
      { id: 2, eventId: 6, status: 'pending', amount: 100, event: { titulo: 'Feira Gastronômica', dataHora: '2024-05-28', localizacao: 'Maputo' } }
    ]
    loadingTickets.value = false
  }, 1200)

  setTimeout(() => {
    matches.value = [
      { id: 1, status: 'accepted', user: { nome: 'Maria Santos', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }, event: { titulo: 'Festival de Música da Cidade', data: '15 Maio 2024' }, isRequester: false },
      { id: 2, status: 'pending', user: { nome: 'Carlos Alberto', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' }, event: { titulo: 'Workshop de Fotografia', data: '01 Junho 2024' }, isRequester: false },
      { id: 3, status: 'accepted', user: { nome: 'Ana Paula', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' }, event: { titulo: 'Exposição de Arte', data: '20 Maio 2024' }, isRequester: true }
    ]
    loadingMatches.value = false
    loadingSettings.value = false
  }, 1500)
})
</script>

<style scoped>
/* ========== VARIÁVEIS E RESET ========== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.user-profile {
  min-height: 100vh;
  background: #f8fafc;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ========== SKELETON LOADING ESTILO FACEBOOK/INSTAGRAM ========== */

/* Skeleton do Header */
.profile-hero-skeleton {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  min-height: 350px;
  position: relative;
  padding: 2rem;
}

.skeleton-cover {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(90deg, #e0e7ff 25%, #f1f5f9 50%, #e0e7ff 75%);
  background-size: 200% 100%;
}

.skeleton-avatar {
  position: absolute;
  bottom: 100px;
  left: 50px;
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 4px solid white;
  background: linear-gradient(90deg, #cbd5e1 25%, #e2e8f0 50%, #cbd5e1 75%);
  background-size: 200% 100%;
}

.skeleton-info {
  position: absolute;
  bottom: 40px;
  left: 220px;
  right: 40px;
}

.skeleton-name {
  width: 200px;
  height: 32px;
  background: linear-gradient(90deg, #cbd5e1 25%, #e2e8f0 50%, #cbd5e1 75%);
  background-size: 200% 100%;
  border-radius: 8px;
  margin-bottom: 12px;
}

.skeleton-bio {
  width: 300px;
  height: 16px;
  background: linear-gradient(90deg, #cbd5e1 25%, #e2e8f0 50%, #cbd5e1 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 12px;
}

.skeleton-details {
  width: 250px;
  height: 14px;
  background: linear-gradient(90deg, #cbd5e1 25%, #e2e8f0 50%, #cbd5e1 75%);
  background-size: 200% 100%;
  border-radius: 4px;
}

/* Skeleton das Stats */
.hero-stats-skeleton {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  margin: 2rem 2rem 0;
  padding: 1.5rem 2rem;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  flex-wrap: wrap;
}

.skeleton-stat {
  width: 80px;
  height: 60px;
  background: linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 75%);
  background-size: 200% 100%;
  border-radius: 12px;
}

/* Skeleton das Tabs */
.tabs-skeleton {
  display: flex;
  gap: 0.5rem;
  margin: 2rem 0 1.5rem;
}

.skeleton-tab {
  width: 100px;
  height: 48px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 1rem;
}

/* Skeleton dos Cards */
.skeleton-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
}

.skeleton-image {
  height: 160px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
}

.skeleton-content {
  padding: 1rem;
}

.skeleton-title {
  height: 20px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 12px;
  width: 80%;
}

.skeleton-text {
  height: 14px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  margin-bottom: 8px;
}

.skeleton-text.short {
  width: 60%;
}

.skeleton-button {
  height: 32px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 2rem;
  margin-top: 12px;
  width: 120px;
}

/* Skeleton dos Tickets */
.loading-tickets {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-ticket-card {
  display: flex;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  height: 150px;
}

.skeleton-ticket-sidebar {
  width: 80px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
}

.skeleton-ticket-content {
  flex: 1;
  padding: 1rem;
}

/* Skeleton dos Matches */
.loading-matches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.skeleton-match-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 1rem;
}

.skeleton-match-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
}

.skeleton-match-content {
  flex: 1;
}

/* Skeleton das Configurações */
.settings-skeleton {
  display: flex;
  gap: 2rem;
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
}

.skeleton-sidebar {
  width: 240px;
  background: linear-gradient(90deg, #f8fafc 25%, #f1f5f9 50%, #f8fafc 75%);
  background-size: 200% 100%;
  min-height: 400px;
}

.skeleton-form {
  flex: 1;
  padding: 2rem;
}

.skeleton-field {
  height: 50px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
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

/* ========== BOTÃO VOLTAR ========== */
.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 2rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #4f46e5;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: white;
  transform: translateX(-4px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
}

.back-arrow {
  font-size: 1.2rem;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.back-button:hover .back-arrow {
  transform: translateX(-2px);
}

.back-text {
  font-size: 0.85rem;
}

/* ========== HERO SECTION ========== */
.profile-hero {
  position: relative;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  padding-bottom: 2rem;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 280px;
  overflow: hidden;
}

.hero-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(99,102,241,0.85) 0%, rgba(79,70,229,0.9) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  padding-top: 200px;
  flex-wrap: wrap;
}

.hero-left {
  display: flex;
  gap: 2rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.avatar-wrapper {
  position: relative;
}

.avatar-container {
  position: relative;
}

.avatar-container img {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 4px solid white;
  object-fit: cover;
  box-shadow: 0 20px 25px -12px rgba(0,0,0,0.2);
}

.avatar-edit {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.avatar-edit:hover {
  transform: scale(1.1);
}

.online-status {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 16px;
  height: 16px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
}

.hero-info {
  padding-bottom: 0.5rem;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.name-row h1 {
  font-size: 2rem;
  color: white;
  font-weight: 700;
}

.verified-icon {
  background: #10b981;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.promoter-icon {
  background: #fbbf24;
  color: #1e293b;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.user-bio {
  max-width: 500px;
  margin-bottom: 0.75rem;
}

.user-bio p {
  color: rgba(255,255,255,0.95);
  font-size: 0.9rem;
  line-height: 1.4;
}

.user-details {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.detail {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.85);
}

.detail-icon {
  font-size: 0.85rem;
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  padding-bottom: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.85rem;
}

.action-btn.primary {
  background: white;
  color: #4f46e5;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -6px rgba(0,0,0,0.15);
}

.action-btn.premium {
  background: rgba(251,191,36,0.9);
  color: #1e293b;
}

.action-btn.premium:hover {
  background: #fbbf24;
  transform: translateY(-2px);
}

.action-btn.icon {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(8px);
  color: white;
  padding: 0.6rem;
}

.action-btn.icon:hover {
  background: rgba(255,255,255,0.3);
}

.hero-stats {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem 2rem;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  margin-left: 2rem;
  margin-right: 2rem;
  flex-wrap: wrap;
}

.stat-card {
  text-align: center;
  flex: 1;
  min-width: 80px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
}

.stat-label {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.8);
  margin-top: 0.25rem;
}

/* ========== TABS ========== */
.tabs-navigation {
  display: flex;
  gap: 0.5rem;
  margin: 2rem 0 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs-navigation::-webkit-scrollbar {
  display: none;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button.active {
  color: #4f46e5;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #4f46e5;
}

.tab-emoji {
  font-size: 1.1rem;
}

.tab-badge {
  background: #e2e8f0;
  padding: 0.1rem 0.5rem;
  border-radius: 20px;
  font-size: 0.7rem;
}

.tab-container {
  min-height: 400px;
  margin-bottom: 3rem;
}

/* ========== PANE HEADER ========== */
.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.pane-header h2 {
  font-size: 1.3rem;
  color: #0f172a;
}

.pane-header p {
  color: #64748b;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.create-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -6px #6366f1;
}

/* ========== EVENTOS ========== */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

.event-item {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.event-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
}

.event-cover {
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.event-status {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #10b981;
  color: white;
}

.event-status.draft {
  background: #94a3b8;
}

.event-menu {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.menu-dropdown {
  position: absolute;
  top: 45px;
  right: 10px;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
  overflow: hidden;
  min-width: 120px;
  z-index: 10;
}

.menu-dropdown button {
  display: block;
  width: 100%;
  padding: 0.6rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
}

.menu-dropdown button:hover {
  background: #f1f5f9;
}

.menu-dropdown button.danger {
  color: #ef4444;
}

.event-body {
  padding: 1rem;
}

.event-body h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: #0f172a;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
  font-size: 0.7rem;
  color: #64748b;
}

.event-progress {
  margin: 0.75rem 0;
}

.progress-bar {
  background: #e2e8f0;
  border-radius: 20px;
  height: 6px;
  overflow: hidden;
}

.progress-fill {
  background: linear-gradient(90deg, #6366f1, #4f46e5);
  height: 100%;
  border-radius: 20px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.7rem;
  color: #64748b;
  display: block;
  margin-top: 0.25rem;
}

.view-btn {
  background: none;
  border: none;
  color: #4f46e5;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-btn:hover {
  transform: translateX(4px);
}

/* ========== INGRESSOS ========== */
.tickets-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ticket-item {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  border-left: 4px solid #f59e0b;
}

.ticket-item.paid {
  border-left-color: #10b981;
}

.ticket-corner {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 50px 50px 0;
  border-color: transparent #f59e0b transparent transparent;
}

.ticket-item.paid .ticket-corner {
  border-color: transparent #10b981 transparent transparent;
}

.ticket-content {
  padding: 1rem;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ticket-icon {
  font-size: 2rem;
}

.ticket-status-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.6rem;
  font-weight: 700;
  background: #fef3c7;
  color: #d97706;
}

.ticket-item.paid .ticket-status-badge {
  background: #d1fae5;
  color: #10b981;
}

.ticket-content h3 {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.ticket-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: #64748b;
}

.ticket-footer {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-pay, .btn-view-ticket, .btn-match {
  padding: 0.4rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-pay {
  background: #4f46e5;
  color: white;
}

.btn-pay:hover {
  background: #4338ca;
}

.btn-view-ticket {
  background: #f1f5f9;
  color: #475569;
}

.btn-view-ticket:hover {
  background: #e2e8f0;
}

.btn-match {
  background: #fdf2f8;
  color: #db2777;
}

.btn-match:hover {
  background: #fce7f3;
}

/* ========== MATCHES ========== */
.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.match-item {
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.match-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -8px rgba(0,0,0,0.1);
}

.match-avatar {
  position: relative;
  flex-shrink: 0;
}

.match-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.match-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.match-status.accepted {
  background: #10b981;
}

.match-status.pending {
  background: #f59e0b;
}

.match-info {
  flex: 1;
  min-width: 0;
}

.match-info h4 {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.match-event, .match-date {
  font-size: 0.7rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.match-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.match-accept, .match-decline, .match-chat, .match-waiting {
  padding: 0.3rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.match-accept {
  background: #10b981;
  color: white;
}

.match-decline {
  background: #ef4444;
  color: white;
}

.match-chat {
  background: #4f46e5;
  color: white;
}

.match-waiting {
  background: #f1f5f9;
  color: #64748b;
}

/* ========== CONFIGURAÇÕES ========== */
.settings-layout {
  display: flex;
  gap: 2rem;
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
}

.settings-sidebar {
  width: 240px;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 1rem 0;
}

.settings-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #475569;
  transition: all 0.3s ease;
}

.settings-nav:hover {
  background: #f1f5f9;
}

.settings-nav.active {
  background: #e0e7ff;
  color: #4f46e5;
  border-right: 2px solid #4f46e5;
}

.nav-emoji {
  font-size: 1.1rem;
}

.settings-main {
  flex: 1;
  padding: 1.5rem;
}

.settings-main h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #0f172a;
}

.settings-hint {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 500;
  color: #1e293b;
}

.form-group input, .form-group select, .form-group textarea {
  padding: 0.6rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.85rem;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: #4f46e5;
}

/* Interesses */
.interests-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.interest-tag {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: #f1f5f9;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.interest-tag:hover {
  background: #e2e8f0;
}

.interest-tag input {
  margin: 0;
}

.interest-tag span {
  font-size: 0.85rem;
}

/* Notificações */
.notif-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notif-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.notif-info span {
  font-weight: 500;
  font-size: 0.85rem;
}

.notif-info p {
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 0.2rem;
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  flex-shrink: 0;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #4f46e5;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

/* Botões */
.btn-save, .btn-cancel {
  padding: 0.6rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-save {
  background: #4f46e5;
  color: white;
}

.btn-save:hover {
  background: #4338ca;
  transform: translateY(-1px);
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
}

.danger-box {
  margin-top: 2rem;
  padding: 1rem;
  background: #fef2f2;
  border-radius: 1rem;
}

.danger-box h4 {
  color: #dc2626;
  margin-bottom: 0.25rem;
}

.danger-box p {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* ========== MODAL ========== */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  border-radius: 1.5rem;
  max-width: 450px;
  width: 90%;
  overflow: hidden;
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  padding: 1.5rem;
  text-align: center;
}

.modal-emoji {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.modal-header h2 {
  color: white;
  font-size: 1.3rem;
}

.modal-body {
  padding: 1.5rem;
}

.modal-body ul {
  margin: 1rem 0;
  padding-left: 1.5rem;
}

.modal-body li {
  margin: 0.5rem 0;
  color: #334155;
}

.promoter-price {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 1rem;
  border-radius: 1rem;
  text-align: center;
  margin-top: 1rem;
}

.price-label {
  display: block;
  font-size: 0.7rem;
  color: #92400e;
}

.price-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #d97706;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem 1.5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

/* ========== LOADING ========== */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

/* ========== EMPTY STATE ========== */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
}

.empty-emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

/* ========== RESPONSIVIDADE ========== */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .back-button {
    top: 12px;
    left: 12px;
    padding: 0.5rem;
    border-radius: 50%;
  }

  .back-text {
    display: none;
  }

  .back-arrow {
    margin: 0;
  }

  .hero-content {
    flex-direction: column;
    align-items: stretch;
    padding-top: 160px;
  }

  .hero-left {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .hero-info {
    text-align: center;
  }

  .name-row {
    justify-content: center;
  }

  .user-details {
    justify-content: center;
  }

  .hero-actions {
    justify-content: center;
  }

  .action-btn .btn-text {
    display: none;
  }

  .action-btn {
    padding: 0.6rem;
  }

  .hero-stats {
    margin-left: 1rem;
    margin-right: 1rem;
    gap: 0.5rem;
    padding: 1rem;
  }

  .stat-value {
    font-size: 1rem;
  }

  .settings-layout {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
    display: flex;
    overflow-x: auto;
    padding: 0.5rem;
    gap: 0.5rem;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .settings-nav {
    width: auto;
    padding: 0.5rem 1rem;
    border-radius: 2rem;
  }

  .settings-nav .nav-text {
    display: inline;
  }

  .settings-nav.active {
    background: #4f46e5;
    color: white;
    border-right: none;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .events-grid, .loading-grid {
    grid-template-columns: 1fr;
  }

  .matches-grid {
    grid-template-columns: 1fr;
  }

  .ticket-info {
    grid-template-columns: 1fr;
  }

  .match-item {
    flex-direction: column;
    text-align: center;
  }

  .match-actions {
    justify-content: center;
  }

  .tabs-navigation {
    gap: 0.25rem;
  }

  .tab-button {
    padding: 0.5rem 1rem;
  }

  .tab-name {
    display: none;
  }

  .tab-button .tab-emoji {
    font-size: 1.2rem;
  }

  /* Skeleton responsivo */
  .skeleton-avatar {
    left: 50%;
    transform: translateX(-50%);
  }

  .skeleton-info {
    left: 20px;
    right: 20px;
    text-align: center;
  }

  .skeleton-name {
    margin: 0 auto 12px;
  }

  .skeleton-bio {
    margin: 0 auto 12px;
  }

  .skeleton-details {
    margin: 0 auto;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .matches-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
