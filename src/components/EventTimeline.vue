<template>
  <div class="event-timeline">
    <div v-for="event in events" :key="event.id" class="timeline-item">
      <q-timeline-entry :title="event.titulo" :subtitle="formatDate(event.dataHora)" side="left">
        <template v-slot:right>
          <q-btn flat dense round icon="chevron_right" @click="$emit('event-click', event.id)" />
        </template>
      </q-timeline-entry>
    </div>
  </div>
</template>

<script setup>
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('pt-BR')
}
defineProps(['events'])
defineEmits(['event-click'])
</script>
