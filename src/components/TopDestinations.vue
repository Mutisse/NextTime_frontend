<template>
  <div class="q-mt-xl">
    <div class="text-h5 q-mb-md">Destinos principais em Moçambique</div>
    <div class="row q-col-gutter-md">
      <div v-for="city in destinations" :key="city.nome" class="col-6 col-sm-4 col-md-2">
        <q-card flat bordered class="cursor-pointer" @click="selectCity(city.nome)">
          <q-img :src="city.imagem" height="120px" />
          <q-card-section class="text-center">
            <div class="text-subtitle1">{{ city.nome }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
const destinations = [
  { nome: 'Maputo', imagem: 'https://picsum.photos/id/104/200/150' },
  { nome: 'Beira', imagem: 'https://picsum.photos/id/29/200/150' },
  { nome: 'Nampula', imagem: 'https://picsum.photos/id/96/200/150' },
  { nome: 'Pemba', imagem: 'https://picsum.photos/id/177/200/150' },
  { nome: 'Inhambane', imagem: 'https://picsum.photos/id/26/200/150' },
  { nome: 'Vilankulo', imagem: 'https://picsum.photos/id/116/200/150' }
]
const emit = defineEmits(['select-city'])
const selectCity = (city) => emit('select-city', city)
</script>
