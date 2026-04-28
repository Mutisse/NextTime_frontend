<template>
  <q-page class="q-pa-md">
    <div v-if="loading" class="flex flex-center q-py-xl">
      <q-spinner color="primary" size="3rem" />
    </div>
    <div v-else-if="guest" class="row">
      <div class="col-12 col-md-4 text-center">
        <q-avatar size="180px">
          <img :src="guest.foto" />
        </q-avatar>
        <div class="text-h4 q-mt-md">{{ guest.nome }}</div>
        <div class="text-subtitle1 text-grey">{{ guest.tipo }}</div>
        <div class="q-mt-sm">
          <q-rating v-model="guest.popularidade" :max="100" size="1.5rem" color="amber" readonly />
        </div>
        <div class="q-mt-md">
          <q-chip v-for="tag in guest.tags" :key="tag">{{ tag }}</q-chip>
        </div>
        <div class="q-mt-md">
          <div v-if="guest.redes.instagram" class="q-mb-sm">
            <q-icon name="fab fa-instagram" size="24px" class="q-mr-sm" />
            <a :href="`https://instagram.com/${guest.redes.instagram}`" target="_blank">{{ guest.redes.instagram }}</a>
          </div>
          <div v-if="guest.redes.tiktok">
            <q-icon name="fab fa-tiktok" size="24px" class="q-mr-sm" />
            <a :href="`https://tiktok.com/@${guest.redes.tiktok}`" target="_blank">{{ guest.redes.tiktok }}</a>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-8">
        <div class="text-h5">Biografia</div>
        <p>{{ guest.descricao }}</p>
        <q-separator class="q-my-md" />
        <div class="text-h5">Eventos que participa</div>
        <div v-if="eventsLoading" class="flex flex-center q-py-md">
          <q-spinner size="2rem" />
        </div>
        <div v-else-if="relatedEvents.length === 0" class="text-grey">
          Nenhum evento encontrado.
        </div>
        <div class="row q-col-gutter-md q-mt-sm">
          <div v-for="ev in relatedEvents" :key="ev.id" class="col-12 col-sm-6">
            <EventCard :event="ev" :categoryName="getCategoryName(ev.categoryId)" @click="goToEvent(ev.id)" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { guestService } from '../services/guestService'
import { eventService } from '../services/eventService'
import { categoryService } from '../services/categoryService'
import EventCard from '../components/EventCard.vue'

const route = useRoute()
const router = useRouter()
const guest = ref(null)
const relatedEvents = ref([])
const loading = ref(false)
const eventsLoading = ref(false)
const categoriesMap = ref({})

onMounted(async () => {
  loading.value = true
  try {
    const guestId = parseInt(route.params.id)
    guest.value = await guestService.getGuestById(guestId)
    const cats = await categoryService.getCategories()
    cats.forEach(c => categoriesMap.value[c.id] = c.nome)
    eventsLoading.value = true
    relatedEvents.value = await eventService.getEventsByGuest(guestId)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    eventsLoading.value = false
  }
})

const getCategoryName = (id) => categoriesMap.value[id] || ''
const goToEvent = (id) => router.push(`/event/${id}`)
</script>
