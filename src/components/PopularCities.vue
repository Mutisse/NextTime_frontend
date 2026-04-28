<template>
  <div class="q-mt-xl">
    <div class="text-h5 q-mb-md">Cidades populares</div>
    <div class="row q-gutter-sm">
      <q-chip
        v-for="city in cities"
        :key="city"
        clickable
        @click="$emit('select-city', city)"
        color="grey-3"
        text-color="dark"
        icon="place"
      >
        {{ city }}
      </q-chip>
    </div>
  </div>
</template>

<script setup>
const cities = ['Maputo', 'Beira', 'Nampula', 'Matola', 'Chimoio', 'Quelimane', 'Tete']
defineEmits(['select-city'])
</script>
