<template>
  <q-card flat bordered class="filter-panel">
    <q-card-section>
      <div class="text-h6">Filtros</div>
      <q-separator class="q-mt-sm q-mb-md" />

      <q-select
        v-model="localFilters.categoryId"
        :options="categoryOptions"
        label="Categoria"
        option-value="id"
        option-label="nome"
        emit-value
        map-options
        clearable
        dense
        class="q-mb-md"
      />

      <q-select
        v-model="localFilters.tipo"
        :options="tipoOptions"
        label="Tipo de evento"
        dense
        clearable
        class="q-mb-md"
      />

      <q-select
        v-model="localFilters.guestId"
        :options="guestOptions"
        label="Convidado específico"
        option-value="id"
        option-label="nome"
        emit-value
        map-options
        clearable
        dense
        class="q-mb-md"
      />

      <q-input
        v-model="localFilters.localizacao"
        label="Cidade / Local"
        dense
        class="q-mb-md"
      />

      <q-input
        v-model="localFilters.dataInicio"
        label="Data inicial"
        type="date"
        dense
        class="q-mb-md"
      />

      <q-input
        v-model="localFilters.dataFim"
        label="Data final"
        type="date"
        dense
        class="q-mb-md"
      />

      <q-btn label="Aplicar filtros" color="primary" @click="applyFilters" class="full-width" />
      <q-btn label="Limpar" flat color="grey" @click="clearFilters" class="full-width q-mt-sm" />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoryService } from '../services/categoryService'
import { guestService } from '../services/guestService'

const emit = defineEmits(['filter-change'])

const categoryOptions = ref([])
const guestOptions = ref([])
const tipoOptions = [
  { label: 'Todos', value: 'todos' },
  { label: 'Gratuito', value: 'gratuito' },
  { label: 'Pago', value: 'pago' }
]

const localFilters = ref({
  categoryId: null,
  tipo: null,
  guestId: null,
  localizacao: '',
  dataInicio: '',
  dataFim: ''
})

onMounted(async () => {
  const categories = await categoryService.getCategories()
  categoryOptions.value = categories
  const guests = await guestService.getGuests()
  guestOptions.value = guests
})

const applyFilters = () => {
  const filtersToSend = { ...localFilters.value }
  if (filtersToSend.tipo === null) filtersToSend.tipo = 'todos'
  emit('filter-change', filtersToSend)
}

const clearFilters = () => {
  localFilters.value = {
    categoryId: null,
    tipo: null,
    guestId: null,
    localizacao: '',
    dataInicio: '',
    dataFim: ''
  }
  applyFilters()
}
</script>
