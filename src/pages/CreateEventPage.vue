<template>
  <div class="create-event-page">
    <!-- Botão Voltar -->
    <button class="back-button" @click="goBack">
      <span class="back-arrow">←</span>
      <span class="back-text">Voltar</span>
    </button>

    <div class="container">
      <!-- Header da Página -->
      <div class="page-header">
        <div class="header-badge">
          <span class="badge-icon">{{ isEditing ? '✏️' : '✨' }}</span>
          <span class="badge-text">{{ isEditing ? 'Edição' : 'Novo Evento' }}</span>
        </div>
        <h1>{{ isEditing ? 'Editar Evento' : 'Criar Novo Evento' }}</h1>
        <p>{{ isEditing ? 'Atualize as informações do seu evento' : 'Preencha os detalhes do seu evento para começar' }}</p>
      </div>

      <!-- STEPS NAVIGATION -->
      <div class="steps-wrapper">
        <div class="steps-container">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step-item"
            :class="{
              active: currentStep === index,
              completed: currentStep > index
            }"
            @click="currentStep = index"
          >
            <div class="step-number">
              <span v-if="currentStep > index">✓</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div class="step-content">
              <span class="step-label">{{ step.label }}</span>
              <span class="step-title">{{ step.title }}</span>
            </div>
          </div>
        </div>

        <!-- Barra de Progresso -->
        <div class="progress-bar-container">
          <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="progress-text">
          <span>{{ progressPercent }}% completo</span>
        </div>
      </div>

      <!-- Formulário com Steps -->
      <form @submit.prevent="submitEvent" class="event-form">
        <!-- STEP 1: Informações Básicas -->
        <div v-show="currentStep === 0" class="form-step">
          <div class="form-sections">
            <div class="form-section">
              <div class="section-title">
                <span class="section-icon">📋</span>
                <h3>Informações Básicas</h3>
              </div>

              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Título do Evento <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <span class="input-icon">🏷️</span>
                    <input
                      type="text"
                      v-model="form.titulo"
                      required
                      placeholder="Ex: Festival de Música 2026"
                      :class="{ 'has-value': form.titulo }"
                    />
                  </div>
                  <span class="input-hint">Um título claro e atraente ajuda a chamar atenção</span>
                </div>

                <div class="form-group full-width">
                  <label>Descrição <span class="required">*</span></label>
                  <div class="textarea-wrapper">
                    <textarea
                      v-model="form.descricao"
                      rows="5"
                      required
                      placeholder="Descreva seu evento... O que os participantes podem esperar? Programação, atrações, etc."
                    ></textarea>
                    <span class="char-count">{{ form.descricao.length }}/2000</span>
                  </div>
                </div>

                <div class="form-group">
                  <label>Categoria <span class="required">*</span></label>
                  <div class="select-wrapper">
                    <span class="select-icon">📂</span>
                    <select v-model="form.categoryId" required>
                      <option value="">Selecione uma categoria</option>
                      <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.emoji || '🎯' }} {{ cat.nome }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Tipo de Evento <span class="required">*</span></label>
                  <div class="radio-group">
                    <label class="radio-card" :class="{ active: form.tipo === 'gratuito' }">
                      <input type="radio" value="gratuito" v-model="form.tipo" />
                      <div class="radio-content">
                        <span class="radio-emoji">🎁</span>
                        <span class="radio-title">Grátis</span>
                        <span class="radio-desc">Evento sem custo</span>
                      </div>
                    </label>
                    <label class="radio-card" :class="{ active: form.tipo === 'pago' }">
                      <input type="radio" value="pago" v-model="form.tipo" />
                      <div class="radio-content">
                        <span class="radio-emoji">💰</span>
                        <span class="radio-title">Pago</span>
                        <span class="radio-desc">Ingresso com valor</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="form-group" v-if="form.tipo === 'pago'">
                  <label>Preço (MZN)</label>
                  <div class="input-wrapper">
                    <span class="input-icon">💵</span>
                    <input type="number" v-model="form.preco" min="1" step="1" placeholder="0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: Data e Local -->
        <div v-show="currentStep === 1" class="form-step">
          <div class="form-sections">
            <div class="form-section">
              <div class="section-title">
                <span class="section-icon">📍</span>
                <h3>Data e Localização</h3>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>Data e Hora <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <span class="input-icon">📅</span>
                    <input type="datetime-local" v-model="form.dataHora" required />
                  </div>
                </div>

                <div class="form-group">
                  <label>Cidade <span class="required">*</span></label>
                  <div class="select-wrapper">
                    <span class="select-icon">🏙️</span>
                    <select v-model="form.cidade" required>
                      <option value="Maputo">Maputo</option>
                      <option value="Matola">Matola</option>
                      <option value="Beira">Beira</option>
                      <option value="Nampula">Nampula</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                </div>

                <div class="form-group full-width">
                  <label>Localização <span class="required">*</span></label>
                  <div class="input-wrapper">
                    <span class="input-icon">📍</span>
                    <input type="text" v-model="form.localizacao" required placeholder="Endereço completo, bairro, referência" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 3: Mídia e Capacidade -->
        <div v-show="currentStep === 2" class="form-step">
          <div class="form-sections">
            <div class="form-section">
              <div class="section-title">
                <span class="section-icon">🎨</span>
                <h3>Mídia e Capacidade</h3>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label>Imagem do Evento</label>
                  <div class="image-upload">
                    <div class="image-preview" v-if="form.imagem">
                      <img :src="form.imagem" alt="Preview" />
                      <button type="button" class="remove-image" @click="form.imagem = ''">✕</button>
                    </div>
                    <div v-else class="upload-placeholder" @click="triggerImageInput">
                      <span class="upload-icon">🖼️</span>
                      <span>Adicionar imagem</span>
                      <small>URL da imagem</small>
                    </div>
                    <input
                      type="url"
                      v-model="form.imagem"
                      placeholder="https://..."
                      style="display: none;"
                      ref="imageInput"
                    />
                    <button type="button" class="btn-upload" @click="triggerImageInput">
                      <span>📷</span> Alterar imagem
                    </button>
                  </div>
                  <span class="input-hint">Use imagens atrativas com pelo menos 800x400px</span>
                </div>

                <div class="form-group">
                  <label>Limite de Participantes</label>
                  <div class="input-wrapper">
                    <span class="input-icon">👥</span>
                    <input type="number" v-model="form.limiteParticipantes" min="1" />
                  </div>
                  <span class="input-hint">Deixe em branco para ilimitado</span>
                </div>

                <div class="form-group">
                  <label>Idade Mínima</label>
                  <div class="select-wrapper">
                    <span class="select-icon">🔞</span>
                    <select v-model="form.idadeMinima">
                      <option :value="null">Livre para todas as idades</option>
                      <option :value="16">16+ (Adolescentes)</option>
                      <option :value="18">18+ (Adultos)</option>
                      <option :value="21">21+ (Maiores de 21)</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="checkbox-card">
                    <input type="checkbox" v-model="form.requiresAgeVerification" />
                    <div class="checkbox-content">
                      <span class="checkbox-emoji">🆔</span>
                      <div>
                        <span class="checkbox-title">Exige verificação de idade</span>
                        <span class="checkbox-desc">Documento na entrada</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 4: Detalhes Adicionais -->
        <div v-show="currentStep === 3" class="form-step">
          <div class="form-sections">
            <div class="form-section">
              <div class="section-title">
                <span class="section-icon">🎯</span>
                <h3>Detalhes Adicionais</h3>
              </div>

              <div class="form-grid">
                <div class="form-group full-width">
                  <label>Convidados / Artistas</label>
                  <div class="tags-input">
                    <div class="tags-list">
                      <span v-for="guest in guestList" :key="guest.id" class="tag">
                        <span class="tag-avatar">{{ guest.avatar || '🎤' }}</span>
                        {{ guest.nome }}
                        <button type="button" class="tag-remove" @click="removeGuest(guest.id)">✕</button>
                      </span>
                    </div>
                    <div class="tags-selector">
                      <select v-model="selectedGuestId" @change="addGuest">
                        <option value="">+ Adicionar convidado</option>
                        <option v-for="guest in availableGuests" :key="guest.id" :value="guest.id">
                          {{ guest.nome }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <span class="input-hint">Adicione artistas, palestrantes ou convidados especiais</span>
                </div>

                <div class="form-group full-width">
                  <label>Tags</label>
                  <div class="tags-input">
                    <div class="tags-list">
                      <span v-for="tag in form.tags" :key="tag" class="tag tag-colored">
                        <span>#</span>{{ tag }}
                        <button type="button" class="tag-remove" @click="removeTag(tag)">✕</button>
                      </span>
                    </div>
                    <div class="tag-input-wrapper">
                      <input
                        type="text"
                        v-model="newTag"
                        @keyup.enter="addTag"
                        placeholder="Digite uma tag e pressione Enter"
                      />
                      <button type="button" @click="addTag" class="btn-add-tag">+</button>
                    </div>
                  </div>
                  <span class="input-hint">Ex: música, festival, cultura, workshop</span>
                </div>

                <div class="form-group full-width">
                  <label class="promote-card">
                    <input type="checkbox" v-model="form.isPromoted" />
                    <div class="promote-content">
                      <div class="promote-left">
                        <span class="promote-emoji">⭐</span>
                        <div>
                          <span class="promote-title">Promover evento</span>
                          <span class="promote-desc">Destaque na página inicial</span>
                        </div>
                      </div>
                      <div class="promote-price">+ 100 MZN</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navegação entre Steps -->
        <div class="form-navigation">
          <button
            v-if="currentStep > 0"
            type="button"
            class="nav-btn prev"
            @click="currentStep--"
          >
            ← Voltar
          </button>

          <button
            v-if="currentStep < steps.length - 1"
            type="button"
            class="nav-btn next"
            @click="currentStep++"
            :disabled="!canGoNext"
          >
            Continuar →
          </button>

          <button
            v-if="currentStep === steps.length - 1"
            type="submit"
            class="nav-btn publish"
            :disabled="!isFormValid"
          >
            <span>{{ isEditing ? '💾' : '🚀' }}</span>
            {{ isEditing ? 'Salvar Alterações' : 'Publicar Evento' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userService } from '../services/userService'
import { categoryService } from '../services/categoryService'

const router = useRouter()
const route = useRoute()
const isEditing = ref(false)
const categories = ref([])
const imageInput = ref(null)
const currentStep = ref(0)

// Steps configuration
const steps = [
  { label: 'PASSO 1', title: 'Informações Básicas' },
  { label: 'PASSO 2', title: 'Data e Local' },
  { label: 'PASSO 3', title: 'Mídia e Capacidade' },
  { label: 'PASSO 4', title: 'Detalhes Finais' }
]

// Dados mockados de convidados
const allGuests = ref([
  { id: 1, nome: 'DJ Alok', avatar: '🎧', tipo: 'artista' },
  { id: 2, nome: 'Gustavo Cerbasi', avatar: '📊', tipo: 'palestrante' },
  { id: 3, nome: 'Anitta', avatar: '🎤', tipo: 'artista' },
  { id: 4, nome: 'Marta', avatar: '⚽', tipo: 'atleta' },
  { id: 5, nome: 'Felipe Neto', avatar: '🎥', tipo: 'influencer' },
  { id: 6, nome: 'Silvia', avatar: '🎨', tipo: 'artista' },
  { id: 7, nome: 'Lizha James', avatar: '🎵', tipo: 'artista' },
  { id: 8, nome: 'Neyma', avatar: '🎶', tipo: 'artista' }
])

const guestList = ref([])
const selectedGuestId = ref('')
const newTag = ref('')

const form = ref({
  titulo: '',
  descricao: '',
  categoryId: '',
  dataHora: '',
  cidade: 'Maputo',
  localizacao: '',
  imagem: '',
  limiteParticipantes: null,
  tipo: 'gratuito',
  preco: null,
  guestIds: [],
  tags: [],
  isPromoted: false,
  idadeMinima: null,
  requiresAgeVerification: false
})

// Computed para validação dos steps
const progressPercent = computed(() => {
  let completed = 0
  if (form.value.titulo) completed += 12.5
  if (form.value.descricao) completed += 12.5
  if (form.value.categoryId) completed += 12.5
  if (form.value.dataHora) completed += 12.5
  if (form.value.localizacao) completed += 12.5
  if (form.value.imagem) completed += 12.5
  if (form.value.tags.length > 0) completed += 12.5
  if (form.value.guestIds.length > 0 || form.value.limiteParticipantes) completed += 12.5
  return Math.min(completed, 100)
})

const isStep1Valid = computed(() => {
  return form.value.titulo && form.value.descricao && form.value.categoryId
})

const isStep2Valid = computed(() => {
  return form.value.dataHora && form.value.localizacao
})

const isStep3Valid = computed(() => {
  return true // Mídia e capacidade são opcionais
})

const isStep4Valid = computed(() => {
  return true // Detalhes adicionais são opcionais
})

const canGoNext = computed(() => {
  if (currentStep.value === 0) return isStep1Valid.value
  if (currentStep.value === 1) return isStep2Valid.value
  if (currentStep.value === 2) return isStep3Valid.value
  if (currentStep.value === 3) return isStep4Valid.value
  return true
})

const isFormValid = computed(() => {
  return isStep1Valid.value && isStep2Valid.value
})

const availableGuests = computed(() => {
  return allGuests.value.filter(g => !guestList.value.some(guest => guest.id === g.id))
})

// Funções
const goBack = () => {
  router.back()
}

const triggerImageInput = () => {
  const url = prompt('Digite a URL da imagem do evento:')
  if (url) {
    form.value.imagem = url
  }
}

const addGuest = () => {
  if (selectedGuestId.value) {
    const guest = allGuests.value.find(g => g.id === parseInt(selectedGuestId.value))
    if (guest && !guestList.value.some(g => g.id === guest.id)) {
      guestList.value.push(guest)
      form.value.guestIds.push(guest.id)
    }
    selectedGuestId.value = ''
  }
}

const removeGuest = (guestId) => {
  guestList.value = guestList.value.filter(g => g.id !== guestId)
  form.value.guestIds = form.value.guestIds.filter(id => id !== guestId)
}

const addTag = () => {
  if (newTag.value.trim() && !form.value.tags.includes(newTag.value.trim().toLowerCase())) {
    form.value.tags.push(newTag.value.trim().toLowerCase())
    newTag.value = ''
  }
}

const removeTag = (tag) => {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

const submitEvent = async () => {
  try {
    const currentUser = await userService.getCurrentUser()

    if (!currentUser.isPromoter) {
      alert('⚠️ Apenas promotores podem criar eventos. Torne-se promotor primeiro!')
      return
    }

    if (!form.value.imagem) {
      form.value.imagem = 'https://picsum.photos/id/29/800/400'
    }

    const eventData = {
      ...form.value,
      creatorId: currentUser.id,
      createdAt: new Date().toISOString(),
      status: 'active',
      participantes: 0,
      views: 0
    }

    if (isEditing.value) {
      await userService.updateEvent(route.params.id, eventData)
      alert('✅ Evento atualizado com sucesso!')
    } else {
      await userService.createEvent(eventData)
      alert('🎉 Evento criado com sucesso!')
    }

    router.push('/profile')
  } catch (error) {
    alert('❌ Erro ao salvar evento: ' + error.message)
  }
}

onMounted(async () => {
  categories.value = await categoryService.getCategories()

  const categoryEmojis = {
    1: '🎵', 2: '🌙', 3: '🎨', 4: '🎪', 5: '👥', 6: '🏃', 7: '💼', 8: '🍽️'
  }
  categories.value = categories.value.map(cat => ({
    ...cat,
    emoji: categoryEmojis[cat.id] || '🎯'
  }))

  if (route.params.id) {
    isEditing.value = true
    const currentUser = await userService.getCurrentUser()
    const myEvents = await userService.getMyCreatedEvents(currentUser.id)
    const event = myEvents.find(e => e.id == route.params.id)
    if (event) {
      form.value = { ...event }
      if (event.guestIds) {
        guestList.value = allGuests.value.filter(g => event.guestIds.includes(g.id))
      }
      if (event.tags) {
        form.value.tags = event.tags
      }
    }
  }
})

// Watch para validar steps
watch([form], () => {
  // Auto-avance se o step atual estiver completo (opcional)
}, { deep: true })
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.create-event-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 2rem 0 4rem;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
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
}

/* ========== HEADER ========== */
.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 1rem;
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  border-radius: 2rem;
  margin-bottom: 1rem;
}

.badge-icon {
  font-size: 0.9rem;
}

.badge-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4f46e5;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.page-header h1 {
  font-size: 2rem;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #64748b;
  font-size: 0.95rem;
}

/* ========== STEPS NAVIGATION ========== */
.steps-wrapper {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.steps-container {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.step-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.6;
}

.step-item.active {
  background: #e0e7ff;
  opacity: 1;
}

.step-item.completed {
  background: #dcfce7;
  opacity: 1;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #cbd5e1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.85rem;
  color: #475569;
  transition: all 0.3s ease;
}

.step-item.active .step-number {
  background: #4f46e5;
  color: white;
}

.step-item.completed .step-number {
  background: #10b981;
  color: white;
}

.step-content {
  display: flex;
  flex-direction: column;
}

.step-label {
  font-size: 0.6rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.step-title {
  font-size: 0.8rem;
  font-weight: 500;
  color: #0f172a;
}

.progress-bar-container {
  background: #e2e8f0;
  border-radius: 1rem;
  height: 8px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #4f46e5);
  border-radius: 1rem;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: right;
  font-size: 0.7rem;
  color: #64748b;
}

/* ========== FORMULÁRIO ========== */
.event-form {
  background: white;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.1);
}

.form-step {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-sections {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.section-icon {
  font-size: 1.3rem;
}

.section-title h3 {
  font-size: 1.1rem;
  color: #0f172a;
  font-weight: 600;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required {
  color: #ef4444;
}

.input-wrapper, .select-wrapper, .textarea-wrapper {
  position: relative;
}

.input-icon, .select-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
}

.select-icon {
  pointer-events: none;
}

.input-wrapper input, .select-wrapper select {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
}

.textarea-wrapper textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
}

.input-wrapper input:focus,
.select-wrapper select:focus,
.textarea-wrapper textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.input-hint {
  font-size: 0.7rem;
  color: #94a3b8;
}

.char-count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.7rem;
  color: #94a3b8;
  background: white;
  padding: 0 4px;
}

/* ========== RADIO CARDS ========== */
.radio-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.radio-card {
  cursor: pointer;
}

.radio-card input {
  display: none;
}

.radio-content {
  padding: 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.75rem;
  text-align: center;
  transition: all 0.3s ease;
  background: white;
}

.radio-card.active .radio-content {
  border-color: #4f46e5;
  background: #eef2ff;
}

.radio-emoji {
  font-size: 1.5rem;
  display: block;
  margin-bottom: 0.25rem;
}

.radio-title {
  font-weight: 600;
  font-size: 0.9rem;
  display: block;
}

.radio-desc {
  font-size: 0.7rem;
  color: #64748b;
}

/* ========== IMAGE UPLOAD ========== */
.image-upload {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.image-preview {
  position: relative;
  width: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed #e2e8f0;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  border-color: #4f46e5;
  background: #f8fafc;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.btn-upload {
  padding: 0.5rem;
  background: #f1f5f9;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
}

/* ========== CHECKBOX CARD ========== */
.checkbox-card, .promote-card {
  cursor: pointer;
  display: block;
}

.checkbox-card input, .promote-card input {
  display: none;
}

.checkbox-content, .promote-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.checkbox-card:has(input:checked) .checkbox-content,
.promote-card:has(input:checked) .promote-content {
  border-color: #4f46e5;
  background: #eef2ff;
}

.checkbox-emoji, .promote-emoji {
  font-size: 1.3rem;
}

.checkbox-title, .promote-title {
  font-weight: 600;
  font-size: 0.85rem;
  display: block;
}

.checkbox-desc, .promote-desc {
  font-size: 0.7rem;
  color: #64748b;
}

.promote-content {
  justify-content: space-between;
}

.promote-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.promote-price {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #d97706;
}

/* ========== TAGS INPUT ========== */
.tags-input {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  background: #f1f5f9;
  border-radius: 2rem;
  font-size: 0.8rem;
}

.tag-colored {
  background: #e0e7ff;
  color: #4f46e5;
}

.tag-avatar {
  font-size: 0.9rem;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0 2px;
  color: #64748b;
}

.tag-remove:hover {
  color: #ef4444;
}

.tags-selector select, .tag-input-wrapper {
  width: 100%;
  padding: 0.6rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 0.75rem;
  background: white;
}

.tag-input-wrapper {
  display: flex;
  gap: 0.5rem;
  padding: 0.3rem;
}

.tag-input-wrapper input {
  flex: 1;
  border: none;
  padding: 0.5rem;
  outline: none;
}

.btn-add-tag {
  padding: 0.3rem 0.8rem;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

/* ========== FORM NAVIGATION ========== */
.form-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.nav-btn.prev {
  background: #f1f5f9;
  color: #475569;
}

.nav-btn.prev:hover {
  background: #e2e8f0;
}

.nav-btn.next {
  background: #4f46e5;
  color: white;
  margin-left: auto;
}

.nav-btn.next:hover:not(:disabled) {
  background: #4338ca;
  transform: translateX(4px);
}

.nav-btn.publish {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  width: 100%;
  justify-content: center;
}

.nav-btn.publish:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

  .steps-container {
    flex-direction: column;
    gap: 0.5rem;
  }

  .step-item {
    width: 100%;
  }

  .step-content {
    flex: 1;
  }

  .form-sections {
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-group.full-width {
    grid-column: span 1;
  }

  .radio-group {
    grid-template-columns: 1fr;
  }

  .form-navigation {
    padding: 1rem 1.5rem;
    flex-wrap: wrap;
  }

  .nav-btn.next {
    margin-left: 0;
    flex: 1;
  }

  .nav-btn.prev {
    flex: 1;
  }

  .page-header h1 {
    font-size: 1.5rem;
  }
}
</style>
