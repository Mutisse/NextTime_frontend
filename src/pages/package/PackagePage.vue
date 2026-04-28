<template>
  <div class="q-pa-md">
    <div class="q-mb-md">
      <h1 class="text-h4 text-primary">Pacotes</h1>
      <p class="text-subtitle1">Gerencie seus pacotes de serviços</p>
    </div>

    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6" v-for="item in packages" :key="item.id">
            <q-card bordered flat>
              <q-card-section>
                <div class="text-h6">{{ item.name }}</div>
                <div class="text-caption text-grey">{{ item.description }}</div>
                <div class="q-mt-md">
                  <span class="text-h5 text-primary">{{ item.price }} MZN</span>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-actions align="right">
                <q-btn flat color="primary" label="Ver detalhes" @click="viewPackage(item.id)" />
                <q-btn flat color="positive" label="Comprar" @click="buyPackage(item.id)" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const packages = ref([
  { id: 1, name: 'Pacote Básico', description: 'Ideal para pequenos negócios', price: 500 },
  { id: 2, name: 'Pacote Profissional', description: 'Para negócios em crescimento', price: 1000 },
  { id: 3, name: 'Pacote Empresarial', description: 'Solução completa para empresas', price: 2500 }
])

const viewPackage = (id) => {
  router.push(`/package/${id}`)
}

const buyPackage = (id) => {
  router.push(`/checkout/package/${id}`)
}
</script>

<style scoped>
.text-h4 {
  font-size: 1.75rem;
  font-weight: 600;
}
</style>
