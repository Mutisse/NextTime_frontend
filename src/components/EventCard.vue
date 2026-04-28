<template>
  <q-card class="event-card" flat bordered>
    <q-badge v-if="event.promovido" color="orange" class="promoted-badge">Promovido</q-badge>
    <q-img :src="event.imagem" height="160px" />
    <q-card-section>
      <div class="text-subtitle1 text-weight-bold">{{ event.titulo }}</div>
      <div class="text-caption text-grey-7">
        {{ formatDate(event.dataHora) }} • {{ event.localizacao }}
      </div>
      <div class="row q-mt-sm q-col-gutter-sm">
        <q-badge v-if="event.tipo === 'gratuito'" color="positive">Grátis</q-badge>
        <q-badge v-if="event.lotacao === 'quase cheio'" color="warning">Quase cheio</q-badge>
        <q-badge v-if="event.novidade" color="info">Adicionado agora</q-badge>
        <q-badge v-if="event.venda_terminando" color="negative">Venda terminando</q-badge>
      </div>
      <div class="q-mt-sm">
        <q-chip v-for="guest in displayGuests" :key="guest.id" dense clickable @click="goToGuest(guest.id)" size="sm">
          <q-avatar size="20px"><img :src="guest.foto" /></q-avatar>
          {{ guest.nome.split(' ')[0] }}
        </q-chip>
        <q-chip v-if="event.guestIds.length > 3" dense size="sm">+{{ event.guestIds.length - 3 }}</q-chip>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn flat color="primary" label="Ver detalhes" @click="$emit('click')" />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { guests } from '../mocks/data.js'

const props = defineProps({ event: Object })
const router = useRouter()

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

const displayGuests = computed(() => {
  return props.event.guestIds.slice(0, 3).map(id => guests.find(g => g.id === id)).filter(Boolean)
})

const goToGuest = (id) => router.push(`/guest/${id}`)
</script>

<style scoped>
.event-card {
  transition: transform 0.2s;
  position: relative;
}
.event-card:hover { transform: translateY(-4px); }
.promoted-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}
</style>
