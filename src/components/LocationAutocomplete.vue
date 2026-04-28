<template>
  <q-select
    v-model="selectedLocation"
    :options="cities"
    label="Procurar eventos em"
    outlined
    dense
    use-input
    hide-selected
    fill-input
    input-debounce="300"
    @filter="filterCities"
    @update:model-value="onLocationChange"
    style="min-width: 200px"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Nenhuma cidade encontrada
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref } from 'vue'

const citiesList = [
  'Maputo', 'Beira', 'Nampula', 'Matola', 'Chimoio', 'Quelimane', 'Tete', 'Xai-Xai', 'Pemba'
]
const cities = ref(citiesList)
const selectedLocation = ref('Maputo')
const emit = defineEmits(['update:location'])

const filterCities = (val, update) => {
  if (val === '') {
    update(() => { cities.value = citiesList })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    cities.value = citiesList.filter(c => c.toLowerCase().indexOf(needle) > -1)
  })
}

const onLocationChange = (val) => {
  if (val) emit('update:location', val)
}
</script>
