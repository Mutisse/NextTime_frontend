<template>
  <q-page class="q-pa-md">
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-input
          v-model="searchQuery"
          label="Buscar eventos ou convidados..."
          outlined
          dense
          @keyup.enter="performSearch"
          clearable
        >
          <template v-slot:append>
            <q-btn flat round dense icon="search" @click="performSearch" />
          </template>
        </q-input>
      </div>
    </div>
    <div v-if="searchPerformed" class="q-mt-lg">
      <div v-if="searching" class="flex flex-center q-py-xl">
        <q-spinner size="3rem" />
      </div>
      <div v-else>
        <div class="text-h5 q-mb-md">Eventos encontrados ({{ eventsResult.length }})</div>
        <div class="row q-col-gutter-md">
          <div v-for="event in eventsResult" :key="event.id" class="col-12 col-sm-6 col-md-4">
            <EventCard :event="event" :categoryName="getCategoryName(event.categoryId)" @click="goToEvent(event.id)" />
          </div>
        </div>
        <q-separator class="q-my-lg" />
        <div class="text-h5 q-mb-md">Convidados encontrados ({{ guestsResult.length }})</div>
        <div class="row q-col-gutter-md">
          <div v-for="guest in guestsResult" :key="guest.id" class="col-12 col-sm-6 col-md-4">
            <GuestCard :guest="guest" @click="goToGuest(guest.id)" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { eventService } from '../services/eventService'
import { guestService } from '../services/guestService'
import { categoryService } from '../services/categoryService'
import EventCard from '../components/EventCard.vue'
import GuestCard from '../components/GuestCard.vue'

const router = useRouter()
const searchQuery = ref('')
const eventsResult = ref([])
const guestsResult = ref([])
const searching = ref(false)
const searchPerformed = ref(false)
const categoriesMap = ref({})

const loadCategories = async () => {
  const cats = await categoryService.getCategories()
  cats.forEach(c => categoriesMap.value[c.id] = c.nome)
}
loadCategories()

const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  searching.value = true
  searchPerformed.value = true
  try {
    const [events, guests] = await Promise.all([
      eventService.searchEvents(searchQuery.value),
      guestService.searchGuests(searchQuery.value)
    ])
    eventsResult.value = events
    guestsResult.value = guests
  } finally {
    searching.value = false
  }
}

const getCategoryName = (id) => categoriesMap.value[id] || ''
const goToEvent = (id) => router.push(`/event/${id}`)
const goToGuest = (id) => router.push(`/guest/${id}`)
</script>
