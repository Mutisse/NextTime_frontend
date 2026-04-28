<template>
  <div class="category-chips q-pa-sm">
    <q-chip
      v-for="cat in categories"
      :key="cat.id"
      :color="selectedCategoryId === cat.id ? 'primary' : 'grey-3'"
      :text-color="selectedCategoryId === cat.id ? 'white' : 'dark'"
      clickable
      @click="emit('select', cat.id)"
      class="q-mr-sm q-mb-sm"
    >
      {{ cat.nome }}
    </q-chip>
    <q-chip
      v-if="selectedCategoryId"
      clickable
      @click="emit('select', null)"
      icon="clear"
      color="negative"
      label="Limpar"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoryService } from '../services/categoryService'

const categories = ref([])
const props = defineProps(['selectedCategoryId'])
const emit = defineEmits(['select'])

onMounted(async () => {
  categories.value = await categoryService.getCategories()
})
</script>
