<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner color="primary" size="3rem" />
    </div>
    <div v-else-if="event" class="row">
      <div class="col-12 col-md-8">
        <q-img :src="event.imagem" height="300px" />
        <div class="q-mt-md">
          <div class="text-h4">{{ event.titulo }}</div>
          <div class="text-subtitle1 q-mt-sm">
            <q-icon name="place" /> {{ event.localizacao }}
          </div>
          <div class="text-subtitle1">
            <q-icon name="calendar_today" /> {{ formatDate(event.dataHora) }}
          </div>
          <q-badge :color="event.tipo === 'gratuito' ? 'positive' : 'primary'" class="q-mt-sm">
            {{ event.tipo === 'gratuito' ? 'Grátis' : 'Pago' }}
          </q-badge>
          <q-badge color="secondary" class="q-ml-sm">{{ categoryName }}</q-badge>
          <div class="q-mt-md">
            <div class="text-h6">Descrição</div>
            <p>{{ event.descricao }}</p>
          </div>
          <div class="q-mt-md">
            <div class="text-h6">Limite de participantes</div>
            <p>{{ event.limiteParticipantes.toLocaleString() }} pessoas</p>
          </div>
          <div class="q-mt-md">
            <div class="text-h6">Mapa fake da localização</div>
            <q-card flat bordered>
              <q-card-section>
                <div class="bg-grey-3 text-center q-pa-md" style="height: 200px">
                  <q-icon name="map" size="48px" />
                  <div>📍 Coordenadas aproximadas: {{ event.coordenadas ? `${event.coordenadas.lat}, ${event.coordenadas.lng}` : 'Evento online' }}</div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 q-pl-md">
        <div class="text-h6">Convidados</div>
        <div class="row q-col-gutter-md q-mt-sm">
          <div v-for="guest in guests" :key="guest.id" class="col-12">
            <GuestCard :guest="guest" @click="goToGuest(guest.id)" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eventService } from '../services/eventService'
import { guestService } from '../services/guestService'
import { categoryService } from '../services/categoryService'
import GuestCard from '../components/GuestCard.vue'

const route = useRoute()
const router = useRouter()
const event = ref(null)
const guests = ref([])
const categoryName = ref('')
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const eventId = parseInt(route.params.id)
    event.value = await eventService.getEventById(eventId)
    const category = await categoryService.getCategoryById(event.value.categoryId)
    categoryName.value = category.nome
    // Carregar convidados completos
    const guestPromises = event.value.guestIds.map(id => guestService.getGuestById(id))
    guests.value = await Promise.all(guestPromises)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateStr) => new Date(dateStr).toLocaleString('pt-BR')
const goToGuest = (id) => router.push(`/guest/${id}`)
</script>
